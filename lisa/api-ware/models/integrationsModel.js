const pool = require('./connectModel')

const weebhook_kleemarket = async(req,res) => {
    
	let query = {
        text: `
        	INSERT INTO webhooks(
                j_data,
                i_idpartner) 
            VALUES($1,1) 
        `,

        values: [req],
    }
    
    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}


module.exports = {
    weebhook_kleemarket
}