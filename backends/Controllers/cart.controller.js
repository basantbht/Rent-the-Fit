const Product = require("../models/product.model");

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    //console.log(user.cartItems);
    const productExists = await Product.findById(productId);

    if (!productExists) {
      return res
        .status(404)
        .json({ error: true, message: "Product not found." });
    }

    const existingProduct = user.cartItems.find(
      (item) => item.id === productId
    );
    //console.log(existingProduct);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      //console.log('inside else');
      user.cartItems.push(productId);
    }
    await user.save();
    return res
      .status(200)
      .json({ error: false, message: "product added.", items: user.cartItems });
  } catch (error) {
    console.log("Error in addtocart", error);
    return res
      .status(500)
      .json({ error: true, message: "couldnot add to cart." });
  }
};
const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    await user.save();
    return res.status(200).json({ error: false, message: user.cartItems });
  } catch (error) {
    console.log("Error in removecart", error);
    return res
      .status(500)
      .json({ error: true, message: "coudlnot remove item" });
  }
};
const updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item.id == id);

    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== id);
        await user.save();
        return res.json({ error: false, message: user.cartItems });
      } else if (quantity > 0 && quantity <= 10) {
        existingItem.quantity = quantity;
        await user.save();

        return res.json({ error: false, message: user.cartItems });
      } else {
        return res.json({
          error: true,
          message: "provide a appropriate value",
        });
      }
    }
  } catch (error) {
    console.log("Error in updatecart", error);
    return res
      .status(500)
      .json({ error: true, message: "coudlnot update item" });
  }
};
const allItems = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ error: false, message: user.cartItems });
  } catch (error) {
    console.log("Error in allCart", error);
    return res.status(500).json({ error: true, message: "couldnot get items" });
  }
};
module.exports = { addToCart, removeAllFromCart, updateCart, allItems };
