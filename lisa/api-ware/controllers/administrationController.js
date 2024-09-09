const AdministrationModel =  require('../models/administrationModel')
const getJwt = require('../middlewares/getDataJwt')


const createVehicle = async(req, res) => {
	var jwt = await getJwt.getDataJwt(req, res)

	try {
		const create = await AdministrationModel.createVehicle(req.body, res, jwt)

		if (create == '23505'){
		    res.status(200).json({
		        type : 'warning',
		      	message : 'PPU already exists'
		    })
		}else{
			res.status(200).json({
		        type : 'success',
		      	message : 'PPU created'
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

const createUserCrews = async(req, res) => {
	var jwt = await getJwt.getDataJwt(req, res)

	try {
		const create = await AdministrationModel.createUser(req.body, res, jwt)

		if (create == '23505'){
		    res.status(200).json({
		        type : 'warning',
		      	message : 'User already exists'
		    })
		}else{
			res.status(200).json({
		        type : 'success',
		      	message : 'User created'
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

const getRegion = async(req, res) => {
	try {
		const region = await AdministrationModel.getRegion(req, res)

		    res.status(200).json({
		        type : 'success',
		      	message : 'Region list',
		      	data : region.rows
		    })
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }

}

const getDistrict = async(req, res) => {

	try {
		const district = await AdministrationModel.getDistrict(req.params, res)

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

const showUsersCrews = async(req, res) => {

	try {
		const user = await AdministrationModel.showUsersCrews(req, res)

	    res.status(200).json({
	        type : 'success',
	      	message : 'Users list',
	      	data : user.rows
	    })
		
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }

}

const changeStatusUser = async(req, res) => {

	try {
		const user = await AdministrationModel.changeStatusUser(req.params, res)

	    res.status(200).json({
	        type : 'success',
	      	message : 'User updated'
	    })
		
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }

}

const changeStatusVehicle = async(req, res) => {

	try {
		const user = await AdministrationModel.changeStatusVehicle(req.params, res)

	    res.status(200).json({
	        type : 'success',
	      	message : 'User updated'
	    })
		
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }

}

const getUserDetail = async(req, res) => {

	try {
		const user = await AdministrationModel.getUserDetail(req.params, res)

	    res.status(200).json({
	        type : 'success',
	      	message : 'User updated',
			data : user.rows
	    })
		
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }

}

const editUserCrews = async(req, res) => {
	// validar que cuando edite el tipo de conductor a peoneta se desasocie de todo
	try {
		const user = await AdministrationModel.editUserCrews(req.body, res)

	    res.status(200).json({
	        type : 'success',
	      	message : 'User updated'
	    })
		
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }

}

const getVehiclesWithCrew = async(req, res) => {
	
	try {
		const vehicles = await AdministrationModel.getVehiclesWithCrew(req, res)

	    res.status(200).json({
	        type : 'success',
	      	message : 'User list with drivers',
			data : vehicles.rows
	    })
		
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }

}

const getVehicleType = async(req, res) => {
	
	try {
		const vehicles = await AdministrationModel.getVehicleType(req, res)
	
	    res.status(200).json({
	        type : 'success',
	      	message : 'Vehicle type list',
			vehicles : vehicles.rows
	    })
		
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }

}

const getDrivers = async(req, res) => {
	
	try {
		const driver = await AdministrationModel.getDrivers(req.params, res)
	
	    res.status(200).json({
	        type : 'success',
	      	message : 'Driver list',
			data : driver.rows
	    })
		
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }

}

const assignDriver = async(req, res) => {
	
	try {
		// validar que no este asignado en otra patente
		if(req.body.iduser_level == 1){
			var driver = await AdministrationModel.assignDriver(req.body, res)
		}else{
			var driver = await AdministrationModel.assignCodriver(req.body, res)
		}
		
	
	    res.status(200).json({
	        type : 'success',
	      	message : 'Driver updated'
	    })
		
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }

}

const getVehicleDetail = async(req, res) => {
	
	try {
		var vehicle = await AdministrationModel.getVehicleDetail(req.params, res)
		
	
	    res.status(200).json({
	        type : 'success',
	      	message : 'vehicle detail',
			data : vehicle.rows
	    })
		
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }

}

const editVehicle = async(req, res) => {
	
	try {
		console.log(req.body)
		var vehicle = await AdministrationModel.editVehicle(req.body, res)
		
	
	    res.status(200).json({
	        type : 'success',
	      	message : 'Vehicle updated'
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
	createVehicle,
	createUserCrews,
	getRegion,
	getDistrict,
	showUsersCrews,
	changeStatusUser,
	getUserDetail,
	editUserCrews,
	getVehiclesWithCrew,
	getVehicleType,
	changeStatusVehicle,
	getDrivers,
	assignDriver,
	getVehicleDetail,
	editVehicle
}