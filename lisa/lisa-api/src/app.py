from flask import Flask, jsonify, request
import os
from config import config

# Routes
from routes import Services
from routes import Users

app=Flask(__name__)

def NotFound(error):
    return "<h1>URL not found</h1>"

if __name__ == '__main__':
    app.config.from_object(config['development'])

    #Blueprints
    app.register_blueprint(Services.main,url_prefix='/api/services')
    app.register_blueprint(Users.main,url_prefix='/api/users')


    # Error Handler
    app.register_error_handler(404,NotFound )
    context = ('/home/kmoreno/ssl/certs/lisa_lidiachile_cl_dc568_6c167_1688621888_45b499b69e9c6bc59b591a002367df6c.crt', '/home/kmoreno/ssl/keys/dc568_6c167_ee06899caedb650d8856201c5aac910a.key')#certificate and key files
    #app.run(debug=True,host='lisa.lidiachile.cl')
    app.run(debug=True,host='lisa.lidiachile.cl',ssl_context=context)