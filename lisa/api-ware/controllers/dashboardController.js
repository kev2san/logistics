const DashboardModel =  require('../models/dashboardModel')
const getJwt = require('../middlewares/getDataJwt')


const getPartner = async (req,res) => {
	try{
		const partner =  await DashboardModel.getPartner(req,res)

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
		const pickup =  await DashboardModel.getPickupByPartner(req.params,res)

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

const getDashboardPartner = async (req,res) => {
	try{
		const indicator =  await DashboardModel.getDashboardPartnerIndicator(req.body,res)
		const graph =  await DashboardModel.getDashboardGraphMonth(req.body,res)
		const detail =  await DashboardModel.getDashboardGraphMonthDetail(req.body,res)

        res.status(200).send({
			status : 'success',
            data: {
                indicator : indicator.rows,
				graph : graph.rows,
				detail : detail.rows
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



const periodPartner = async (req,res) => {
	try{
		var jwt = await getJwt.getDataJwt(req, res)
		
		const period =  await DashboardModel.periodPartner(req.body,res,jwt)

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

const reportPartner = async (req,res) => {
	try{
		var jwt = await getJwt.getDataJwt(req, res)
		const report =  await DashboardModel.reportPartner(req.body,res,jwt)

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

const viewPhotosItem = async (req,res) => {
	try{

		const photos =  await DashboardModel.viewPhotosItem(req.params,res)
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


module.exports = {
    getPartner,
    getPickupByPartner,
    getDashboardPartner,
	periodPartner,
	reportPartner,
	viewPhotosItem
}