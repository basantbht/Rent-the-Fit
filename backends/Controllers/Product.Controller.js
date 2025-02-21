// Model
const productModel = require("../Models/Product.model");
const PurchasedItem = require("../Models/purchasedItem.model");
const notiModel = require("../Models/notification.model");

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
  subCategory: joi.string().required().max(30).messages({
    "string.empty": "Category is required.",
    "string.max": "Category name cannot exceed 30 characters.",
  }),
  color: joi.string().required().max(30).messages({
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
  bestseller: joi.boolean().required(),
});

const createProduct = async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body);
    if (error) {
      return res.status(404).json({ error: true, message: error.message });
    }

    const { name, brand, quantity, category,subCategory,color, description, price, sizes, bestseller } =
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
      subCategory,
      color,
      description,
      price: Number(price),
      sizes: JSON.parse(sizes),

      image: cloudRes.secure_url,
      bestseller: bestseller === "true" ? true : false,
      date: Date.now(),
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
  console.log(req.body);
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res.status(404).json({ error: true, message: error.message });
  }
  try {

    const { name, brand, quantity, category, subCategory, color, description, price, bestseller, sizes } =
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
        subCategory: subCategory || Product.subCategory,
        color: color || Product.color,
        description: description || Product.description,
        price: price || Product.price,
        sizes: sizes ? JSON.parse(sizes) : Product.sizes,
        image: cloudRes.secure_url || Product.image,
        bestseller: bestseller === true ? true : false,
      },
      { new: true }
    );

    return res.status(200).json({
      error: false,
      message: updateProduct,
      msg: "Product Updated Successfully",
    });
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
const productReview = async (req, res) => {
  try {
    const { rating, comment, item } = req.body;

    const product = await productModel.findById(item);

    if (!product) {
      return res
        .status(404)
        .json({ error: true, message: "Product not found" });
    }

    const hasPurchased = await PurchasedItem.findOne({
      user: req.user._id,
      item: item,
      status: "completed",
    });

    if (!hasPurchased) {
      return res.status(403).json({
        error: true,
        message: "You can only review products you have purchased",
      });
    }

    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
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
      return res.status(200).json({ error: false, message: review });

    
  } catch (error) {
    console.error("Error in productReview", error);
    return res
      .status(500)
      .json({ error: true, message: "Something went wrong." });
  }
};


const getProductReview = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id).select('reviews'); 

    if (!product) {
      return res.status(404).json({ error: true, message: "Product not found" });
    }

    return res.status(200).json({ error: false, reviews: product.reviews });
  } catch (e) {
    console.log("Error in get reviews", e);
    return res.status(500).json({ error: true, message: "Could not retrieve reviews." });
  }
};



const recommendProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.body.id);
    if (!product) {
      return res
        .status(400)
        .json({ error: true, message: "Couldnot found product" });
    }
    const recommendProducts = await productModel
      .find({
        _id: { $ne: req.body.id },
        category: product.category,
      })
      .sort({ bestseller: -1 })
      .limit(5);
    return res.status(200).json({ error: false, recommendProducts });
  } catch (error) {
    console.log("error in recommending Product");
    return res.status(500).json({ error: true, message: "couldnot found." });
  }
};
const likeUnlikeProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return next({ statusCode: 404, message: "Unable to find the product" });
    }
    const alreadyLiked = product.likes.includes(req.user._id);
    if (alreadyLiked) {
      await productModel.updateOne(req.params.id, {
        $pull: { likes: req.user._id },
      });
      await product.save();
      return res.status(200).json({ error: false, message: "Unliked ." });
    } else {
      product.likes.push({
        user: req.user._id,
      });
      await post.save();
      const notification = new notiModel({
        from: req.user._id,
        type: "like",
        to: null,
      });
      await notification.save();
      return res.status(200).json({ error: false, message: "liked" });
    }
  } catch (error) {
    console.log("Error in Liking/Unliking Post");
    return res.status(500).json({ error: true, message: "Couldnot like it" });
  }
};
module.exports = {
  createProduct,
  ReadProduct,
  editProduct,
  deleteProduct,
  searchProduct,
  productReview,
  getProductReview,
  recommendProduct,
  likeUnlikeProduct,
};
