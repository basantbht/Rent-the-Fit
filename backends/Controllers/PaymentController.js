import {EsewaPaymentGateway,EsewaCheckStatus} from "esewajs";
import { Transaction } from "../Models/TransationModel";
const EsewaInitiatePayment = async(req, res)=>{
    const{amount,productId} = req.body;

    try{
        const reqPayment = await EsewaPaymentGateway(
            amount,0,0,0,productId,process.env.MERCHANT_ID,
            process.env.SECRET,process.env.SUCCESS_URL,
            process.env.FAILURE_URL,
            process.env.ESEWAPAYMENT_URL,undefined,undefined
        )

        if(!reqPayment){
            return res.status(400).json("error sending data")

        }
             if(reqPayment.status === 200){
                const transaction = new Transation({
                    product_id: productId,
                    amount:amount,
                });
                await transaction.save();
                console.log("transaction passed")
                return res.send({
                    url:reqPayment.request.res.responseUrl,
                });
             }
    }catch(error){
        return res.status(400).json("error sending data")
    }
}
   const paymentStatus = async(req,res)=>{
    const {product_id}= req.body;

    try{

        const transaction = await Transation.findOne({product_id});
        if(!transaction){
            return res.status(400).json({message:"Transation not found"})
        }

        const paymentStatusCheck = await EsewaCheckStatus(transaction.amount,transaction.product_id,
            process.env.MERCHANT_ID,process.env.ESEWAPAYMENT_STATUS_CHECK_URL)

            if(paymentStatusCheck.status===200){
                transaction.status = paymentStatusCheck.data.status;
                await Transation.save();
                res
                  .status(200)
                  .json({message:"Transtion status updated successful"})
            }

    }catch(error){
        console.error("Error updating transtion status",error)
        res.status(500).json({message:"Server error",error:error})

    }
};
export{EsewaInitiatePayment,paymentStatus}
