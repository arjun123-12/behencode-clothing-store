const User = require('../models/User');

class UserRepository {
  async find(query = {}, sort = { createdAt: -1 }) {
    return await User.find(query).select('-password').sort(sort);
  }

  async findById(id) {
    return await User.findById(id);
  }

  async findOne(query, select = '') {
    let q = User.findOne(query);
    if (select) {
      q = q.select(select);
    }
    return await q;
  }

  async create(data) {
    return await User.create(data);
  }
}

module.exports = new UserRepository();
