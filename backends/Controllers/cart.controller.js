
const userModel=require('../Models/User.model')
const addToCart = async (req, res) => {
  try {
    const { userId, size,productId } = req.body;

    const userData = await userModel.findById(userId) ;
    let cartData = await userData.cartData;
    // console.log(cartData);
    if (cartData[productId]) {
      if (cartData[productId][size]) {
        cartData[productId][size] += 1;
      } else {
        cartData[productId][size] = 1;
      }
      cartData[productId]={}
      cartData[productId][size]=1
    }
    await userModel.findByIdAndUpdate(userId,{cartData})
    return res.status(200).json({error:false,message:'Added to cart'})
  } catch (error) {
    console.log("Error in add to cart", error);
    return res
      .status(404)
      .json({ error: true, message: "couldnot add to cart" });
  }
};


const updateCart = async (req, res) => {
try{
  const {userId,itemId,size,quantity}=req.body
  const userData = await userModel.findById(userId) ;
  let cartData = await userData.cartData;

  cartData[itemId][size]=quantity;
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

