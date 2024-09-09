const ReturnsModel 	=  require('../models/returnsModel')

const getVehicleActive = async (req,res) => {
	try{
		
		const vehicle = await ReturnsModel.getVehicleActive(req, res)

		res.status(200).send({
			status : 'success',
            data : {
                vehicle : vehicle.rows
            }
		})
	}catch(e){
		console.log(e)
        res.status(500).send({
			code : 109,
	      	message : 'Aplication error'
	    })
    }
}

const loadReturns = async (req,res) => {
	try{
		
		const vehicle = await ReturnsModel.loadReturns(req.body, res)

		res.status(200).send({
			status : 'success',
            data : {
                vehicle : vehicle.rows
            }
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
	getVehicleActive,
	loadReturns
}