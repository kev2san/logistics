const manifestModel 	=  require('../models/manifestModel')

const getJwt = require('../middlewares/getDataJwt')

const getManifestPartner = async (req,res) => {
	try{
		var jwt = await getJwt.getDataJwt(req, res)
		const manifest =  await manifestModel.manifestPartner(jwt.idpartner,res,jwt)
		const pickups =  await manifestModel.pickupsPartner(jwt.idpartner,res,jwt)
		res.status(200).send({
			status : 'success',
            data: JSON.stringify(manifest.rows[0].j_manifest_columns),
			partner : manifest.rows[0].v_name,
			pickups : pickups.rows
		})
	}catch(e){
  console.log(e)
        res.status(500).send({
			code : 109,
	      	message : 'Aplication error'
	    })
    }
}

const uploadtManifestPartner = async (req,res) =>{
	try{
		var jwt = await getJwt.getDataJwt(req, res)
		const manifest =  await manifestModel.insertManifest(req.body,res,jwt)
		res.status(200).send({
			status : 'success',
            data: manifest.rows
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
	getManifestPartner,
	uploadtManifestPartner
}