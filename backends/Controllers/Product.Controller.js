// Model
const productModel = require("../Models/Product.model");
const PurchasedItem = require("../Models/purchasedItem.model");
const notiModel = require("../Models/notification.model");
const Fuse = require("fuse.js");


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
  description: joi.string().required().max(300).messages({
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

    // console.log(req.body);
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
        bestseller: bestseller === "true" ? true : false,
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
  try {
    const { name, category, minPrice, maxPrice, bestseller, color, rating } = req.query;
    let filter = {};

    if (name) filter.name = { $regex: new RegExp(name, "i") };
    if (category) filter.category = category;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (bestseller) filter.bestseller = bestseller === "true";
    if (color) filter.color = color;
    if (rating) filter.rating = { $gte: Number(rating) };

    const products = await productModel.find(filter);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

};
const productReview = async (req, res) => {
  try {
    const { rating, comment,productId } = req.body;
console.log(req.body)
    const product = await productModel.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ error: true, message: "Product not found" });
    }

    const hasPurchased = await PurchasedItem.findOne({
      user: req.user._id,
      item: productId,
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
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, message: "Query is required" });

    const products = await productModel.find(); // Fetch all products

    const fuse = new Fuse(products, {
      keys: ["name", "description", "category", "brand"], // Fields to search in
      threshold: 0.3, // Lower values mean stricter matching
      distance: 100, // Maximum distance for fuzzy matches
    });

    const results = fuse.search(query).map((item) => item.item);
    res.json({ success: true, products: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const likeUnlikeProduct = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return next({ statusCode: 404, message: "Unable to find the product" });
    }

    const alreadyLiked = product.likes.some(like => like.users.toString() === req.user._id.toString());
    //console.log(alreadyLiked)
    if (alreadyLiked) {
      await productModel.findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: { users: req.user._id } } }
      );
      return res.status(200).json({ error: false, message: "Unliked." });
    } else {
      await productModel.findByIdAndUpdate(
        req.params.id,
        { $push: { likes: { users: req.user._id } } }
      );

      const notification = new notiModel({
        from: req.user._id,
        type: "like",
        
      });
      await notification.save();

      return res.status(200).json({ error: false, message: "Liked." });
    }
  } catch (error) {
    console.error("Error in Liking/Unliking Product:", error);
    next(error);
  }
};
const getLikes=async(req,res)=>{
  try {
    const noti=await notiModel.find({
      type:'like'
    }).populate('user');
    return res.status(200).json({error:true,notification:noti})

    
  } catch (error) {
    console.log('Error in get likes')
    return res.status(500).json({error:true,message:'Couldnot get'})
    
  }
}

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
  getLikes
};
