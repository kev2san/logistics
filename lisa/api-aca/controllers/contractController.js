const ContractModel =  require('../models/contractModel')
const getJwt = require('../middlewares/getDataJwt')
const htmlDocx = require('html-docx-js');
const fs = require('fs');
const axios = require('axios')
const path = require('path');
const { promisify } = require('util');

const getInfoData = async (req,res) => {
	try{
		var data = await ContractModel.getInfoData(req.params,res)

		if (data.rows.length > 0){

			if (data.rows[0].j_html == '' || data.rows[0].j_html == null){
				const general = Object.assign({}, data.rows[0].j_form_one, data.rows[0].j_form_two)
				const update = await ContractModel.updateJhmtl(req.params, res, general)
				var data = await ContractModel.getInfoData(req.params,res)
			}
		}

		const documents = await ContractModel.getDocumentsName(req.params,res)


		res.status(200).send({
			status : 'success',
            data: {
            	j_html : data.rows[0].j_html,
            	v_rent : data.rows[0].v_rent,
            	v_type_rent : data.rows[0].v_type_rent,
            	documents : documents.rows
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

const makehtml = async (req,res) => {
	try{
		const fechaActual = new Date();

		const anio = fechaActual.getFullYear();
		const mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0");
		const dia = fechaActual.getDate().toString().padStart(2, "0");
		const horas = fechaActual.getHours().toString().padStart(2, "0");
		const minutos = fechaActual.getMinutes().toString().padStart(2, "0");
		const segundos = fechaActual.getSeconds().toString().padStart(2, "0");

		const formatoFecha = anio + mes + dia + horas + minutos + segundos;
		
		var nameDocument = `Documento_${formatoFecha}.docx`;

		


		const writeFile = promisify(fs.writeFile);


		html = `<!DOCTYPE html>
				<html lang="es">
				<head>
					<meta charset="UTF-8">
					<title>Documento</title>
				</head>
				<body>
					${req.body.html}
				</body>
				</html>`
		// Genera el archivo DOCX como un buffer
	    const docx = await htmlDocx.asBlob(html, { encoding: 'utf-8' });

	    // Guarda el archivo en disco
      const filename = path.resolve(__dirname, '..', 'documents', nameDocument);

	    await writeFile(filename, docx);

	    const saveDocument = await ContractModel.saveDocument(req.body,res,nameDocument)
		const documents = await ContractModel.getDocumentsName(req.body,res)

		res.status(200).send({
			status : 'success',
			nameDocument : nameDocument,
			data : documents.rows
		})

	}catch(e){
        console.log(e)
        res.status(500).send({
			code : 109,
	      	message : 'Aplication error'
	    })
    }
}

const saveInfo = async (req,res) => {
	try{

		var data = await ContractModel.updateJhmtl(req.body,res)
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

const sendWhatsapp = async (req,res) => {
	try{
		const axios = require('axios');

		const headers = {
		  'Authorization': 'Bearer EAADsHPTE6fQBAL4u4U4bF83KVe6zzfZBMUG7M4AAIO1FSvHo8fpDxPJnMRJGROOdnOBkVymZBXDE4J32jQb5PevXWjYq0yMasDCFN0oZA6euEFWV62pnGrpDxpWzeXLNO8Dxtp5TizsXjfK3kSrV9EZCEQYbHKk1G86T1u8AqWTNi61fjhVa4lmLNKX3pKZCEwu1ZBwPytlwZDZD',
		  'Content-Type': 'application/json'
		};

		const data = {
		  'messaging_product': 'whatsapp',
		  'to': `56${req.params.number}`,
		  'type': 'template',
		  'template': {
		    'name': 'hello_world',
		    'language': {
		      'code': 'en_US'
		    }
		  }
		};

		axios.post('https://graph.facebook.com/v16.0/122940360789941/messages', data, { headers })
		  .then(response => {
		    console.log(response.data);
		})
		.catch(error => {
		    console.error(error);
		});


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


module.exports = {
    getInfoData,
    makehtml,
    saveInfo,
    sendWhatsapp
}