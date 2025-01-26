const mongoose=require('mongoose')

function isValidObjectId(id){
  // returns a boolean
  return mongoose.Types.ObjectId.isValid(id);
}

function checkId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    return res.status(500).json({ error: true, message: "Invalid Object Id" });
  }
  next();
}
module.exports = { checkId };
