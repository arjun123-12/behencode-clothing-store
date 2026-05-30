const Category = require('../../models/Category');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate({
      path: 'parent',
      select: 'name parent',
      populate: {
        path: 'parent',
        select: 'name'
      }
    });
    res.status(200).json(new ApiResponse(200, { count: categories.length, categories }, 'Categories tree retrieved'));
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, parent } = req.body;

    if (!name) {
      throw new ApiError(400, 'Category name is required');
    }

    let parentId = null;
    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        throw new ApiError(404, 'Parent category not found');
      }
      parentId = parentCategory._id;
    }

    const categoryExists = await Category.findOne({ name: name.trim(), parent: parentId });
    if (categoryExists) {
      throw new ApiError(400, 'Category name already exists under this parent');
    }

    const category = await Category.create({
      name: name.trim(),
      parent: parentId,
    });

    res.status(201).json(new ApiResponse(201, { category }, 'Category created successfully'));
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    // Recursively find and delete all descendants (subcategories and sub-subcategories)
    const deleteDescendants = async (parentId) => {
      const children = await Category.find({ parent: parentId });
      for (const child of children) {
        await deleteDescendants(child._id);
        await Category.findByIdAndDelete(child._id);
      }
    };

    await deleteDescendants(category._id);
    await Category.findByIdAndDelete(category._id);

    res.status(200).json(new ApiResponse(200, null, 'Category and all its subcategories removed successfully'));
  } catch (error) {
    next(error);
  }
};
