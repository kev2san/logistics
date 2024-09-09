const jwt = require('jsonwebtoken')

const getDataJwt = async (req,res) => {
  if (req.headers.lidiatoken){
    var decoded = jwt.verify(req.headers.lidiatoken, 'l1d14w4r3');

    return decoded
  }else{
    res.status(401).json({type : 'error', message : 'Unauthorized'})
    return
  }
}

module.exports = {
  getDataJwt
}
