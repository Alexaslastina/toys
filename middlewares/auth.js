const jwt = require("jsonwebtoken");


exports.authToken = (req,res,next) => {
  let token = req.header("auth-token");
  if(!token){
    return res.status(400).json({msg:"you must send token in this url to get data"});
  }
  try{

    let decodeToken = jwt.verify(token,"alexasSecret");
   
    req.userData = decodeToken;
   
    next();
  }
  catch (err) {
    console.log(err);
    res.status(400).json({msg:"token invalid or expired"});
  }
}