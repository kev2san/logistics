const DashboardModel =  require('../models/dashboardModel')
const getJwt = require('../middlewares/getDataJwt')



const getDashOne = async (req,res) => {
	try{
		const type =  await DashboardModel.getDashOne(req.body,res)
		const user =  await DashboardModel.getDashTwo(req.body,res)
		const total = await DashboardModel.getDashThree(req.body,res)
        const detail = await DashboardModel.getDashFour(req.body,res)

		res.status(200).send({
			status : 'success',
            data: {
                type : type.rows,
				users : user.rows,
				totals : total.rows,
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

module.exports = {
    getDashOne
}