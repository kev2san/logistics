const integrationsModel 	=  require('../models/integrationsModel')

const getJwt = require('../middlewares/getDataJwt')

const weebhook_kleemarket = async (req,res) => {
	try{
		const webhook =  await integrationsModel.weebhook_kleemarket(req.body,res)

		res.status(200).send({
			status : 'success'
		})

	}catch(e){
  	console.log(e)
    res.status(500).send({
			code : 109,
	    message : 'Aplication error'
	  })
  }
}


module.exports = {
	weebhook_kleemarket
}