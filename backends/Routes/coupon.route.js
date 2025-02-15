const express=require('express');

const couponRouter=express.Router();


const { validateUser, authorizeAdmin }=require('../middlewares/auth');

const {createCoupon,validateCoupon}=require('../Controllers/coupon.controller')


couponRouter.post('/',validateUser,authorizeAdmin,createCoupon);
couponRouter.post('/validate',validateUser,validateCoupon);

module.exports=couponRouter;