# Email server
import smtplib
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv
load_dotenv()

from_user       = os.environ.get("GMAIL_EMAIL")
from_password   = os.environ.get("GMAIL_PASSWORD")

def init_server():
    try:
        server_ssl = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server_ssl.login(from_user, from_password)
    except:
        print("SMTP failed to initialize server connections")
    return server_ssl

def send_email(to_addr, subject, body):
    msg = MIMEText(body, 'html')
    msg['Subject']  = subject
    msg['From']     = from_user
    msg['To']       = ','.join(to_addr)
    server_ssl = init_server()
    server_ssl.sendmail(from_user, to_addr, msg.as_string())
    server_ssl.close()

# ---------------------------------------------------
# Util
# ---------------------------------------------------
# [{'symptoms': {'discharge': ['thin_clear'], 'flow': ['heavy'], 
# 'collection': ['disposable_pad']}, 'userId': 'i4snpHY5EueLbxVeT8XvKziW0mz2', 
# 'month': Decimal('8'), 'timestamp': Decimal('1627876800'), 'year': Decimal('2021'), 
# 'dateStr': '2021-08-02', 'day': Decimal('2')}, 
# 
# {'dateStr': '2021-08-03', 'symptoms': {'discharge': ['stringy_stretchy'], 
# 'flow': ['medium'], 'collection': ['reusable_pad']}, 
# 'userId': 'i4snpHY5EueLbxVeT8XvKziW0mz2', 'timestamp': Decimal('1627963200')}, 
# 
# {'dateStr': '2021-08-04', 'symptoms': {'discharge': ['thin_clear'], 'symptoms': ['headache', 'cramps'], 'collection': ['reusable_pad'], 'mood': ['content', 'excited'], 'flow': ['heavy']}, 'userId': 'i4snpHY5EueLbxVeT8XvKziW0mz2', 'timestamp': Decimal('1628035200')}, \
# {'symptoms': {'discharge': ['thin_clear'], 'symptoms': ['cramps'], 'collection': ['disposable_pad'], 'mood': ['excited'], 'flow': ['heavy']}, 'userId': 'i4snpHY5EueLbxVeT8XvKziW0mz2', 'month': Decimal('8'), 'timestamp': Decimal('1628136000'), 'year': Decimal('2021'), 'dateStr': '2021-08-05', 'day': Decimal('5')}]
def format_period_history(month_year, list_date):
    res = f"""
    <html>
    <h2>You have {len(list_date)} period days in {month_year}:</h2>
    <br/>
    """
    
    for curr_date in list_date:
        res += f"<h3>{curr_date['dateStr']}</h3>"
        for symp_key, sym_val in curr_date['symptoms'].items():
            res += f"""
            <p><b>{symp_key}</b> : {', '.join(sym_val)}</p>
            """
        res += "<br/>"

    res += """
    </html>
    """

    return res

if __name__ == "__main__":
    server_ssl = init_server()
    server_ssl.sendmail(from_user, "ducth1903@gmail.com", "Testing Period Tracker App")
    server_ssl.close()