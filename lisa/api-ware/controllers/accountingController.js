const AccountingModel =  require('../models/accountingModel')
const getJwt = require('../middlewares/getDataJwt')


const getBillingPeriod = async(req, res) => {
    try {
		const billing = await AccountingModel.getBillingPeriod(req, res)
		    res.status(200).json({
		        type : 'success',
		      	message : 'Billing Period',
		      	data : billing.rows
		    })
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }

}


const getBillingByPeriod = async(req, res) => {
    try {
		const billing = await AccountingModel.getBillingByPeriod(req.body, res)
		    res.status(200).json({
		        type : 'success',
		      	message : 'Billing  By Period',
		      	data : billing.rows
		    })
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }

}

const getUserPPUData = async(req, res) => {
    try {
		var jwt = await getJwt.getDataJwt(req, res)
		const userdata = await AccountingModel.getUserPPUData(req.body, res, jwt)
		    res.status(200).json({
		        type : 'success',
		      	message : 'User PPU data',
		      	data : userdata.rows
		    })
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }

}




module.exports = {
	getBillingPeriod,
    getBillingByPeriod,
	getUserPPUData
}