const ManagementModel =  require('../models/managementModel')
const getJwt = require('../middlewares/getDataJwt')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')


const sendMailContact = async(req,res,i_idcontact_propertys) => {
	return new Promise((resolve,reject)=>{
		let jConfig = {
			"host":"smtp.titan.email", 
			// Con ssl
			"port":"465", 
			"secure":true, 
			// Sin ssl
			// "port":"587", 
			// "secure":false, 
			"auth":{ 
			"type":"login", 
			"user":"ware@lidiachile.cl",
			"pass":"L1d142023;" 
			}
		};


		let email ={ 
			from:"ware@lidiachile.cl",  //remitente
			to: req.v_mail,  //destinatario
			subject:"LIDIA ACA - Formulario de arrendatario",  //asunto del correo
			html:`<!DOCTYPE html>
          <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <meta name="x-apple-disable-message-reformatting">
            <title></title>
            <!--[if mso]>
            <noscript>
              <xml>
                <o:OfficeDocumentSettings>
                  <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
              </xml>
            </noscript>
            <![endif]-->
            <style>
              table, td, div, h1, p {font-family: Arial, sans-serif;}
            </style>
          </head>
          <body style="margin:0;padding:0;">
            <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
              <tr>
                <td align="center" style="padding:0;">
                  <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
                    <tr>
                      <td align="center" style="padding:40px 0 30px 0;background:#dbfcff;">
                        <img src="https://ware.lidiachile.cl/public/images/lidiaaca.png" alt="" width="300" style="height:auto;display:block;width: 125px;" />
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:36px 30px 42px 30px;">
                        <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                          <tr>
                            <td style="padding:0 0 36px 0;color:#153643;">
                              <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">Hola ${req.v_name}!</h1>
                              <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Nos estamos comunicando con usted para que pueda llenar nuestro formulario para el arriendo de la propiedad "INSERTE PROPIEDAD", presione el siguiente link.</p>
                              <center>
                              <a href="https://aca.lidiachile.cl/${(req.action) == '1' ? 'requestTenant' : 'requestLessor'}/${i_idcontact_propertys}" style="background-color: #fbeee0;border: 2px solid #422800;border-radius: 30px;box-shadow: #422800 4px 4px 0 0;
                                              color: #422800;cursor: pointer;display: inline-block;font-weight: 600;font-size: 18px;
                                              padding: 0 18px;line-height: 50px;text-align: center;text-decoration: none;user-select: none;-webkit-user-select: none;touch-action: manipulation;">
                                Llenar Formulario
                              </a>
                              </center>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:0;">
                              <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                                <tr>
                                  <td style="width:260px;padding:0;vertical-align:top;color:#153643;">
                                    <p style="margin:0 0 25px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><img src="https://assets.codepen.io/210284/left.gif" alt="" width="260" style="height:auto;display:block;" /></p>
                                    <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"></p>
                                    <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="http://www.example.com" style="color:#ee4c50;text-decoration:underline;"></a></p>
                                  </td>
                                  <td style="width:20px;padding:0;font-size:0;line-height:0;">&nbsp;</td>
                                  <td style="width:260px;padding:0;vertical-align:top;color:#153643;">
                                    <p style="margin:0 0 25px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><img src="https://assets.codepen.io/210284/right.gif" alt="" width="260" style="height:auto;display:block;" /></p>
                                    <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"></p>
                                    <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="http://www.example.com" style="color:#ee4c50;text-decoration:underline;"></a></p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:0 0 36px 0;color:#153643;">
                              <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">En caso de tener problemas para llenar el formulario comunicate con nosotros.</p>

                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px;background:#ee4c50;">
                        <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                          <tr>
                            <td style="padding:0;width:50%;" align="left">
                              <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;">
                                &reg; LIDIA ACA, 2023<br/><a href="http://www.example.com" style="color:#ffffff;text-decoration:underline;"></a>
                              </p>
                            </td>
                            <td style="padding:0;width:50%;" align="right">
                              <table role="presentation" style="border-collapse:collapse;border:0;border-spacing:0;">
                                <tr>
                                  <td style="padding:0 0 0 10px;width:38px;">
                                    <a href="http://www.twitter.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/tw_1.png" alt="Twitter" width="38" style="height:auto;display:block;border:0;" /></a>
                                  </td>
                                  <td style="padding:0 0 0 10px;width:38px;">
                                    <a href="http://www.facebook.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/fb_1.png" alt="Facebook" width="38" style="height:auto;display:block;border:0;" /></a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>` 
		};

		let createTransport = nodemailer.createTransport(jConfig);



		createTransport.sendMail(email, function (error, info) { 
			if(error){ 
				console.log("Error al enviar email" + error + info); 
				resolve(false)
			} else{ 
				console.log("Correo enviado correctamente" +  info.response); 
				resolve(true)
			} 

			createTransport.close(); 
		});
	})
}

const sendMail = async (req,res) => {

	try{
		const get =  await ManagementModel.getContactFormPropertys(req.body,res)

		const contact =  await ManagementModel.insertContactForm(req.body,res)
		
    if (get.rowCount > 0){
			// Si es mayor a cero se actualiza el registro condicionando si es one o two
      if (req.body.action == '1' || req.body.action == 1){
        var type =  await ManagementModel.updateContactFormPropertysOne(req.body,res,contact.rows[0].i_idcontact,get.rows[0].i_idcontact_propertys)
      }else{
        var type =  await ManagementModel.updateContactFormPropertysTwo(req.body,res,contact.rows[0].i_idcontact,get.rows[0].i_idcontact_propertys)
      }

      var i_idcontact_propertys = get.rows[0].i_idcontact_propertys
		}else{
			// si es 0 se inserta un nuevo registro condicionando si es one o two
      
      if (req.body.action == '1' || req.body.action == 1){
        var type =  await ManagementModel.insertContactFormPropertysOne(req.body,res,contact.rows[0].i_idcontact)
      }else{
        var type =  await ManagementModel.insertContactFormPropertysTwo(req.body,res,contact.rows[0].i_idcontact)
      }

      var i_idcontact_propertys = type.rows[0].i_idcontact_propertys
		}

    const payload = { id: i_idcontact_propertys}
    const secret = 'l1d144c4'
    const options = { expiresIn: '365d' }
    const token = jwt.sign(payload, secret, options)

		const send = await sendMailContact(req.body,res,token)

		res.status(200).send({
			status : 'success',
            data: {}
		})

	}catch(e){
        console.log(e)
        res.status(500).send({
			code : 109,
	      	message : 'Aplication error'
	    })
    }
}

const getDataPropertys = async (req,res) => {
	try{
		const propertys =  await ManagementModel.getDataPropertys(req.body,res)

		res.status(200).send({
			status : 'success',
            data: {
                propertys : propertys.rows
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

const sendFormTenant = async (req,res) => {
  try{

    const secret = 'l1d144c4'
    const decoded = jwt.verify(req.body.id, secret)

    const id = decoded

    const formOne =  await ManagementModel.formTenant(req.body,res, id.id)

    res.status(200).send({
      status : 'success',
    })

  }catch(e){
        console.log(e)
        res.status(500).send({
        code : 109,
          message : 'Aplication error'
        })
    }
}

const sendFormLessor = async (req,res) => {
  try{
    const secret = 'l1d144c4'
    const decoded = jwt.verify(req.body.id, secret)

    const id = decoded

    const formOne =  await ManagementModel.formLessor(req.body,res, id.id)

    res.status(200).send({
      status : 'success',
    })

  }catch(e){
        console.log(e)
        res.status(500).send({
        code : 109,
          message : 'Aplication error'
        })
    }
}

const validate = async (req,res) => {
  try{

    if (req.params.contactForm == 1 || req.params.contactForm == '1'){
      var validate =  await ManagementModel.validateTenant(req.params.idproperty,res)
    }else{
      var validate =  await ManagementModel.validateLessor(req.params.idproperty,res)
    }
    

    res.status(200).send({
      status : 'success',
      data : {validate : validate.rows}
    })

  }catch(e){
        console.log(e)
        res.status(500).send({
      code : 109,
          message : 'Aplication error'
      })
    }
}

const validateResponse = async (req,res) => {
  try{
    const secret = 'l1d144c4'
    const decoded = jwt.verify(req.params.idcontact_propertys, secret)

    const id = decoded

    if (req.params.contactForm == 1 || req.params.contactForm == '1'){
      var validate =  await ManagementModel.validateResponseTenant(id.id,res)
    }else{
      var validate =  await ManagementModel.validateResponseLessor(id.id,res)
    }
    

    res.status(200).send({
      status : 'success',
      data : {validate : validate.rows}
    })

  }catch(e){
        console.log(e)
        res.status(500).send({
      code : 109,
          message : 'Aplication error'
      })
    }
}

const createProperty = async (req,res) => {
  try{

    console.log(req.body)
    var validate =  await ManagementModel.createProperty(req.body,res)
    

    res.status(200).send({
      status : 'success',
      data : {validate : validate.rows}
    })

  }catch(e){
        console.log(e)
        res.status(500).send({
      code : 109,
          message : 'Aplication error'
      })
    }
}

const getDataPropertyID = async (req,res) => {
  try{
    const property =  await ManagementModel.getDataPropertyID(req.params,res)
  
    res.status(200).send({
      status : 'success',
            data: {
                property : property.rows
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

const editProperty = async (req,res) => {
  try{
    const edit =  await ManagementModel.editProperty(req.body,res)

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


const getRegions = async (req,res) => {
  try {
    const region = await ManagementModel.getRegions(req,res)

    res.status(200).send({
      code : 200,
      status : 'success',
      data : region.rows
    })
  }catch(e){
    console.log(e)
    res.status(500).send({
      code : 109,
      message : 'Aplication error'
    })
  }
}

const getDistricts = async (req,res) => {
  try {
    const districts = await ManagementModel.getDistricts(req.params,res)

    res.status(200).send({
      code : 200,
      status : 'success',
      data : districts.rows
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
    sendMail,
    getDataPropertys,
    getDataPropertyID,
    sendFormTenant,
    sendFormLessor,
    validate,
    validateResponse,
    createProperty,
    editProperty,
    getRegions,
    getDistricts
}