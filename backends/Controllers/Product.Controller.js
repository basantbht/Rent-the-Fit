// Model
const productModel = require('../Models/Product.model');

// Module
const joi = require("joi");
const cloudinary = require("../cloudCofig/config");

const productSchema = joi.object({
  name: joi.string().required().max(30).messages({
    "string.empty": "Product name is required.",
    "string.max": "Product name cannot exceed 30 characters.",
  }),
  brand: joi.string().required().max(30).messages({
    "string.empty": "Brand is required.",
    "string.max": "Brand name cannot exceed 30 characters.",
  }),  
  category: joi.string().required().max(30).messages({
    "string.empty": "Category is required.",
    "string.max": "Category name cannot exceed 30 characters.",
  }),
  quantity: joi.string().required().messages({
    "string.empty": "Quantity is required.",
  }),
  description: joi.string().required().max(100).messages({
    "string.empty": "Description is required.",
    "string.max": "Description cannot exceed 100 characters.",
  }),
  price: joi.number().required().min(0).messages({
    "number.base": "Price must be a number.",
    "number.empty": "Price is required.",
    "number.min": "Price must be a positive number.",
  }),
  sizes: joi.string().required().messages({
    "string.empty": "Sizes are required.",
  }),
  bestseller:joi.boolean().required()
});

const createProduct = async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body);
    if (error) {
      return res.status(404).json({ error: true, message: error.message });
    }
    const { name, brand, quantity, category, description, price, sizes, bestseller } =
      req.body;
    //console.log(req.file);
    const image = req.file;
    if (!image) {
      return res.status(400).json({ error: true, message: "No Image Found" });
    }
    let cloudRes = await cloudinary.uploader.upload(image.path, {
      folder: "product-image",
    });
    // console.log(cloudRes);

    const newProduct = new productModel({
      name,
      brand,
      quantity,
      category,
      description,
      price:Number(price),
      sizes:JSON.parse(sizes),

      image: cloudRes.secure_url,
      bestseller: bestseller === "true" ? true : false,
      date:Date.now()
    });
    await newProduct.save();
    return res.status(201).json({ error: false, message: "Product Added" });
  } catch (error) {
    console.log("Error in CreateProduct", error);
    return res
      .status(400)
      .json({ error: true, message: "Couldnot Create the Product" });
  }
};

const ReadProduct = async (req, res) => {
  try {
    // sort -1 => descending order
    // sort 1 => ascending order
    const allProduct = await productModel.find({}).sort({ name: 1 });

    if (allProduct.length === 0) {
      return res.status(404).json({ message: "Coulnt find product" });
    }

    return res.status(200).json({ error: false, allProduct });
  } catch (error) {
    console.log("Error in GetAllProduct", error);
    return res.status(404).json({ error: true, message: "Coulnt GetProduct." });
  }
};

const editProduct = async (req, res) => {
  console.log(req.body)
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res.status(404).json({ error: true, message: error.message });
  }
  try {
    const { name, brand, quantity, category, description, price, bestseller, sizes } =
      req.body;

    const image = req.file;
    if (!image) {
      return res.status(400).json({ error: true, message: "No Image Found" });
    }
    let cloudRes = await cloudinary.uploader.upload(image.path, {
      folder: "product-image",
    });

    const Product = await productModel.findById(req.params.id);
    if (!Product) {
      return res
        .status(404)
        .json({ error: true, message: "Product not found" });
    }

    // if (Product.updatedAt.getDate() === new Date().getDate()) {
    //   return res
    //     .status(404)
    //     .json({ error: true, message: "OOPS Wait for 24hr" });
    // }

    const updateProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        name: name || Product.name,
        brand: brand || Product.brand,
        quantity: quantity || Product.quantity,
        category: category || Product.category,
        description: description || Product.description,
        price: price || Product.price,
        sizes:sizes ? JSON.parse(sizes) : Product.sizes,
        image: cloudRes.secure_url || Product.image,
        bestseller: bestseller === true ? true : false,
      },
      { new: true }
    );

    return res.status(200).json({ error: false, message: updateProduct,msg: "Product Updated Successfully" });
  } catch (error) {
    console.log("Error in UpdateProduct", error);
    return res
      .status(400)
      .json({ error: true, message: "Couldnot Update Product." });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ error: true, message: "Product not found." });
    }

    const allProduct = await productModel.find({});

    return res
      .status(200)
      .json({ error: false, message: "Product removed", products: allProduct });
  } catch (error) {
    console.log("Error in RemoveProduct", error);
    return res
      .status(400)
      .json({ error: true, messsage: "Could not delete product." });
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
    return res.status(500).json({ message: "couldnot get product" });
  }
};
const productReview=async(req,res)=>{
  try {
    const { rating, comment } = req.body;
    const product = await productModel.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res
          .status(500)
          .json({ error: true, message: "Product Already reviewed" });
      }
      const review = {
        name: req.user.username,
        rating,
        comment,
        user: req.user._id,
      };
      product.reviews.push(review);
      await product.save();
      return res.status(200).json({ error: false, message: "review Added." });
    }
  } catch (error) {
    console.log("Error in productReviews", error);
    return res
      .status(500)
      .json({ error: true, message: "Something went wrong." });
  }

}
module.exports = {
  createProduct,
  ReadProduct,
  editProduct,
  deleteProduct,
  searchProduct,
  productReview
};
