from database.db import dynamic_sql
from .entities.Users import Users

class UsersModel():
    @classmethod
    def get_users(self, services):
        try:
            for row_services in services:
                
                dynamic_connection=dynamic_sql(row_services['v_db_server'],0,0,row_services['v_db_name'],row_services['v_db_name'],row_services['v_db_engine'])
                print('dynamic conn to server :'+row_services['v_db_server']+' and BD: '+ row_services['v_db_name']+' !ok!')
                sql = """SELECT 
                            i_iduser,
                            i_iduser_level,
                            n_phone,
                            d_updated_at,
                            d_created_at,
                            b_active,
                            d_date_admission,
                            d_birthdate,
                            v_email,
                            v_user,
                            v_names,
                            v_surnames,
                            v_identification,
                            v_password,
                            v_sex,"""+"'"+ str(row_services['v_db_name'])+"'"+""" as db_origin,"""+"'"+str(row_services['i_idservice']) +"'"+""" as id_service
                        FROM users"""
                dynamic_connection.execute(str(sql))
                resultset = dynamic_connection.fetchall()
                print(resultset)
                
                #with link_connection.cursor() as cursor:
                    #cursor.execute(sql)
                    #resultset = cursor.fetchall()
                    #for row in resultset:
                        #users = Users(row[0],row[1],row[2],row[3],row[4],row[5],row[6],row[7],row[8],row[9],row[10],row[11],row[12],row[13],row[14],row[15],row[16],row[17],row[18],row[19],row[20],row[21],row[22],row[23])
                        #users.append(users.to_JSON())
                #link_connection.close()
            return services
        except Exception as ex:
            raise Exception(ex)
    
        
