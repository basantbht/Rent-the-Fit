// Model
const productModel = require("../Models/Product.model");

// Module
const joi = require("joi");

const productSchema = joi.object({
  name: joi.string().required().max(30),
  brand: joi.string().required().max(30),
  quantity: joi.string().required(),
  category: joi.string().required(),
  description: joi.string().required().max(100),
  price: joi.string().required(),
  image: joi.string().required(),
});

const productDetail = async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body);
    if (error) {
      return res
        .status(404)
        .json({ error: true, message: error.details[0].message });
    }
    const { name, brand, quantity, category, description, price } = req.body;

    const newProduct = new productModel({
      name,
      brand,
      quantity,
      category,
      description,
      price,
    });
    await newProduct.save();
    return res.status(201).json({ erro: false, message: newProduct });
  } catch (error) {
    console.log("Error in CreateProduct", error);
    return res
      .status(404)
      .json({ error: true, message: "Couldnot Create the Product" });
  }
};

const ReadDetail = async (req, res) => {
  try {
    // sort -1 => descending order
    // sort 1 => ascending order
    const allProduct = await productModel.find({}).sort({ name: 1 }).limit(5);

    if (allProduct.length === 0) {
      return res.status(404).json({ message: "Coulnt find product" });
    }

    return res.status(200).json({ error: false, allProduct });
  } catch (error) {
    console.log("Error in GetAllProduct", error);
    return res.status(404).json({ error: true, message: "Coulnt GetProduct." });
  }
};

const editDetail = async (req, res) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res
      .status(404)
      .json({ error: true, message: error.details[0].message });
  }
  try {
    const { name, brand, quantity, category, description, price } = req.body;
    const Product = await productModel.findById(req.params.id);
    if (!Product) {
      return res
        .status(404)
        .json({ error: true, message: "Product not found" });
    }

    if (Product.updatedAt.getDate() === new Date().getDate()) {
      return res
        .status(404)
        .json({ error: true, message: "OOPS Wait for 24hr" });
    }

    const updateProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        brand,
        quantity,
        category,
        description,
        price,
      },
      { new: true }
    );

    return res.status(200).json({ error: false, message: updateProduct });
  } catch (error) {
    console.log("Error in UpdateProduct", error);
    return res
      .status(400)
      .json({ error: true, message: "Couldnot Update Product." });
  }
};

const deleteDetail = async (req, res) => {
  try {
    await product.findByIdAndDelete(req.params.id);

    const allProduct = await productModel.find({});

    return res
      .status(200)
      .json({ error: false, message: "Product removed", allProduct });
  } catch (error) {
    console.log("Error in RemoveProduct", error);
    return res
      .status(400)
      .json({ error: true, messsage: "Couldnot delete product." });
  }
};

const searchProduct = async (req, res) => {
  const searchingValue = req.query.value;
  // RegExp(searchingValue,"i")

  try {
    const searchdetail = await productModel.find({ name: searchingValue });
    // console.log(searchdetail);

    if (searchdetail.length > 0) {
      return res.status(200).json({ value: searchdetail });
    } else {
      return res
        .status(400)
        .json({ value: `OOPS :) CouldNot Found Your ${searchingValue}` });
    }
  } catch (e) {
    return res.status(500).json({ message: "ssdhghh" });
  }
};
module.exports = {
  productDetail,
  ReadDetail,
  editDetail,
  deleteDetail,
  searchProduct,
};
