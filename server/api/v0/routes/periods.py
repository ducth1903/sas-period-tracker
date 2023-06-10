from flask import Blueprint, request, current_app, url_for
from collections import OrderedDict
import json
import calendar

from ..utils import response, email, conversion, query
from ..models import period_template
from ..services.get_aws import SasAws

periods_api = Blueprint('periods_api', __name__)

#GET all period
@periods_api.route('/periods/<userid>')
def get_periods(userid, returnRaw=False):
    try:
        # Query all period history
            resp = query.query_all(userid)

            # Group by 'YYYY-MM'
            # i.e. {
            #   '2021-07': ['2021-07-01': ..., '2021-07-02': ..., ...],
            #   '2021-08': {'2021-08-05': ..., '2021-08-06': ..., ...},
            # }
            if response.is_valid_response(resp):
                if returnRaw:
                    return resp["Items"]

                group_res_dict = OrderedDict()
                for item in resp["Items"]:
                    year_month = conversion.extract_year_month(item["dateStr"])
                    if year_month not in group_res_dict:
                        group_res_dict[year_month] = []
                    group_res_dict[year_month].append(item)

                group_res_list = []
                for key, value in group_res_dict.items():
                    group_res_list.append({"year_month": key, "details": value})

                return group_res_list
    except Exception as e:
        return response.error_json_response(e)
    
# GET period by year
@periods_api.route('/periods/<userid>/<int:year>')
def get_periods_year(userid, year=None):
    startEpoch = conversion.convert_dateStr_epoch(f"{year}-1-1")
    endEpoch = conversion.convert_dateStr_epoch(f"{year}-12-31")
    return query.query_start_end(userid, startEpoch, endEpoch)

# GET period by year and month
@periods_api.route('/periods/<userid>/<int:year>/<int:month>')
def get_periods_year_month(userid, year=None, month=None):
    # Query for a month or a day
    endDayOfMonth = calendar.monthrange(year, month)[1]
    startEpoch = conversion.convert_dateStr_epoch(f"{year}-{month}-1")
    endEpoch = conversion.convert_dateStr_epoch(
            f"{year}-{month}-{endDayOfMonth}"
    )
    return query.query_start_end(userid, startEpoch, endEpoch)
    
# GET period by year and month and day
@periods_api.route('/periods/<userid>/<int:year>/<int:month>/<int:day>')
def get_period_year_month_day(userid, year=None, month=None, day=None):
    time = conversion.convert_dateStr_epoch(f"{year}-{month}-{day}")
    return query.query_exact(userid, time)

# POST
@periods_api.route('/periods/<userid>', methods=['POST'])
def post_period(userid):
    data = request.data.decode("utf-8")
    received_json_data = json.loads(data)
    current_app.logger.info(f"[POST] received data: {received_json_data}")

    for rec in received_json_data:
        # i.e. rec['date'] = '2021-07-20T00:00:00.000Z'
        # 'T' is jusut a literal to separate the date from the time
        # 'Z' means 'zero hour offset', a.k.a. 'Zulu time' (UTC)
        period_obj = {
            "userId": userid,
            "timestamp": conversion.convert_dateStr_epoch(rec["date"]),
            "dateStr": rec["date"],
            "symptoms": rec["symptomIds"],
            "year": int(rec["date"].strip().split("-")[0]),
            "month": int(rec["date"].strip().split("-")[1]),
            "day": int(rec["date"].strip().split("-")[2]),
        }
        # print(period_obj)
        SasAws.periodTable.put_item(Item=period_obj)

    return response.ok_json_response()

# DELETE
@periods_api.route('/periods/<userid>/<int:year>/<int:month>/<int:day>', methods=['DELETE'])
def delete_period(userid, year=None, month=None, day=None):
    try:
        inDateEpoch = conversion.convert_dateStr_epoch(f"{year}-{month}-{day}")
        delete_item = SasAws.periodTable.delete_item(Key={"userId": userid, "timestamp": inDateEpoch})
        print(delete_item)
        return response.ok_json_response()
    except Exception as e:
        return response.error_json_response(e)

# Get lastest period
@periods_api.route('/periods/<userid>/last-period')
def last_period(userid):
    resp = query.query_lastest(userid)
    if response.is_valid_response(resp):
        return resp.get("Items", response.ok_json_response())

# Send email
@periods_api.route('/periods/<userid>/send-email', methods=['POST'])
def period_send_email(userid):
    data = request.data.decode("utf-8")
    received_json_data = json.loads(data)
    emailMonthYear = received_json_data["emailMonthYear"]  # YYYY-MM
    history = url_for("period", 
        userid=userid,
        inYear=int(emailMonthYear.split("-")[0]),
        inMonth=int(emailMonthYear.split("-")[1]),
        returnDict=True,
    )

    try:
        email.send_email(
            to_addr=received_json_data["toEmail"],
            subject=f"Your Period History for {emailMonthYear}",
            body=email.format_period_history(
                emailMonthYear, history, ref_data=period_template.default_template
            ),
        )
        return response.ok_json_response()
    except Exception as e:
        return response.error_json_response(f"Failed to send email: {e}")
