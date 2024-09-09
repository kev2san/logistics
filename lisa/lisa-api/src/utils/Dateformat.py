import datetime

class DateFormat():
    @classmethod
    def convert_date(selft,date):
        return datetime.datetime.strftime(date,'%Y-%m-%d')