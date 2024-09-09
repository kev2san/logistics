const express     = require("express");
const morgan      = require('morgan')
const cors        = require('cors')
const path        = require('path')
const bodyParser  = require('body-parser')

var fs = require('fs');
var https = require('https');

const app = express();
const user             =  require('./routes/userRoute')
const loadtruck        =  require('./routes/loadtruckRoute')
const dispatch         =  require('./routes/dispatchRoute')
const administration   =  require('./routes/administrationRoute')
const userManagement   =  require('./routes/userManagementRoute')
const transport        =  require('./routes/transportRoute')
const partner          =  require('./routes/partnerRoute')
const planner          =  require('./routes/plannerRoute')
const modules          =  require('./routes/modulesRoute')
const dashboard        =  require('./routes/dashboardRoute')
const returns          =  require('./routes/returnsRoute')
const manifest         =  require('./routes/manifestRoute')
const search           =  require('./routes/searchRoute')
const meli             =  require('./routes/meliRoute')
const integrations     =  require('./routes/integrationsRoute')
const accounting          =  require('./routes/accountingRoute')

//app.use(notFoundMiddleware)
app.set('port', process.env.PORT || 3000);

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
app.use('/api-ware/user', user)
app.use('/api-ware/loadtruck', loadtruck)
app.use('/api-ware/dispatch', dispatch)
app.use('/api-ware/administration', administration)
app.use('/api-ware/userManagement', userManagement)
app.use('/api-ware/transport', transport)
app.use('/api-ware/partner', partner)
app.use('/api-ware/planner', planner)
app.use('/api-ware/modules', modules)
app.use('/api-ware/dashboard', dashboard)
app.use('/api-ware/returns', returns)
app.use('/api-ware/manifest', manifest)
app.use('/api-ware/search', search)
app.use('/api-ware/meli', meli)
app.use('/webhook-ware/integrations', integrations)
app.use('/api-ware/accounting', accounting)
app.get('/mi-endpoint', (req, res) => {
    console.log('Se ha alcanzado el endpoint /mi-endpoint');
    res.send('Hola, se alcanzó el endpoint!');
});

/*https.createServer({
   cert: fs.readFileSync("/home/kmoreno/ssl/certs/lisa_lidiachile_cl_c518e_416b7_1704440290_c891080c75bdfd3d235bced64d15c94c.crt"),
   key: fs.readFileSync("/home/kmoreno/ssl/keys/c518e_416b7_5f25a9ef2472e86419cd43e7665d9156.key")
 },app).listen(app.get('port'), function(){
  console.log('Servidor https correindo en el puerto 3000');
});
*/
app.listen(app.get('port'), () => {
  console.log(`Servidor Conectado. ${app.get('port')}`);
})
