const Category = require("../models/category.model");
const joi = require("joi");

const categorySchema = joi.object({
  name: joi.string().max(30).required(),
});

const createCategory = async (req, res) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    console.log("Error", error.details[0].message);
    return res.status(404).json({ error: true, message: "Invalid Category" });
  }
  const { name } = req.body;
  try {
    const categoryName = await Category.findOne({ name });
    if (categoryName) {
      return res
        .status(403)
        .json({ error: true, message: "Category Already Exists." });
    }
    const trimmedName = name.replace(/\s+/g, "");
    const newCategory = new Category({ name: trimmedName });

    await newCategory.save();
    return res.status(201).json({ message: newCategory, error: false });
  } catch (error) {
    console.log("Error in CreateCategory", error);
    return res
      .status(404)
      .json({ error: true, message: "Couldnot Create Category." });
  }
};
const updateCategory = async (req, res) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    console.log("Error", error.details[0].message);
    return res.status(404).json({ error: true, message: "Invalid Category" });
  }
  const { categoryId } = req.params;
  const { name } = req.body;

  try {
    const categoryInDb = await Category.findById(categoryId);

    if (!categoryInDb) {
      return res
        .status(404)
        .json({ error: true, message: "couldnt found your category." });
    }

    if (categoryInDb.updatedAt.getDate() === new Date().getDate()) {
      return res.status(404).json({
        error: true,
        message: "Looks like you changed the name recently,so wait for 24 hr.",
      });
    }
    const trimmedName = name.replace(/\s+/g, "");

    categoryInDb.name = trimmedName || categoryInDb.name;
    await categoryInDb.save();
    return res.status(200).json({ error: false, message: categoryInDb });
  } catch (error) {
    console.log("Error in Updatecategory", error);
    return res
      .status(404)
      .json({ error: true, message: "Couldnot Update Category" });
  }
};
const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const categoryInDb = await Category.findByIdAndDelete(categoryId);
    //console.log(categoryInDb)

    if (!categoryInDb) {
      return res
        .status(404)
        .json({ error: true, message: "Couldnt Found your Category." });
    }

    const allCategory = await Category.find({});

    return res
      .status(200)
      .json({ error: false, message: "Category Deleted", allCategory });
  } catch (error) {
    console.log("Error in Deletecategory", error);
    return res
      .status(404)
      .json({ error: true, message: "Couldnot Delete Category" });
  }
};
const getCategory = async (req, res) => {
  try {
    const allcategoryInDb = await Category.find({});

    //console.log(categoryInDb)
    if (allcategoryInDb.length === 0) {
      return res.status(404).json({ error: true, message: "Empty category." });
    } else {
      return res.status(200).json({ error: false, message: allcategoryInDb });
    }
  } catch (error) {
    console.log("Error in getcategory", error);
    return res
      .status(404)
      .json({ error: true, message: "Couldnot getCategory" });
  }
};
const getCategoryById = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const categoryInDb = await Category.findById(categoryId);

    if (!categoryInDb) {
      return res
        .status(404)
        .json({ error: true, message: "couldnt found your category." });
    }

    return res.status(200).json({ error: false, message: categoryInDb });
  } catch (error) {
    console.log("Error in getcategorybyid", error);
    return res
      .status(404)
      .json({ error: true, message: "Couldnot find the Category" });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getCategoryById,
};
