const express = require("express")

const {placeOrder, placeOrderKhalti, allOrders,userOrders,updateStatus,khaltiOrders,productReview,khaltiOrder} = require('../Controllers/orderControllers.js')

const { authorizeAdmin, validateUser } = require('../middlewares/auth.js');

const orderRouter = express.Router()

//admin
orderRouter.get('/list',validateUser,authorizeAdmin,allOrders)
orderRouter.post('/status',validateUser,authorizeAdmin,updateStatus)

// payment
orderRouter.post('/place',validateUser,placeOrder)
orderRouter.post('/khalti',validateUser,placeOrderKhalti)

// user feature
orderRouter.post('/userorders',validateUser,userOrders)

orderRouter.get('/khaltiorders',validateUser,khaltiOrders)
orderRouter.get('/khaltiorders/admin',validateUser,authorizeAdmin,khaltiOrder)

orderRouter.post('/review',validateUser,productReview)


module.exports=orderRouter;


