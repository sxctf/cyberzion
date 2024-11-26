from flask import Flask,request,render_template,redirect
from logger import * 
import logging
from flask.logging import default_handler
import models
import sys, time
from urllib.parse import urlparse

app = Flask(__name__)
app.config['SECRET_KEY'] = '66b1132a0173910b01ee3a15ef4e69583bbf2f7f1e4462c99efbe1b9ab5bf808'
models.createDB()

l = logging.getLogger('werkzeug')
l.disabled = True
cli = sys.modules['flask.cli']
cli.show_server_banner = lambda *x: None

@app.route('//', methods=['GET'])
def index():
    if request.method == "GET":
        logger_append(request,"1100",1)
        return render_template("index.html")

@app.route('/pill-40', methods=['GET','POST'])
def pill():
    try:
        if request.method == "GET":
            logger_append(request,"1104",1)
            return render_template("pill.html")
        if request.method == "POST":
            logger_append(request,"1101",1)
            in_flag = str(request.form["pill_button"])
            if "UNION" or "union" in in_flag:
                logger_append(request,"1103",1)
            else:
                logger_append(request,"1102",1)
            original_flag = models.getFlag()
            ori = original_flag[0]
            if in_flag==ori[0]:
                logger_append(request,"1106",1)
                return render_template("reality.html")
            expression = models.getPill(in_flag)
            return render_template("pill.html", data = expression)
    except Exception as e:
            error_append(request,"1108",0,e)
            
@app.errorhandler(404) 
def not_found(e):   
    return render_template("404.html") 

@app.route('/admin', methods=['GET'])
def admin():
    try:
        if request.method == "GET":
            logger_append(request,"1107",1)
            return render_template("admin.html")
    except Exception as e:
        error_append(request,"1108",0,e)

def logger_append(request,str_type,flag):
    # flag = 0 - error, 1 - info
    params = []
    named_tuple = time.localtime() # получить struct_time
    time_string = time.strftime("%Y_%m_%d %H:%M:%S %z" , named_tuple)
    params.append(str_type)
    params.append(request.environ["REMOTE_ADDR"])
    params.append(request.environ["REMOTE_PORT"])
    params.append(f"{time_string}")
    params.append(urlparse(request.base_url).hostname)          
    params.append(request.environ["SERVER_PROTOCOL"])
    params.append(request.method)
    params.append(request.environ["PATH_INFO"])   
    #params.append(request.environ["QUERY_STRING"]) 
    params.append(request.form.to_dict())
    params.append(request.environ["HTTP_USER_AGENT"])
    params.append("200")
    params.append("None")
    start_page(flag, params)

def error_append(request,str_type,flag,e):
    # flag = 0 - error, 1 - info
    params = []
    named_tuple = time.localtime() # получить struct_time
    time_string = time.strftime("%Y_%m_%d %H:%M:%S %z" , named_tuple)
    params.append(str_type)
    params.append(request.environ["REMOTE_ADDR"])
    params.append(request.environ["REMOTE_PORT"])
    params.append(f"{time_string}")
    params.append(urlparse(request.base_url).hostname)          
    params.append(request.environ["SERVER_PROTOCOL"])
    params.append(request.method)
    params.append(request.environ["PATH_INFO"])   
    #params.append(request.environ["QUERY_STRING"]) 
    params.append(request.form.to_dict())
    params.append(request.environ["HTTP_USER_AGENT"])
    params.append("200")
    params.append(str(e).replace('"',r'\"'))
    start_page(flag, params)

if __name__ == '__main__':
    app.run(debug=False, port = 11000, host='0.0.0.0')