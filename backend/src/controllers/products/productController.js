const productService = require('../../services/productService');
const ApiResponse = require('../../utils/ApiResponse');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts(req.query);
    res.status(200).json(new ApiResponse(200, { count: products.length, products }, 'Products retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json(new ApiResponse(200, { product }, 'Product details retrieved'));
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body, req.files, req.body.images);
    res.status(201).json(new ApiResponse(201, { product }, 'Product added successfully'));
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body, req.files);
    res.status(200).json(new ApiResponse(200, { product }, 'Product updated successfully'));
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Product removed successfully'));
  } catch (error) {
    next(error);
  }
};
