const transportModel 	=  require('../models/transportModel')

const getJwt = require('../middlewares/getDataJwt')

const checkDisponibility = async (req,res) => {

    try {
		var jwt = await getJwt.getDataJwt(req, res)

        let check =  await transportModel.disponibilityCheck(req.body,res,jwt)
        if (check.rowCount > 0) {

            res.status(200).json({
                message: 'Check disponibility',
                type: 'exists',
                data:  check.rows
            })
        }else{
            res.status(200).json({
                message: 'Check disponibility',
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

const addDisponibility  = async (req, res) => {
    var jwt = await getJwt.getDataJwt(req, res)
    try {
		var jwt = await getJwt.getDataJwt(req, res)
        let addDisponibility = await transportModel.disponibilityAdd(req.body,res,jwt)
 
        if (addDisponibility.rowCount > 0) {

            res.status(200).json({
                code: 164,
                message: 'Add Disponibility',
                type: 'success',
                data:  addDisponibility.rows
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

const getDisponibility = async (req,res) => {

    try {
		var jwt = await getJwt.getDataJwt(req, res)

        let disponibility =  await transportModel.disponibilityGet(req.body,res,jwt)
        if (disponibility.rowCount > 0) {

            res.status(200).json({
                message: 'disponibility',
                type: 'exists',
                data:  disponibility.rows
            })
        }else{
            res.status(200).json({
                message: 'disponibility',
                type: 'noexists',
                data:  disponibility.rows

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

const inactiveDisponibility = async (req,res) => {

    try {
		var jwt = await getJwt.getDataJwt(req, res)

        let disponibility =  await transportModel.disponibilityInactive(req.body,res,jwt)
        if (disponibility.rowCount > 0) {
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

const getIncomeData = async (req,res) => {

    try {
		var jwt = await getJwt.getDataJwt(req, res)

        let income =  await transportModel.incomeData(req.body,res,jwt)
        if (income.rowCount > 0) {

            res.status(200).json({
                message: 'income',
                type: 'exists',
                data:  income.rows
            })
        }else{
            res.status(200).json({
                message: 'income',
                type: 'noexists',
                data:  income.rows
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

const getIncomePeriod = async (req,res) => {

    try {
		var jwt = await getJwt.getDataJwt(req, res)

        let period =  await transportModel.incomePeriod(req.body,res,jwt)
        if (period.rowCount > 0) {

            res.status(200).json({
                message: 'period',
                type: 'exists',
                data:  period.rows
            })
        }else{
            res.status(200).json({
                message: 'period',
                type: 'noexists',
                data:  period.rows
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
	checkDisponibility,
    addDisponibility,
    getDisponibility,
    inactiveDisponibility,
    getIncomeData,
    getIncomePeriod
}