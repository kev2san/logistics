from database.db import main_connection
from database.db import main_connection_realdict
from .entities.Services import Services

class ServicesModel():
    @classmethod
    def get_services(self):
        try:
            connection=main_connection()
            services=[]
            sql = """SELECT  
                            i_idservice,
                            b_migrate_users,
                            v_api,
                            v_route_api_log,
                            v_db_name,
                            v_db_server,
                            v_db_port,
                            v_db_engine,
                            v_dev_db_name,
                            v_dev_db_server,
                            v_dev_db_port,
                            v_dev_db_engine,
                            v_dev_site_url,
                            v_dev_site_server,
                            v_dev_site_port,
                            v_dev_api,
                            v_dev_route_api_log,
                            v_service,
                            v_site_url,
                            v_site_server,
                            v_site_port
                        FROM l_services
                        """
            with connection.cursor() as cursor:
                cursor.execute(sql)
                resultset = cursor.fetchall()
                for row in resultset:
                    service = Services(row[0],row[1],row[2],row[3],row[4],row[5],row[6],row[7],row[8],row[9],row[10],row[11],row[12],row[13],row[14],row[15],row[16],row[17],row[18],row[19],row[20])
                    services.append(service.to_JSON())
            connection.close()
            return services
        except Exception as ex:
            raise Exception(ex)
    @classmethod   
    def get_service(self,id):
        try:
            connection=main_connection()
            sql = """SELECT  
                            i_idservice,
                            d_created_at,
                            d_updated_at,
                            b_active,
                            b_migrate_users,
                            v_api,
                            v_route_api_log,
                            v_db_name,
                            v_db_server,
                            v_db_port,
                            v_db_engine,
                            v_dev_db_name,
                            v_dev_db_server,
                            v_dev_db_port,
                            v_dev_db_engine,
                            v_dev_site_url,
                            v_dev_site_server,
                            v_dev_site_port,
                            v_dev_api,
                            v_dev_route_api_log,
                            v_service,
                            v_site_url,
                            v_site_server,
                            v_site_port
                        FROM l_services
                        WHERE i_idservice = %s
                        """
            parameters = (id,)
            with connection.cursor() as cursor:
                cursor.execute(sql,parameters)
                row = cursor.fetchone()

                if row != None:
                    service = Services(row[0],row[1],row[2],row[3],row[4],row[5],row[6],row[7],row[8],row[9],row[10],row[11],row[12],row[13],row[14],row[15],row[16],row[17],row[18],row[19],row[20],row[21],row[22],row[23])
                    service = service.to_JSON()
            connection.close()
            return service
        except Exception as ex:
            raise Exception(ex)
    
    @classmethod
    def add_service(services):
        try:
            connection=main_connection()
            sql = """INSERT INTO l_services(
                            b_migrate_users,
                            v_api,
                            v_route_api_log,
                            v_db_name,
                            v_db_server,
                            v_db_port,
                            v_db_engine,
                            v_dev_db_name,
                            v_dev_db_server,
                            v_dev_db_port,
                            v_dev_db_engine,
                            v_dev_site_url,
                            v_dev_site_server,
                            v_dev_site_port,
                            v_dev_api,
                            v_dev_route_api_log,
                            v_service,
                            v_site_url,
                            v_site_server,
                            v_site_port
                        )
                    VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                       """
            parameters = (services.b_migrate_users,
                          services.v_api,
                          services.v_route_api_log,
                          services.v_db_name,
                          services.v_db_server,
                          services.v_db_port,
                          services.v_db_engine,
                          services.v_dev_db_name,
                          services.v_dev_db_server,
                          services.v_dev_db_port,
                          services.v_dev_db_engine,
                          services.v_dev_site_url,
                          services.v_dev_site_server,
                          services.v_dev_site_port,
                          services.v_dev_api,
                          services.v_dev_route_api_log,
                          services.v_service,
                          services.v_site_url,
                          services.v_site_server,
                          services.v_site_port)
            with connection.cursor() as cursor:
                cursor.execute(sql,parameters)
                affected_rows=cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)
    @classmethod
    def get_services_migrate_users(self):
        try:
            connection=main_connection_realdict()
            sql = """SELECT  
                            i_idservice,
                            d_created_at,
                            d_updated_at,
                            b_active,
                            b_migrate_users,
                            v_api,
                            v_route_api_log,
                            v_db_name,
                            v_db_server,
                            v_db_port,
                            v_db_engine,
                            v_dev_db_name,
                            v_dev_db_server,
                            v_dev_db_port,
                            v_dev_db_engine,
                            v_dev_site_url,
                            v_dev_site_server,
                            v_dev_site_port,
                            v_dev_api,
                            v_dev_route_api_log,
                            v_service,
                            v_site_url,
                            v_site_server,
                            v_site_port
                        FROM l_services
                        WHERE b_active = true AND b_migrate_users = true
                        """
            with connection as cursor:
                cursor.execute(sql)
                resultset = cursor.fetchall()
            connection.close()
            return resultset
        except Exception as ex:
            raise Exception(ex)
        
