const userModel=require('../Models/User.model')

const addToCart = async (req, res) => {
  try {
    const { size, productId } = req.body;
    const userId = req.user._id; 

    // Find user
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    // Ensure cartData exists
    let cartData = userData.cartData || {};

    // Check if the product exists in cartData
    if (!cartData[productId]) {
      cartData[productId] = {};
    }

    // Update size quantity
    if (cartData[productId][size]) {
      cartData[productId][size] += 1;
    } else {
      cartData[productId][size] = 1;
    }

    // Save updated cart
    await userModel.findByIdAndUpdate(userId, { cartData });

    return res.status(200).json({ error: false, message: 'Added to cart' });

  } catch (error) {
    console.error("Error in addToCart:", error);
    return res.status(500).json({ error: true, message: "Could not add to cart" });
  }
};


const updateCart = async (req, res) => {
try{
  const {productId,size,quantity}=req.body
  const userId = req.user._id; 

  const userData = await userModel.findById(userId);

  if (!userData) {
    return res.status(404).json({ error: true, message: "User not found" });
  }
  let cartData = await userData.cartData;

  cartData[productId][size]=quantity;
  await userModel.findByIdAndUpdate(userId,{cartData})
  return res.status(200).json({error:false,message:'cart updated'})
}
  catch (error) {
    console.log("Error in updatecart", error);
    return res
      .status(500)
      .json({ error: true, message: "coudlnot update item" });
  }
};
const allItems = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ error: false, items: user.cartItems });
  } catch (error) {
    console.log("Error in allCart", error);
    return res.status(500).json({ error: true, message: "couldnot get items" });
  }
};

module.exports = { addToCart, updateCart, allItems };

