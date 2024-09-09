const jwt = require('jsonwebtoken')

const getDataJwt = async (req,res) => {
  
  if (req.headers.jarvistoken){
    var decoded = jwt.verify(req.headers.jarvistoken, 'j4rv1s 4pp');

    return decoded
  }else{
    res.status(401).json({type : 'error', message : 'Unauthorized'})
    return
  }
}

module.exports = {
  getDataJwt
}
