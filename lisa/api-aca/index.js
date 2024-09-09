


const express     = require("express");
const morgan      = require('morgan')
const cors        = require('cors')
const path        = require('path')
const bodyParser  = require('body-parser')

var fs = require('fs');
var https = require('https');

const app = express();

const user              =  require('./routes/userRoute')
const dashboard         =  require('./routes/dashboardRoute')
const management        =  require('./routes/managementRoute')
const contract          =  require('./routes/contractRoute')

//app.use(notFoundMiddleware)
app.set('port', process.env.PORT || 3001);

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
 
//morgan -> permite ver por consola las peticiones que se hacen
app.use(morgan('dev'));

//cors -> proporciona middleware con cors para utilizar con varias opciones para permitir conexiones remotas
app.use(cors());

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit:50000 
}))
app.use(bodyParser.json())
app.use(cors())



// url
app.use('/api-aca/user', user)
app.use('/api-aca/dashboard', dashboard)
app.use('/api-aca/management', management)
app.use('/api-aca/contract', contract)


https.createServer({
    cert: fs.readFileSync("/home/kmoreno/ssl/certs/lisa_lidiachile_cl_dc568_6c167_1688621888_45b499b69e9c6bc59b591a002367df6c.crt"),
    key: fs.readFileSync("/home/kmoreno/ssl/keys/dc568_6c167_ee06899caedb650d8856201c5aac910a.key")
 },app).listen(app.get('port'), function(){
  console.log('Servidor https correindo en el puerto 3001');
});

// app.listen(app.get('port'), () => {
//   console.log(`Servidor Conectado. ${app.get('port')}`);
// })
