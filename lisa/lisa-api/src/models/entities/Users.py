
class Users():
    def __init__(self,  i_l_iduser=None,
                        i_iduser=None,
                        i_iduser_level=None,
                        i_idservice_update=None,
                        n_phone=None,
                        d_updated_at=None,
                        d_created_at=None,
                        b_active=None,
                        d_date_admission=None,
                        d_birthdate=None,
                        v_email=None,
                        v_user=None,
                        v_names=None,
                        v_surnames=None,
                        v_identification=None,
                        v_password=None,
                        v_sex=None) -> None:
        self.i_l_iduser=i_l_iduser
        self.i_iduser=i_iduser
        self.i_iduser_level=i_iduser_level
        self.i_idservice_update=i_idservice_update
        self.n_phone=n_phone
        self.d_updated_at=d_updated_at
        self.d_created_at=d_created_at
        self.b_active=b_active
        self.d_date_admission=d_date_admission
        self.d_birthdate=d_birthdate
        self.v_email=v_email
        self.v_user=v_user
        self.v_names=v_names
        self.v_surnames=v_surnames
        self.v_identification=v_identification
        self.v_password=v_password
        self.v_sex=v_sex

    def to_JSON(self):
        return {
            'i_l_iduser': self.i_l_iduser,
            'i_iduser': self.i_iduser,
            'i_iduser_level': self.i_iduser_level,
            'i_idservice_update': self.i_idservice_update,
            'n_phone': self.n_phone,
            'd_updated_at': self.d_updated_at,
            'd_created_at': self.d_created_at,
            'b_active': self.b_active,
            'd_date_admission': self.d_date_admission,
            'd_birthdate': self.d_birthdate,
            'v_email': self.v_email,
            'v_user': self.v_user,
            'v_names': self.v_names,
            'v_surnames': self.v_surnames,
            'v_identification': self.v_identification,
            'v_password': self.v_password,
            'v_sex': self.v_sex
        }
