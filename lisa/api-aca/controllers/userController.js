const UserModel =  require('../models/userModel')
const jwt 		=  require('jsonwebtoken')
const CryptoJS 	=  require('crypto-js')

const userRegister = async (req,res,next) => {
	
	// Encrypt password
	const encryptPassword = CryptoJS.AES.encrypt(req.body.v_password, 'l1d14w4r3').toString();
	req.body.v_passwordEncrypted = encryptPassword 
	console.log(req.body)
	try{
	    var response = await UserModel.searchUser(req.body,res)
	    
	    if (response.rowCount == 0){
	    	var insert = await UserModel.register(req.body,res)
			
			res.status(200).send({
		    	status : 'success',
		    })
	    }else{
	    	res.status(500).send({
		    	status : 'warning'
		    })
	    }
	}catch (e){
		console.log(e)
	    res.status(500).send({
	    	code : 3,
	      	message : 'error',
			status : 'error'
	    })
	    next(e)
	}
}

const userLogin = async(req,res,next) => {
	try{
		
		var login = await UserModel.searchUserLogin(req.body,res)
		


		if(login.rowCount > 0){
			const bytes  = CryptoJS.AES.decrypt(login.rows[0].v_password, 'l1d14w4r3')
			
			const originalText = bytes.toString(CryptoJS.enc.Utf8)
			
			if (originalText == req.body.v_password){
				
				const token = await jwt.sign({
			        iduser 			: login.rows[0].i_iduser,
					username 		: login.rows[0].v_user,

			    }, 'l1d14w4r3', { expiresIn: '24h' })

				
				// const modules = await UserModel.getModules(login.rows[0].i_iduser_level, res)

				res.status(200).json({
					code : 1,
					message : 'user validated',
					data : {
						iduser 			: login.rows[0].i_iduser,
						username 		: login.rows[0].v_user,
						token 			: token,
						iduser_level    : login.rows[0].i_iduser_level,
						// modules	 		: modules
					}
				})
			}else{
				res.status(200).json({
					code : 2,
					message : 'Incorrect user or password'
				})
			}
		}else{
			res.status(200).send({
				code : 2,
		     	message : 'Incorrect user or password '
		    })
		}
	}catch(e){
		
		console.log(e)
		res.status(500).send({
			code : 3,
	      	message : 'error'
	    })
	    next(e)
	}
}

const validateJwt = (req, res) => {
	// return res.status(200).json(req.body.token)
	var decoded = jwt.verify(req.body.token, 'l1d14w4r3');
    return res.status(200).json(decoded)
}


const generatePassword = (req, res) => {
	// Encrypt password

	const encryptPassword = CryptoJS.AES.encrypt(req.body.v_password, 'l1d14w4r3').toString();
	req.body.v_passwordEncrypted = encryptPassword    
	return res.status(200).json(req.body)
}


const updatePassword =  async (req, res) => {
    const {user, password, passwordUpdate} = req.body
    try {
		var login = await UserModel.searchUserbyid(req.body,res)
		const bytes  = CryptoJS.AES.decrypt(login.rows[0].password, 'l1d14w4r3');
		const originalText = bytes.toString(CryptoJS.enc.Utf8);
		
		const encryptPasswordUpdate = CryptoJS.AES.encrypt(passwordUpdate, 'l1d14w4r3').toString();
		if (originalText != password){
			res.status(200).json({
				code : 1,
				message : 'Wrong Password',
				type : "errorpassword",
			})
		}else if(login.rowCount > 0 && originalText == password){
		
			req.body.passwordUpdate = encryptPasswordUpdate
			const response = await UserModel.updatePassword(req ,res)
			res.status(200).json({
				code : 128,
				type : "success",
				message 	: 	'Password Updated',
						
			})
		}
    }catch (err) {
        console.error(err)
        res.status(500).send({
            code : 12,
	      	message : 'Aplication error'
	    })
    }
}


const resetPassword =  async (req, res) => {
    const {user} = req.body
	const password = 'flock'
    try {
		var login = await UserModel.searchUserbyid(req.body,res)		
		const encryptPasswordUpdate = CryptoJS.AES.encrypt(password, 'l1d14w4r3').toString();
		if(login.rowCount > 0){
			req.body.passwordUpdate = encryptPasswordUpdate
			req.body.table = login.rows[0].table
		const response = await UserModel.updatePassword(req ,res)
			res.status(200).json({
				code : 128,
				type : "success",
				message 	: 	'Password Updated',
					
				})
		}
    }catch (err) {
        console.error(err)
        res.status(500).send({
            code : 12,
	      	message : 'Aplication error'
	    })
    }
}

const generateToken = async(req, res) => {
	const token = await jwt.sign({
        iduser 			: req.body.iduser,
		username 		: req.body.username,
		iduser_profile 	: 1,
		idarea 			: 1
    }, 'l1d14w4r3', { expiresIn: '24h' })

    res.status(200).send({
        code : 12,
        type : 'success',
      	message : 'Token generated',
      	data : token
    })
}

const getRegion = async(req, res) => {
	try {
		const region = await AdministrationModel.getRegion(req, res)

		    res.status(200).json({
		        type : 'success',
		      	message : 'Region list',
		      	data : region.rows
		    })
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }

}

const getDistrict = async(req, res) => {

	try {
		const district = await AdministrationModel.getDistrict(req.params, res)

	    res.status(200).json({
	        type : 'success',
	      	message : 'District list by idregion',
	      	data : district.rows
	    })
		
	}catch(e){
  		console.log(e)
        res.status(500).send({
			type : 'danger',
	      	message : 'Aplication error'
	    })
    }

}

const userEdit = async(req, res) => {

	try {
		const district = await UserModel.edit(req.body, res)

	    res.status(200).json({
	        status : 'success',
	    })
		
	}catch(e){
  		console.log(e)
        res.status(500).send({
			status : 'danger'
	    })
    }

}

module.exports = {
	userRegister,
	userLogin,
	validateJwt,
	updatePassword,
	resetPassword,
	generateToken,
	getRegion,
	getDistrict,
	userEdit,
	generatePassword
}
