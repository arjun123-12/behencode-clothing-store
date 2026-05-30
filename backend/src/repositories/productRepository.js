const Product = require('../models/Product');

class ProductRepository {
  async find(query = {}, sort = { createdAt: -1 }) {
    return await Product.find(query)
      .populate({
        path: 'category',
        populate: {
          path: 'parent',
          populate: { path: 'parent' }
        }
      })
      .sort(sort);
  }

  async findById(id) {
    return await Product.findById(id).populate({
      path: 'category',
      populate: {
        path: 'parent',
        populate: { path: 'parent' }
      }
    });
  }

  async create(data) {
    return await Product.create(data);
  }

  async findByIdAndUpdate(id, data, options = { new: true, runValidators: true }) {
    return await Product.findByIdAndUpdate(id, data, options);
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }
}

module.exports = new ProductRepository();
