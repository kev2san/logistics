from flask import Blueprint, jsonify, request

# Entities
from models.entities.Users import Users
# Models
from models.UsersModel import UsersModel
from models.ServicesModel import ServicesModel

main=Blueprint('users_blueprint',__name__)

@main.route('/',methods=['GET'])
def getUsers():
    try:
        services = ServicesModel.get_services_migrate_users()
        users=UsersModel.get_users(services)
        return jsonify(users)
    except Exception as ex:
        return jsonify({'message':str(ex)}),500
    
