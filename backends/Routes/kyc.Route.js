const express=require('express')

const kycRouter=express.Router();
const createkyc=require('../Controllers/kyc.controller')

kycRouter.route('/',createKyc);

module.exports=kycRouter;