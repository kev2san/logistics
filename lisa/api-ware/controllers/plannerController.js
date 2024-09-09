const PlannerModel 	=  require('../models/plannerModel')

const getJwt = require('../middlewares/getDataJwt')

const getPartner = async (req,res) => {
	try{
		const partner =  await PlannerModel.getPartner(req,res)

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

const getPickup = async (req,res) => {
	try{
		const pickup =  await PlannerModel.getPickup(req.params,res)

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

const getPickupPartner = async (req,res) => {
	try{
		const pickup =  await PlannerModel.getPickupByPartner(req,res)

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

const getPendingItem = async (req,res) => {
	try{
		var jwt = await getJwt.getDataJwt(req, res)
		const pending = await PlannerModel.getPendingItem(req, res)
		const assigned = await PlannerModel.getAssinedDispatch(req, res)
		
		res.status(200).send({
			status : 'success',
            data : {
                pending : pending.rows,
				assigned : assigned.rows
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

const pxZone = async (req,res) => {
	try{

		var jwt = await getJwt.getDataJwt(req, res)
		
		if(req.body.type == 'ppu'){
			var pending = await PlannerModel.pxZonePpu(req.body, res)
		}else{
			var pending = await PlannerModel.pxZone(req.body, res)
		}
		
		const vehicle = await PlannerModel.getVehicleActive(req, res)
		const zone = await PlannerModel.viewZone(req ,res)

		res.status(200).send({
			status : 'success',
            data : {
                pending : pending.rows,
				vehicle : vehicle.rows,
				zone : zone
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

const pxZoneAssigned = async (req,res) => {
	try{
		
		var jwt = await getJwt.getDataJwt(req, res)
		const pending = await PlannerModel.pxZoneAssigned(req.body, res)
		const zone = await PlannerModel.viewZone(req ,res)

		res.status(200).send({
			status : 'success',
            data : {
                pending : pending.rows,
				// zone : zone.rows
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

const getVehicleActive = async (req,res) => {
	try{
		
		const vehicle = await PlannerModel.getVehicleActive(req, res)
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



const assign = async (req,res) => {
	try{
		
		var jwt = await getJwt.getDataJwt(req, res)
		const pending = await PlannerModel.pxZone(req.body, res)
		px_vehicle = parseInt(pending.rowCount / req.body.v_ppu.length) 
		ppus = req.body.v_ppu.length
		px = pending.rowCount
		total = 0
		const posts = await Promise.all(
			req.body.v_ppu.map(async (v_ppu,item) => {

				if(item+1 == ppus){
					pxs = px - total
				}else{
					pxs = px_vehicle
				}

				total += px_vehicle

				console.log(v_ppu, pxs)
				var assigned = await PlannerModel.assign(req.body,res,v_ppu, pxs)
			
			 	return assigned
			})
		)

		res.status(200).send({
			status : 'success',
            data : {
				total : px
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

const unassign = async(req,res) => {
	try{
		
		var jwt = await getJwt.getDataJwt(req, res)
		const unassign = await PlannerModel.unassign(req.body, res)

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

const filterZones = async(req,res) => {
	try{
		var qPickup = ''
		if (req.body.pickup != undefined){
			qPickup = ''
			req.body.pickup.forEach((pickup, index, arreglo) => {
				if (index == 0){
					qPickup += ` a.i_idpickup_partner = '${pickup}'`
				}else{
			    	qPickup += ` OR a.i_idpickup_partner = '${pickup}'`
				}
			});

			qPickup = `AND (${qPickup})`
		}

		var qDate = ''
		if (req.body.date != undefined){
			qDate = ''
			req.body.date.forEach((date, index, arreglo) => {
				if (index == 0){
					qDate += ` a.d_agreed_date::date = '${date}'`
				}else{
			    	qDate += ` OR a.d_agreed_date::date = '${date}'`
				}
			});

			qDate = `AND (${qDate})`
		}

		const result = await PlannerModel.getPendingItemFilter(qPickup, qDate, res)

		res.status(200).send({
			status : 'success',
			data : {
				pending : result.rows 
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


const getClusters = async (req,res) => {
	try{
		
    	
		const clusters = await PlannerModel.getClusters(req.body, res)
		const zone = await PlannerModel.viewZone(req ,res)
		const clusterGroup = await PlannerModel.getClustersGroup(req.body, res)
		const vehicle = await PlannerModel.getVehicleActive(req, res)

		res.status(200).send({
			status : 'success',
            data : {
                pending : clusters.rows,
                zone : zone.rows,
                clusters : clusterGroup.rows,
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


const assignClusterToTransport = async (req,res) => {
	try{

		console.log(req.body)
		const posts = await Promise.all(
			req.body.transport.map(async (transport,item) => {
				console.log(transport[0],transport[1],req.body.ppus[transport[1]])
				const assigned = await PlannerModel.assignTransport(transport[0],`transport-${transport[1]}`,req.body.ppus[transport[1]], res)
			 	return assigned
			})
		)

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
	getPendingItem,
    pxZone,
	getVehicleActive,
	assign,
	unassign,
	pxZoneAssigned,
	getPickup,
	filterZones,
	getClusters,
	assignClusterToTransport
}