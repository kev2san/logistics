const pool = require('./connectModel')

const insert = async(res,filename,funct,username,ip,e) => {

    
	let query = {
        text: `
        	INSERT INTO error_handler(
                v_filename,
                v_funct,
                v_username,
                v_ip,
                t_e) 
            VALUES($1,$2,$3,$4,$5)
        `,

        values: [filename,funct,username,ip,e.toString()],
    }
    
    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}


module.exports = {
    insert
}