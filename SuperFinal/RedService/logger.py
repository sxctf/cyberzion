import logging as log
import json 


# pip install python-json-logger

log.basicConfig(filename='./log/app.log', level=log.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
# insert 2024_08_04 

# Event Code 
# 1000 - Get Request. 
# 1001 - Post Request.
# 1002 - DB not initialized. Try delete file db/data.db or restart service 
# 1003 - XXE file:///
# 1004 - XXE .dtd
# 1005 - Post Request error
# 1006 - Attempt to exploit SQL Injection
# 1007 - Trying to use different HTTP Methods on start page
# 1008 - Fuzzing directory on / endpoint

global loga
loga = '''{{"event_code" : "{event}", "agent" : {{"ip" : "10.61.10.11", "name": "RedService", "id" : "002"}}, "data": {{"app_proto": "http", "src_ip": "{ip}", "src_port": "{port}", "dest_port": "5000", "event_timestamp" : "{time}"}}, "http": {{"hostname": "{hostname}", "protocol": "{protocol}", "http_method": "{http_method}", "payload" : ["{payload}"], "url": "{url}", "http_user_agent": "{http_user_agent}", "status": "{status}"}}, "err_message" : "{error}"}}'''

def start_page(flag, params):
    output = loga.format(event=params[0], ip=params[1], port=params[2], time=params[3], hostname=params[4], protocol=params[5],
                           http_method=params[6], payload=params[8], url=params[7], http_user_agent=params[9], status=params[10], error=params[11])
    if flag:
        log.info(output)
    else:
        log.error(output)

def receive_payload(flag, params):
    output = loga.format(event=params[0], ip=params[1], port=params[2], time=params[3], hostname=params[4], protocol=params[5],
                           http_method=params[6], payload=params[8], url=params[7], http_user_agent=params[9], status=params[10], error=params[11])
    
    # print(output)
    if flag:
        log.info(output)
    else:
        log.error(output)
