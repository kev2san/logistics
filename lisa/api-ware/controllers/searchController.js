const SearchModel 	=  require('../models/searchModel')

const searchStatusDispatch = async (req,res) => {
	try{
		
		const status = await SearchModel.searchStatusDispatch(req.params, res)

		res.status(200).send({
			status : 'success',
            data : {
                dispatch : status.rows
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
	searchStatusDispatch
}