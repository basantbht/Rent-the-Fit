const express = require("express")

const {placeOrder, placeOrderKhalti, allOrders,userOrders,updateStatus} = require('../Controllers/orderControllers.js')

const { authorizeAdmin, validateUser } = require('../middlewares/auth.js');

const orderRouter = express.Router()

//admin
orderRouter.post('/list',authorizeAdmin,allOrders)
orderRouter.post('/status',authorizeAdmin,updateStatus)

// payment
orderRouter.post('/place',validateUser,placeOrder)
orderRouter.post('/khalti',validateUser,placeOrderKhalti)

// user feature
orderRouter.post('/userorders',validateUser,userOrders)

module.exports = orderRouter;