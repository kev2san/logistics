const loadtruckModel 	=  require('../models/loadtruckModel')
const getJwt = require('../middlewares/getDataJwt')

const load = async (req,res) => {
	try{
		var jwt = await getJwt.getDataJwt(req, res)

		const updateLoad = await loadtruckModel.updateLoad(req.body,res,jwt)
		// Si es mayor a 0 es porque actualizo un registro
		if(updateLoad.rowCount == 0){
			const loadClientCode =  await loadtruckModel.load(req.body,res,jwt)
		}
		
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

const closeLoad = async (req,res) => {
	try{
		var jwt = await getJwt.getDataJwt(req, res)

		const posts = await Promise.all(
		  req.body.data.data.map(async (recall) => {
		  	req.body.v_partner_code = recall
		  	const updateLoad = await loadtruckModel.updateLoad(req.body,res,jwt)
				// Si es mayor a 0 es porque actualizo un registro
				
				if(updateLoad.rowCount == 0){
					await loadtruckModel.load(req.body,res,jwt)
					return await loadtruckModel.updateLoad(req.body,res,jwt)
				}
		    return updateLoad
		  })
		)

		
		const proveLoad = await loadtruckModel.provePickup(req.body,res)
		console.log(proveLoad.rows[0]['total'],proveLoad.rows[0]['loaded'])
		if(proveLoad.rows[0]['total'] == proveLoad.rows[0]['loaded']){
			const closePickup = await loadtruckModel.closePickup(req.body,res)
			res.status(200).send({
				status : 'success'
			})
		}else{
			res.status(200).send({
				status : 'warning'
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

const closeLoadForce = async (req,res) => {
	try{
		var jwt = await getJwt.getDataJwt(req, res)
		
		const closePickup = await loadtruckModel.closePickup(req.body,res)
		
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

const pendingload = async (req,res) => {
	try{
		var load = await loadtruckModel.getPendingLoad(req.body, res)

		res.status(200).send({
			status : 'success',
			data : load.rows
		})
	}catch(e){
        res.status(500).send({
			code : 109,
	      	message : 'Aplication error'
	    })
    }
}

const updateReceive = async (req,res) => {
	try{
		var jwt = await getJwt.getDataJwt(req, res)

		var update = await loadtruckModel.updateReceive(req.body, res, jwt)

		if(update.rowCount == 0){
			// req.body.i_idpartner = null
			req.body.i_idpartner_pickup = null

			await loadtruckModel.load(req.body,res,jwt)
			const loadClientCode = await loadtruckModel.updateReceive(req.body, res, jwt)
		}

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

const closeReceive = async (req,res) => {
	try{
		var jwt = await getJwt.getDataJwt(req, res)
		
		const posts = await Promise.all(
			Object.keys(req.body.data).map(async (recall) => {
		  	if (req.body.data[recall] == 1){
		  		req.body.v_partner_code = recall
		    	const update = await loadtruckModel.updateReceiveOffline(req.body,res,jwt)

		    	if(update.rowCount == 0){
						req.body.i_idpartner_pickup = null
						
						await loadtruckModel.load(req.body,res,jwt)
						return await loadtruckModel.updateReceiveOffline(req.body,res,jwt)
					}

					return update
		  	}
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

const getVehicleActive = async (req,res) => {
	try{
		const vehicle = await loadtruckModel.getDriver(req,res)
		
		res.status(200).send({
			status : 'success',
			data : {
				vehicle : vehicle
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

const getDataAssignPickup = async (req,res) => {
	try{
		const vehicle = await loadtruckModel.getVehicleActive(req,res)	
		const partner = await loadtruckModel.getPartnerActive(req,res)
		
		res.status(200).send({
			status : 'success',
			data : {
				vehicle : vehicle.rows,
				partner : partner.rows
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

const getPickupByPartner = async (req,res) => {
	try{
		const pickup = await loadtruckModel.getPartnerPickupActive(req.params,res)
		
		res.status(200).send({
			status : 'success',
			data : {
				pickup : pickup.rows,
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

const createAssignPickup = async (req,res) => {
	try{
		var jwt = await getJwt.getDataJwt(req, res)

		const exist = await loadtruckModel.validateVehiclePickup(req.body,res)
		
		
		if (exist.rowCount == 0){
			const pickup = await loadtruckModel.createAssignPickup(req.body,res,jwt)
			if (pickup.rowCount > 0){
				const pickups = await loadtruckModel.getOpenPickup(req,res)
				res.status(200).send({
					status : 'success',
					data : {
						pickup : pickups.rows
					}
				})
			}else{
				res.status(200).send({
					status : 'danger'
				})
			}
		}else{
			res.status(200).send({
				status : 'warning'
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

const getPickupByVehicle = async (req,res) => {
	try{
		const pickup = await loadtruckModel.getPickupByVehicle(req.params,res)
		
		res.status(200).send({
			status : 'success',
			data : {
				pickup : pickup.rows,
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

const getOpenPickup = async (req,res) => {
	try{
		const pickups = await loadtruckModel.getOpenPickup(req,res)
		
		res.status(200).send({
			status : 'success',
			data : {
				pickup : pickups.rows,
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

const viewZone = async (req,res) => {
	try{
		const zone = await loadtruckModel.viewZone(req.params,res)
		const pickup = await loadtruckModel.getListPickup(req,res)
		const driver = await loadtruckModel.getDriver(req,res)

		res.status(200).send({
			status : 'success',
			data : {
				zone : zone,
				pickup : pickup,
				driver : driver
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

const viewPickup = async (req,res) => {
	try{
		const zone = await loadtruckModel.viewZone(req.params,res)
		const pickup = await loadtruckModel.getListAddressPickup(req,res)
		const driver = await loadtruckModel.getDriver(req,res)

		res.status(200).send({
			status : 'success',
			data : {
				zone : zone,
				pickup : pickup,
				driver : driver
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

const viewNearbyDrivers = async (req,res) => {
	try{
		const pickup = await loadtruckModel.getPartnerPickupById(req.params,res)
		const drivers = await loadtruckModel.getDriver(req,res)

		res.status(200).send({
			status : 'success',
			data : {
				pickup : pickup,
				drivers : drivers
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

const getListPickup = async (req,res) => {
	try{
		const pickup = await loadtruckModel.getListPickup(req,res)

		res.status(200).send({
			status : 'success',
			data : {
				pickup : pickup
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

const assigned = async (req,res) => {
	try{
		const assing = await loadtruckModel.assigned(req.body,res)
		req.body.idvehicle_pickup = assing[0].i_idvehicle_pickup

		const assingPickupItems = await loadtruckModel.assingPickupItems(req.body,res)
		if(assingPickupItems.rowCount > 0){
			const update = await loadtruckModel.updateTotalItems(assingPickupItems.rowCount,req.body.idvehicle_pickup)
		}
		
		res.status(200).send({
			type : 'success',
			data : {
				items : assingPickupItems.rowCount
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


const chargeInLoad = async (req,res) => {
	try{
		
		const load = await loadtruckModel.chargeInLoad(req.body,res)
		
		res.status(200).send({
			type : 'success',
			data : load.rows
		})

	}catch(e){
		console.log(e)
      res.status(500).send({
			code : 109,
	    message : 'Aplication error'
	  })
  }
}

const assignQr = async (req,res) => {
	try{
		var jwt = await getJwt.getDataJwt(req, res)

		var available = await loadtruckModel.availableLabel(req.body,res)
		var iditem    = await loadtruckModel.getIdItem(req.body,res) 

		if(available.rowCount > 0){
			
			if(available.rows[0]['i_iditem'] == '' || available.rows[0]['i_iditem'] == null){
				// se asigno 
				var update = await loadtruckModel.updateLabel(req.body, res)
				var update = await loadtruckModel.updateLabelGenerated(req.body, iditem.rows[0]['i_iditem'], res, jwt)
				
				res.status(200).send({
					status : 'success',
					message : 'label assigned'
				})
			}else{
				// ya tiene un item asingado
				res.status(200).send({
					status : 'warning',
					message : 'label already assigned'
				})
			}
		}else{
			// No existe la etiqueta
			res.status(200).send({
				status : 'error',
				message : 'Label doesnt exists'
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

const generateLabel = async (req,res) => {
	try{
		var jwt = await getJwt.getDataJwt(req, res)
		const labels = await loadtruckModel.generateLabel(req.body,res,jwt)
		
		res.status(200).send({
			type : 'success',
			data : labels.rows
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
	load,
	closeLoad,
	pendingload,
	updateReceive,
	closeReceive,
	getVehicleActive,
	getDataAssignPickup,
	getPickupByPartner,
	createAssignPickup,
	getPickupByVehicle,
	getOpenPickup,
	viewZone,
	viewNearbyDrivers,
	getListPickup,
	assigned,
	chargeInLoad,
	closeLoadForce,
	viewPickup,
	assignQr,
	viewPickup,
	assignQr,
	generateLabel
}