
const joi=require("joi")

const kycSchema=joi.object({
  dob:joi.string().required(),
  Adress:joi.string().required()

})

const createKyc = async (req, res) => {
  const {error}=kycSchema.validate(req.body);
  if(error){
    return res.status(400).json({error:true,message:'Invalid data filled'});
  }
   try {
    
   } catch (error) {
    console.log('Error in createkyc');
    
   }

}

