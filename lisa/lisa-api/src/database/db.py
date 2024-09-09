import psycopg2
import psycopg2.extras
from psycopg2 import DatabaseError
from decouple import config

def main_connection():
    try:
        return psycopg2.connect(
            host=config('LL_PGSQL_HOST'),
            user=config('LL_PGSQL_USER'),
            password=config('LL_PGSQL_PASSWORD'),
            database=config('LL_PGSQL_DB') 
        )
    except DatabaseError as ex:
        raise ex

def main_connection_realdict():
    try:
        conn = psycopg2.connect(
            host=config('LL_PGSQL_HOST'),
            user=config('LL_PGSQL_USER'),
            password=config('LL_PGSQL_PASSWORD'),
            database=config('LL_PGSQL_DB') 
            )
        cursor = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)
        return cursor
    except DatabaseError as ex:
        raise ex
    
def dynamic_sql(param_host,param_user, param_password, param_db, param_engine):
    try:
        if param_engine == 'PGSQL':
            cursor = dynamic_pgsql(param_host,param_user, param_password, param_db) 
        else:
            cursor = "Engine Not Created"
        return cursor
    except Exception as ex:
        raise Exception(ex)


def dynamic_pgsql(param_host,param_user, param_password, param_db):
    try:
        conn = psycopg2.connect(
            host=str(param_host),
            user= config('LL_PGSQL_USER'),#param_user,
            password=config('LL_PGSQL_PASSWORD'), #param_password,
            database=param_db
        )
        cursor = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)
        return cursor
    except DatabaseError as ex:
        raise ex
    


