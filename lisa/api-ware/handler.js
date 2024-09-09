const serverless  = require("serverless-http");
const express     = require("express");
const morgan      = require('morgan')
const cors        = require('cors')
const path        = require('path')
const bodyParser  = require('body-parser')

const app = express();
const country          =  require("./routes/countryRoute")
const configuration    =  require("./routes/configurationRoute")
const contact          =  require("./routes/contactRoute")
const crew             =  require("./routes/crewRoute")
const district         =  require("./routes/districtRoute")
const expedition       =  require("./routes/expeditionRoute")
const invoiceContact   =  require("./routes/invoiceContactRoute")
const vehicle          =  require('./routes/vehicleRoute')
const vehicleType      =  require('./routes/vehicleTypeRoute')
const vehicleBrand     =  require('./routes/vehicleBrandRoute')
const user             =  require('./routes/userRoute')
const region           =  require('./routes/regionRoute')
const comments         =  require('./routes/commentsRoute')
const plan             =  require('./routes/planRoute')
const picking          =  require('./routes/pickingRoute')
const tracingPackage   =  require('./routes/tracingPackageRoute')
const amunra           =  require('./routes/amunraRoute')
const anubis           =  require('./routes/anubisRoute')
const planner          =  require('./routes/plannerRoute')
const manifest         =  require('./routes/manifestRoute')
const client           =  require('./routes/clientRoute')
const tools            =  require('./routes/toolsRoute')
const pickingSurrender =  require('./routes/pickingSurrenderRoute')
const report           =  require('./routes/reportRoute')
const dashboard        =  require('./routes/dashboardRoute')
const jarvis           = require('./routes/jarvisRoute')
const transport        =  require('./routes/transportRoute')
const banks            =  require('./routes/banksRoute')
const proform          =  require('./routes/proformRoute')



app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())

// url
app.use("/jarvis/comments", comments);
app.use("/jarvis/configuration", configuration);
app.use("/jarvis/contact", contact);
app.use("/jarvis/country", country);
app.use("/jarvis/crew", crew);
app.use("/jarvis/district", district);
app.use("/jarvis/expedition", expedition);
app.use("/jarvis/invoiceContact", invoiceContact);
app.use("/jarvis/plan", plan);
app.use("/jarvis/region", region);
app.use('/jarvis/user', user)

app.use("/jarvis/vehicle", vehicle);
app.use("/jarvis/vehicleType", vehicleType);
app.use("/jarvis/vehicleBrand", vehicleBrand);

app.use("/jarvis/tracingPackage", tracingPackage);
app.use("/jarvis/amunra", amunra);
app.use("/jarvis/anubis", anubis);
app.use("/jarvis/picking", picking);
app.use("/jarvis/planner", planner);
app.use("/jarvis/manifest", manifest);
app.use("/jarvis/client", client);
app.use("/jarvis/tools", tools);
app.use("/jarvis/pickingSurrender", pickingSurrender);
app.use("/jarvis/report", report);
app.use("/jarvis/dashboard", dashboard);
app.use("/jarvis/jarvis", jarvis);
app.use("/jarvis/transport", transport);
app.use("/jarvis/banks", banks);
app.use("/jarvis/proform", proform);




app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/hello", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
