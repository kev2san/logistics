
from utils.Dateformat import DateFormat
class Services():
    def __init__(self,  i_idservice =None,
                        b_migrate_users=None,
                        v_api=None,
                        v_route_api_log=None,
                        v_db_name=None,
                        v_db_server=None,
                        v_db_port=None,
                        v_db_engine=None,
                        v_dev_db_name=None,
                        v_dev_db_server=None,
                        v_dev_db_port=None,
                        v_dev_db_engine=None,
                        v_dev_site_url=None,
                        v_dev_site_server=None,
                        v_dev_site_port=None,
                        v_dev_api=None,
                        v_dev_route_api_log=None,
                        v_service=None,
                        v_site_url=None,
                        v_site_server=None,
                        v_site_port=None) -> None:
        self.i_idservice=i_idservice
        self.b_migrate_users=b_migrate_users
        self.v_api=v_api
        self.v_route_api_log=v_route_api_log
        self.v_db_name=v_db_name
        self.v_db_server=v_db_server
        self.v_db_port=v_db_port
        self.v_db_engine=v_db_engine
        self.v_dev_db_name=v_dev_db_name
        self.v_dev_db_server=v_dev_db_server
        self.v_dev_db_port=v_dev_db_port
        self.v_dev_db_engine=v_dev_db_engine
        self.v_dev_site_url=v_dev_site_url
        self.v_dev_site_server=v_dev_site_server
        self.v_dev_site_port=v_dev_site_port
        self.v_dev_api=v_dev_api
        self.v_dev_route_api_log=v_dev_route_api_log
        self.v_service=v_service
        self.v_site_url=v_site_url
        self.v_site_server=v_site_server
        self.v_site_port=v_site_port

    def to_JSON(self):
        return {
            'i_idservice':self.i_idservice,
            'b_migrate_users': self.b_migrate_users,
            'v_api': self.v_api,
            'v_route_api_log': self.v_route_api_log,
            'v_db_name': self.v_db_name,
            'v_db_server': self.v_db_server,
            'v_db_port': self.v_db_port,
            'v_db_engine': self.v_db_engine,
            'v_dev_db_name': self.v_dev_db_name,
            'v_dev_db_server': self.v_dev_db_server,
            'v_dev_db_port': self.v_dev_db_port,
            'v_dev_db_engine': self.v_dev_db_engine,
            'v_dev_site_url': self.v_dev_site_url,
            'v_dev_site_server': self.v_dev_site_server,
            'v_dev_site_port': self.v_dev_site_port,
            'v_dev_api': self.v_dev_api,
            'v_dev_route_api_log': self.v_dev_route_api_log,
            'v_service': self.v_service,
            'v_site_url': self.v_site_url,
            'v_site_server': self.v_site_server,
            'v_site_port': self.v_site_port
        }
