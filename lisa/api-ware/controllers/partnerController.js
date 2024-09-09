const partnerModel 	=  require('../models/partnerModel')

const getJwt = require('../middlewares/getDataJwt')

const getPartners = async (req,res) => {
    try {
		var jwt = await getJwt.getDataJwt(req, res)
        let partners =  await partnerModel.partnerList(req.body,res,jwt)
        if (partners.rowCount > 0) {

            res.status(200).json({
                message: 'List Partners',
                type: 'exists',
                data:  partners.rows
            })
        }else{
            res.status(200).json({
                message: 'No Partners',
                type: 'noexists'
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

const getPartnersActive = async(req, res) => {
	try {
        const partners =  await partnerModel.partnerActiveList(req,res)

		    res.status(200).json({
		        type : 'success',
		      	message : 'Partners list',
                  data:  partners.rows
            })
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }
}

const createPartner  = async (req, res) => {
    try {
		var jwt = await getJwt.getDataJwt(req, res)
        let addPartner = await partnerModel.partnerAdd(req.body,res,jwt)
 
        if (addPartner.rowCount > 0) {

            res.status(200).json({
                code: 164,
                message: 'Add Partner',
                type: 'success',
                data:  addPartner.rows
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

const inactivePartner = async (req,res) => {
    try {
		var jwt = await getJwt.getDataJwt(req, res)
        let partner =  await partnerModel.partnerInactive(req.body,res,jwt)
        if (partner.rowCount > 0) {
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

const createPartnerPickup  = async (req, res) => {
    try {
		var jwt = await getJwt.getDataJwt(req, res)
        let addPartnerPickup = await partnerModel.partnerPickupAdd(req.body,res,jwt)
 
        if (addPartnerPickup.rowCount > 0) {

            res.status(200).json({
                code: 164,
                message: 'Add Partner Pickup',
                type: 'success',
                data:  addPartnerPickup.rows
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

const getPartnersPickup = async(req, res) => {
	try {
        const partners =  await partnerModel.partnerPickupList(req,res)

		    res.status(200).json({
		        type : 'success',
		      	message : 'Region list',
                  data:  partners.rows
            })
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }
}

const inactivePickup = async (req,res) => {
    try {
		var jwt = await getJwt.getDataJwt(req, res)
        let pickup =  await partnerModel.pickupInactive(req.body,res,jwt)
        if (pickup.rowCount > 0) {
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

const getPickupDetail = async(req, res) => {
	try {
		const pickup = await partnerModel.pickupById(req.params, res)
	    res.status(200).json({
	        type : 'success',
	      	message : 'Get Pickup',
			data : pickup.rows
	    })
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }
}

const editPartnerPickup  = async (req, res) => {
    try {
		var jwt = await getJwt.getDataJwt(req, res)
        let updatePartnerPickup = await partnerModel.pickupEdit(req.body,res,jwt)
 
        if (updatePartnerPickup.rowCount > 0) {

            res.status(200).json({
                code: 164,
                message: 'Edit Partner Pickup',
                type: 'success'
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

const getSizesActive = async(req, res) => {
	try {
		const sizes = await partnerModel.sizesActive(req.params, res)
	    res.status(200).json({
	        type : 'success',
	      	message : 'Get sizes',
			data : sizes.rows
	    })
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }
}

const createPartnerPrice  = async (req, res) => {
    try {
		var jwt = await getJwt.getDataJwt(req, res)
        const addPartnerPrice = await partnerModel.partnerPriceAdd(req.body,res,jwt)
        if (addPartnerPrice.rowCount > 0) {
            var status = addPartnerPrice.rows[0].fn_create_partner_price == 'conflict' ? addPartnerPrice.rows[0].fn_create_partner_price : 'success'
            res.status(200).send({
                status : status,
                data: addPartnerPrice.rows
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

const getPartnersPrice = async(req, res) => {
	try {
        const partnersPrice =  await partnerModel.partnerPriceList(req,res)

		    res.status(200).json({
		        type : 'success',
		      	message : 'Partners price list',
                  data:  partnersPrice.rows
            })
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }
}

const inactivePartnerPrice = async (req,res) => {
    try {
		var jwt = await getJwt.getDataJwt(req, res)
        let partner =  await partnerModel.partnerPriceInactive(req.body,res,jwt)
        if (partner.rowCount > 0) {
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

const getPickupByPartner = async (req,res) => {
	try{
		const pickup =  await partnerModel.getPickupByPartner(req.params,res)

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

const periodPartnerPay = async (req,res) => {
	try{
		const period =  await partnerModel.periodPartnerPay(req.body,res)

        res.status(200).send({
			status : 'success',
            data: period.rows
		})

	}catch(e){
        console.log(e)
        res.status(500).send({
			code : 109,
	      	message : 'Aplication error'
	    })
    }
}

const reportPartnerPay = async (req,res) => {
	try{
		const report =  await partnerModel.reportPartnerPay(req.body,res)

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

module.exports = {
	getPartners,
    getPartnersActive, 
    createPartner,
    inactivePartner,
    createPartnerPickup,
    getPartnersPickup,
    inactivePickup,
    getPickupDetail,
    editPartnerPickup,
    getSizesActive,
    createPartnerPrice,
    getPartnersPrice,
    inactivePartnerPrice,
    getPickupByPartner,
    periodPartnerPay,
    reportPartnerPay
}