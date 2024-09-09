const { Pool } = require('pg')

module.exports = pool = () => {
    return new Pool({
        // prod
        host: '162.240.73.135',
        
        password: 'r0otL1d14',
        user: 'lidiaroot',
        database: 'lidiaaca',
        port: '5432'
    })
}