from datetime import datetime

def convert_dateStr_epoch(dateStr):
    """
    Convert 'YYYY-MM-DD' to epoch
    """
    # return int( datetime.strptime(dateStr.split('T')[0], '%Y-%m-%d').timestamp() )
    return int(datetime.strptime(dateStr.strip(), "%Y-%m-%d").timestamp())

def extract_year_month(dateStr):
    """
    Input: YYYY-MM-DD
    Output: YYYY-MM
    """
    return "-".join(dateStr.split("-")[:-1])
