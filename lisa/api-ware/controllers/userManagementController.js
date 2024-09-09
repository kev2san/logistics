const UserModel =  require('../models/userManagementModel')
const getJwt = require('../middlewares/getDataJwt')
const error = require('../middlewares/errorManagement')


const getRegion = async(req, res) => {
	try {		
		
		const region = await UserModel.getRegion(req, res)

		res.status(200).json({
			type : 'success',
			message : 'Region list',
			data : region.rows
		})
		
	}catch(e){
		await error.sendError(req,res,'getRegion',__filename,e)

		res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }

}

const getDistrict = async(req, res) => {

	try {
		const district = await UserModel.getDistrict(req.params, res)

	    res.status(200).json({
	        type : 'success',
	      	message : 'District list by idregion',
	      	data : district.rows
	    })
		
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }

}

const createUser = async(req,res) => {
	try {
		var jwt = await getJwt.getDataJwt(req, res)
		
		const create = await UserModel.createUser(req.body, res, jwt)

		if(create == '23505'){
			res.status(200).json({
				type : 'warning',
				message : 'Users already exists',
			})
		}else{
			res.status(200).json({
				type : 'success',
				message : 'Users register'
			})
		}
			
		
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }
}

module.exports = {
	getRegion,
	getDistrict,
	createUser
}