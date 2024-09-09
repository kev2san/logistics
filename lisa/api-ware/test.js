const nodemailer = require('nodemailer')
let jConfig = {
    "host":"smtp.titan.email", 
    "port":"465", 
    "secure":true, 
    "auth":{ 
        "type":"login", 
        "user":"info@lidiachile.cl",
        "pass":"L1d142023;" 
   	}
};


let email ={ 
       from:"info@lidiachile.cl",  //remitente
       to:"kevin770540@gmail.com",  //destinatario
       subject:"LIDIA ACA",  //asunto del correo
       html:` 
           <div> 
           <p>Hola amigo</p> 
           <p>Esto es una prueba del vídeo</p> 
           <p>¿Cómo enviar correos eletrónicos con Nodemailer en NodeJS </p> 
           </div> 
       ` 
   };

let createTransport = nodemailer.createTransport(jConfig);


createTransport.sendMail(email, function (error, info) { 
          if(error){ 
               console.log("Error al enviar email" + error + info); 
          } else{ 
               console.log("Correo enviado correctamente" +  info.response); 
          } 
          createTransport.close(); 
});