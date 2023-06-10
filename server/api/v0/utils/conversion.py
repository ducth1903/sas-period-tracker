from datetime import datetime

def convert_dateStr_epoch(dateStr):
    """
    Convert 'YYYY-MM-DD' to epoch
    """
    return int(datetime.strptime(dateStr.strip(), "%Y-%m-%d").timestamp())

def convert_epoch_dateStr(epoch):
    """
    Convert epoch to 'YYYY-MM-DD'
    """
    return datetime.utcfromtimestamp(epoch).strftime("%Y-%m-%d")

def extract_year_month(dateStr):
    """
    Input: YYYY-MM-DD
    Output: YYYY-MM
    """
    return "-".join(dateStr.split("-")[:-1])
