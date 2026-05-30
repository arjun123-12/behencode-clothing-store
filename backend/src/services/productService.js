const productRepository = require('../repositories/productRepository');
const Category = require('../models/Category');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const ApiError = require('../utils/ApiError');

class ProductService {
  async getProducts(queryParams) {
    const { category, size, minPrice, maxPrice, search, isBestseller, isNewIn, sort } = queryParams;
    let query = {};

    if (category) {
      let targetCategory = null;
      if (mongoose.Types.ObjectId.isValid(category)) {
        targetCategory = await Category.findById(category);
      } else {
        targetCategory = await Category.findOne({ name: { $regex: new RegExp('^' + category.trim() + '$', 'i') } });
      }

      if (targetCategory) {
        const getDescendantIds = async (parentId) => {
          let ids = [parentId];
          const children = await Category.find({ parent: parentId });
          for (const child of children) {
            const childIds = await getDescendantIds(child._id);
            ids = [...ids, ...childIds];
          }
          return ids;
        };
        const categoryIds = await getDescendantIds(targetCategory._id);
        query.category = { $in: categoryIds };
      } else {
        query.category = null;
      }
    }

    if (size) {
      query.sizes = size;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (isBestseller) {
      query.isBestseller = isBestseller === 'true';
    }

    if (isNewIn) {
      query.isNewIn = isNewIn === 'true';
    }

    let sortObj = { createdAt: -1 };
    if (sort) {
      if (sort === 'priceAsc') {
        sortObj = { price: 1 };
      } else if (sort === 'priceDesc') {
        sortObj = { price: -1 };
      } else if (sort === 'oldest') {
        sortObj = { createdAt: 1 };
      }
    }

    return await productRepository.find(query, sortObj);
  }

  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return product;
  }

  async createProduct(data, files, bodyImages) {
    const { name, description, price, discountPrice, category, sizes, stockQuantity, isBestseller, isNewIn, isTrending, salesCount, views } = data;

    let images = [];
    if (files && files.length > 0) {
      images = files.map(file => `/uploads/${file.filename}`);
    } else if (bodyImages) {
      images = Array.isArray(bodyImages) ? bodyImages : [bodyImages];
    }

    if (images.length === 0) {
      throw new ApiError(400, 'Please upload at least one image');
    }

    let processedSizes = sizes;
    if (typeof sizes === 'string') {
      processedSizes = sizes.split(',').map(s => s.trim().toUpperCase());
    }

    let resolvedCategory = category;
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      const catObj = await Category.findOne({ name: { $regex: new RegExp('^' + category.trim() + '$', 'i') } });
      if (catObj) {
        resolvedCategory = catObj._id;
      }
    }

    return await productRepository.create({
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      category: resolvedCategory,
      sizes: processedSizes || ['S', 'M', 'L'],
      images,
      stockQuantity: stockQuantity ? Number(stockQuantity) : 10,
      inStock: stockQuantity > 0,
      isBestseller: isBestseller === 'true' || isBestseller === true,
      isNewIn: isNewIn === 'true' || isNewIn === true,
      isTrending: isTrending === 'true' || isTrending === true,
      salesCount: salesCount ? Number(salesCount) : 0,
      views: views ? Number(views) : 0,
    });
  }

  async updateProduct(id, body, files) {
    let product = await productRepository.findById(id);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    let images = product.images;
    if (body.images) {
      images = Array.isArray(body.images) ? body.images : [body.images];
    }
    if (files && files.length > 0) {
      const newImages = files.map(file => `/uploads/${file.filename}`);
      images = [...images, ...newImages];
    }

    if (body.deletedImages) {
      const deleted = Array.isArray(body.deletedImages) ? body.deletedImages : [body.deletedImages];
      images = images.filter(img => !deleted.includes(img));

      deleted.forEach(img => {
        if (img.startsWith('/uploads/')) {
          const filePath = path.join(__dirname, '../..', img);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      });
    }

    let processedSizes = body.sizes;
    if (typeof body.sizes === 'string') {
      processedSizes = body.sizes.split(',').map(s => s.trim().toUpperCase());
    }

    let resolvedCategory = body.category || product.category;
    if (body.category && !mongoose.Types.ObjectId.isValid(body.category)) {
      const catObj = await Category.findOne({ name: { $regex: new RegExp('^' + body.category.trim() + '$', 'i') } });
      if (catObj) {
        resolvedCategory = catObj._id;
      }
    }

    const updatedData = {
      name: body.name || product.name,
      description: body.description || product.description,
      price: body.price ? Number(body.price) : product.price,
      discountPrice: (body.discountPrice === '' || body.discountPrice === '0' || body.discountPrice === 'null')
        ? null
        : (body.discountPrice ? Number(body.discountPrice) : product.discountPrice),
      category: resolvedCategory,
      sizes: processedSizes || product.sizes,
      images,
      stockQuantity: body.stockQuantity !== undefined ? Number(body.stockQuantity) : product.stockQuantity,
      isBestseller: body.isBestseller !== undefined ? (body.isBestseller === 'true' || body.isBestseller === true) : product.isBestseller,
      isNewIn: body.isNewIn !== undefined ? (body.isNewIn === 'true' || body.isNewIn === true) : product.isNewIn,
      isTrending: body.isTrending !== undefined ? (body.isTrending === 'true' || body.isTrending === true) : product.isTrending,
      salesCount: body.salesCount !== undefined ? Number(body.salesCount) : product.salesCount,
      views: body.views !== undefined ? Number(body.views) : product.views,
    };

    updatedData.inStock = updatedData.stockQuantity > 0;

    return await productRepository.findByIdAndUpdate(id, updatedData);
  }

  async deleteProduct(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    product.images.forEach(img => {
      if (img.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '../..', img);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    await Product.findByIdAndDelete(id);
    return true;
  }
}

module.exports = new ProductService();
