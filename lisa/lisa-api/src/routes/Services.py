from flask import Blueprint, jsonify, request

# Entities
from models.entities.Services import Services
# Models
from models.ServicesModel import ServicesModel

main=Blueprint('services_blueprint',__name__)

@main.route('/',methods=['GET'])
def getServices():
    try:
        services=ServicesModel.get_services()
        return jsonify(services)
    except Exception as ex:
        return jsonify({'message':str(ex)}),500
    
@main.route('/<id>',methods=['GET'])
def getService(id):
    try:
        service=ServicesModel.get_service(id)
        if service != None:
            return jsonify(service)
        else:
            return jsonify({'message':"Not found"}),404
    except Exception as ex:
        return jsonify({'message':str(ex)}),500
    
@main.route('/add',methods=['POST'])
def addService():
    try:
        service             = request.json['service']
        migrate_users       = request.json['migrate_users'] 
        api                 = request.json['api']
        route_api_log       = request.json['route_api_log']
        site_url            = request.json['site_url']
        site_server         = request.json['site_server']
        site_port           = request.json['site_port']
        db_name             = request.json['db_name']
        db_server           = request.json['db_server']
        db_port             = request.json['db_port']
        db_engine           = request.json['db_engine']
        dev_db_name         = request.json['dev_db_name']
        dev_db_server       = request.json['dev_db_server']
        dev_db_port         = request.json['dev_db_port']
        dev_db_engine       = request.json['dev_db_engine']
        dev_site_url        = request.json['dev_site_url']
        dev_site_server     = request.json['dev_site_server']
        dev_site_port       = request.json['dev_site_port']
        dev_api             = request.json['dev_api']
        dev_route_api_log   = request.json['dev_route_api_log']

        services_params = Services(migrate_users,api,route_api_log,db_name,db_server,db_port,db_engine,dev_db_name,dev_db_server,dev_db_port,dev_db_engine,dev_site_url,dev_site_server,dev_site_port,dev_api,dev_route_api_log,service,site_url,site_server,site_port)
        affected_row = ServicesModel.add_service(services_params)
        if affected_row == 1:
            return jsonify(affected_row)
        else:
            return jsonify({'message':"Error on insert"}),404
    except Exception as ex:
        return jsonify({'message':str(ex)}),500
