const express=require('express')
const payRouter=express.Router()

const {initializeKhaltiPayment,completeKhaltiPayment}=require('../Controllers/PaymentController')

payRouter.post('/khalti',initializeKhaltiPayment)
payRouter.get('/khalti',completeKhaltiPayment)

module.exports=payRouter;