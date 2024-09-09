const MeliModel 	=  require('../models/meliModel')
const axios = require('axios').default;

const getJwt = require('../middlewares/getDataJwt')

const getPartner = async (req,res) => {
	try{
		const partner =  await MeliModel.getPartner(req,res)
		
        res.status(200).send({
			status : 'success',
            data: partner.rows
		})

	}catch(e){
        console.log(e)
        res.status(500).send({
			code : 109,
	      	message : 'Aplication error'
	    })
    }
}

const getPickupByPartner = async (req,res) => {
	try{
		const pickup =  await MeliModel.getPickupByPartner(req.params,res)

        res.status(200).send({
			status : 'success',
            data: pickup.rows
		})

	}catch(e){
        console.log(e)
        res.status(500).send({
			code : 109,
	      	message : 'Aplication error'
	    })
    }
}

const getPickupByPartnerMeli = async (req,res) => {
	try{
		const pickup =  await MeliModel.getPickupByPartnerMeli(req.params,res)

        res.status(200).send({
			status : 'success',
            data: pickup.rows
		})

	}catch(e){
        console.log(e)
        res.status(500).send({
			code : 109,
	      	message : 'Aplication error'
	    })
    }
}

const registerToken = async (req,res) => {
	try{
		axios.post('https://api.mercadolibre.com/oauth/token', {
			grant_type : 'authorization_code',
			client_id : '4630343432469912',
			client_secret : 'TKzo62SLOpP2oAxk4MVdsOZtBsjgxCPH',
			redirect_uri : 'https://ware.lidiachile.cl',
			code : req.body.v_code_meli
		})
		.then(function (response) {
			const pickup = MeliModel.registerToken(req.body,res, response.data)
			
			res.status(200).send({
				status : 'success',
				data: {
					pickup : pickup.rows,
					meli : response.data
				}
			})
		})
		.catch(function (error) {
			res.status(500).send({
				status : 'error',
				statusCode : error.response.data.status,
				error : error.response.data.error,
				message : error.response.data.message
			})
		});

	}catch(e){
        console.log(e)
        res.status(500).send({
			code : 109,
	      	message : 'Aplication error'
	    })
    }
}

const getInformationMeli = async (req,res) => {
	try{
		
		const getCredentials = await MeliModel.getCredentials(req.body,res)
		// console.log(getCredentials.rows[0].v_token_meli)

		const result = await axios.get(`https://api.mercadolibre.com/shipments/${req.body.shipmentID}`, {
		headers: {
			'x-format-new' : 'True',
			Authorization: ` Bearer ${getCredentials.rows[0].v_token_meli}`
		}
		});

		

		
		if(result.status == '200'){
			const registerItem = await MeliModel.registerItem(req.body, res, JSON.stringify(result.data))
			
			res.status(200).send({
				status : 'success',
				data : registerItem.rows
			})
		}else{
			res.status(500).send({
				status : 'error'
			})
		}
		

	}catch(e){
        console.log(e)
        res.status(500).send({
			code : 109,
	      	message : 'Aplication error'
	    })
    }
}


module.exports = {
	getPartner,
    getPickupByPartner,
	getPickupByPartnerMeli,
	registerToken,
	getInformationMeli
}