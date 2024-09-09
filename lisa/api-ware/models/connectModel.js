const { Pool } = require('pg')

module.exports = pool = () => {
    return new Pool({
        // prod
        host: '162.240.154.235',
        
        password: 'r00t',
        user: 'root',
        database: 'lidiaware',
        port: '5432'
    })
}
