const getJwt = require('./getDataJwt')
const errorModel = require('../models/errorManagement')

const sendError = async(req, res, filename, funct, e) => {
    var jwt = await getJwt.getDataJwt(req,res)
    const err = await errorModel.insert(res,filename,funct,jwt.username,jwt.ip,e)
    return err
}

module.exports = {
    sendError
}
