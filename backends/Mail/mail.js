const nodemailer=require('nodemailer');

nodemailer.createTransport({
  host:'',
  port:'',
  secure:'',
  auth:{
    user:'',
    pass:'',
  }
});
module.exports=nodemailer;