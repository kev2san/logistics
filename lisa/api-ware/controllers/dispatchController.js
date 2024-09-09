const dispatchModel 	=  require('../models/dispatchModel')

const getJwt = require('../middlewares/getDataJwt')

const getDispatchToDelivery = async (req,res) => {
	try{
		var jwt = await getJwt.getDataJwt(req, res)
		const dispatch =  await dispatchModel.dispatchToDelivery(req.body,res,jwt)
		res.status(200).send({
			status : 'success',
            data: dispatch.rows
		})
	}catch(e){
  console.log(e)
        res.status(500).send({
			code : 109,
	      	message : 'Aplication error'
	    })
    }
}

const getDispatchItem = async (req,res) => {
	try{
		var jwt = await getJwt.getDataJwt(req, res)
		const dispatch =  await dispatchModel.dispatchItem(req.body,res,jwt)
		const delivery_types =  await dispatchModel.getDeliveryTypes(req.body,res,jwt)

		res.status(200).send({
			status : 'success',
            data: dispatch.rows,
			delivery_types: delivery_types.rows
		})
	}catch(e){
  console.log(e)
        res.status(500).send({
			code : 109,
	      	message : 'Aplication error'
	    })
    }
}


const updateDispatchItemsPhotos = async (req,res) => {
	try{	
		var jwt = await getJwt.getDataJwt(req, res)
		let updateDispatch = await dispatchModel.updatePhotosDispatch(req.body.dispatch[0],res,jwt) 	  	

    const post = await Promise.all(req.body.items.map(async (elem) => {
			  let updateItems = await dispatchModel.updatePhotosItems(elem,res,jwt) 
			  return updateItems
		}))
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


const reportDispatch = async (req,res) => {
	try{
		var jwt = await getJwt.getDataJwt(req, res)

		const report =  await dispatchModel.reportDispatch(req.body,res,jwt)
		res.status(200).send({
			status : 'success',
            data: report.rows
		})
	}catch(e){
  console.log(e)
        res.status(500).send({
			code : 109,
	      	message : 'Aplication error'
	    })
    }
}


const viewPhotos = async (req,res) => {
	try{

		const photos =  await dispatchModel.viewPhotos(req.params,res)
		res.status(200).send({
			status : 'success',
            data: photos.rows
		})
	}catch(e){
  console.log(e)
        res.status(500).send({
			code : 109,
	      	message : 'Aplication error'
	    })
    }
}

const reportPending = async (req,res) => {
	try{

		const report =  await dispatchModel.reportPending(req.body,res)
		res.status(200).send({
			status : 'success',
            data: report.rows
		})
	}catch(e){
  console.log(e)
        res.status(500).send({
			code : 109,
	      	message : 'Aplication error'
	    })
    }
}

const viewItems = async (req,res) => {
	try{
		console.log('test')

		const items =  await dispatchModel.viewItems(req.params,res)
		res.status(200).send({
			status : 'success',
            data: items.rows
		})
	}catch(e){
  console.log(e)
        res.status(500).send({
			code : 109,
	      	message : 'Aplication error'
	    })
    }
}

const changeStatus = async (req,res) => {
    try {
		var jwt = await getJwt.getDataJwt(req, res)
        let change =  await dispatchModel.changeStatus(req.body,res,jwt)
        if (change.rowCount > 0) {
           res.status(200).json({
                status : 'success'

            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            code: 163,
            message: 'Aplication error'
        })
    }	
}

module.exports = {
	getDispatchToDelivery,
	getDispatchItem,
	updateDispatchItemsPhotos,
	reportDispatch,
	viewPhotos,
	reportPending,
	viewItems,
	changeStatus
}