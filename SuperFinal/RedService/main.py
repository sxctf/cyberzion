from flask import Flask, render_template, has_request_context, request, make_response, jsonify
import lxml.etree
from flask.logging import default_handler
from model import *
from logger import *
from urllib.parse import urlparse
import time
import logging, sys


#install time, urllib


persons = [
    ["5868362072458741","Oracle", "FREC_Au8LPI7XtzGl84xF35b5slqopmakeGaf", "SDIUR_@#U" ],
    ["6401603733788605","Morpheus", "FREC_gtlcQY7kLIzyt62YXB2LfEFXUzf7VZF5", "IRVSE_&*%" ],
    ["1132041719025981","Trinity", "FREC_yLYI981Dgg8wfGT3MWy8H0mMJyy3qQq1", "LOVNR_!M^" ],
    ["0755720730387431","Cypher", "FREC_XGN62TKewI6NwOj0y4LJWLH7IJrcbHK7", "VNEYR_&E!" ],
    ["4250280188899889","Switch", "FREC_ERbj6bspjsvG5HD3NTnoaYqRs8TLPqmq", "BUNWP_VO#" ],
    ["6706870133920526","Apoc", "FREC_uoX8JQHimqQJZ9JwZyYwcNhmfFyVXhWA", "AWOTR_N!$"],
]

app = Flask(__name__)


l = logging.getLogger('werkzeug')
l.disabled = True
cli = sys.modules['flask.cli']
cli.show_server_banner = lambda *x: None


@app.route('/', methods = ['GET'])
def start():
    
    # Return main page
    if request.method == 'GET':
        params = []
        named_tuple = time.localtime() # получить struct_time
        time_string = time.strftime("%Y_%m_%d %H:%M:%S %z" , named_tuple)

        params.append("1000")
        params.append(request.environ["REMOTE_ADDR"])
        params.append(request.environ["REMOTE_PORT"])
        params.append(f"{time_string}")
        params.append(urlparse(request.base_url).hostname)          
        params.append(request.environ["SERVER_PROTOCOL"])
        params.append(request.method)
        params.append(request.environ["PATH_INFO"])
        params.append(request. environ["QUERY_STRING"]) 
        params.append(request.environ["HTTP_USER_AGENT"])
        params.append("200")
        params.append("none")
        
        
        #Creating SQLite db and table
        try:
            create_table()
            for element in persons:
                insert_person(element[0], element[1], element[2], element[3])
            flag = 1 
            start_page(flag, params)   
            
            return render_template("index.html") 
        
        except SyntaxError as e:
            params = []
            named_tuple = time.localtime() # получить struct_time
            time_string = time.strftime("%Y_%m_%d %H:%M:%S %z" , named_tuple)
            params.append("1002")
            params.append(request.environ["REMOTE_ADDR"])
            params.append(request.environ["REMOTE_PORT"])
            params.append(f"{time_string}")
            params.append(urlparse(request.base_url).hostname)          
            params.append(request.environ["SERVER_PROTOCOL"])
            params.append(request.method)
            params.append(request.environ["PATH_INFO"])   
            params.append(request. environ["QUERY_STRING"]) 
            params.append(request.environ["HTTP_USER_AGENT"])
            params.append("200")
            params.append(str(e))
            
            flag = 0 
            start_page(flag, params) 
            
            return render_template("db.html")
    elif request.method != 'GET':
        
        params = []
        params.append("1007")
        params.append(request.environ["REMOTE_ADDR"])
        params.append(request.environ["REMOTE_PORT"])
        params.append(f"{time_string}")
        params.append(urlparse(request.base_url).hostname)          
        params.append(request.environ["SERVER_PROTOCOL"])
        params.append(request.method)
        params.append(request.environ["PATH_INFO"])
        params.append(request. environ["QUERY_STRING"]) 
        params.append(request.environ["HTTP_USER_AGENT"])
        params.append("200")
        params.append("none")
        
        flag = 0 
        start_page(flag, params) 
        
        return render_template("methodnotallowed.html")
            
#Handle user input
@app.route('/backdoor', methods = ['GET', 'POST'])
def backdoor():
    
    # Return main page
    if request.method == 'GET':
        params = []
        named_tuple = time.localtime() # получить struct_time
        time_string = time.strftime("%Y_%m_%d %H:%M:%S %z" , named_tuple)

        params.append("1000")
        params.append(request.environ["REMOTE_ADDR"])
        params.append(request.environ["REMOTE_PORT"])
        params.append(f"{time_string}")
        params.append(urlparse(request.base_url).hostname)          
        params.append(request.environ["SERVER_PROTOCOL"])
        params.append(request.method)
        params.append(request.environ["PATH_INFO"])
        params.append(request. environ["QUERY_STRING"]) 
        params.append(request.environ["HTTP_USER_AGENT"])
        params.append("200")
        params.append("none")
           
        return render_template("backdoor.html")
        
    if request.method == 'POST':
            
        try:
            xml_src = request.get_data()
            
            if ".dtd" in str(xml_src): # Blind XXE via error, need attacker own server
                
                params = []
                named_tuple = time.localtime() # получить struct_time
                time_string = time.strftime("%Y_%m_%d %H:%M:%S %z" , named_tuple)
                   
                parser = lxml.etree.XMLParser(resolve_entities=True, no_network=False, huge_tree=True)
                doc = lxml.etree.fromstring(xml_src, parser=parser) 
                data = {
                    "data" : parser.error_log
                }
                
                params.append("1004")
                params.append(request.environ["REMOTE_ADDR"])
                params.append(request.environ["REMOTE_PORT"])
                params.append(f"{time_string}")
                params.append(urlparse(request.base_url).hostname)          
                params.append(request.environ["SERVER_PROTOCOL"])         
                params.append(request.method)
                params.append(request.environ["PATH_INFO"])  
                params.append(xml_src.decode().replace('"',r'\"').replace("\r\n", "")) 
                params.append(request.environ["HTTP_USER_AGENT"])
                params.append("200")
                params.append("none")

                flag = 1 
                receive_payload(flag, params) 

                return jsonify(data)
            
            elif "file:///" in str(xml_src): # Add vulnerable func if user input file://  XXE
                
                params = []
                named_tuple = time.localtime() # получить struct_time
                time_string = time.strftime("%Y_%m_%d %H:%M:%S %z" , named_tuple)
                
                parser = lxml.etree.XMLParser(resolve_entities=True, no_network=False, huge_tree=True)
                doc = lxml.etree.fromstring(xml_src, parser=parser)
                data = {
                    "data" : str(lxml.etree.tostring(doc))
                }
                
                params.append("1003")
                params.append(request.environ["REMOTE_ADDR"])
                params.append(request.environ["REMOTE_PORT"])
                params.append(f"{time_string}")
                params.append(urlparse(request.base_url).hostname)          
                params.append(request.environ["SERVER_PROTOCOL"])          
                params.append(request.method)
                params.append(request.environ["PATH_INFO"])  
                params.append(xml_src.decode().replace('"',r'\"').replace("\r\n", ""))
                params.append(request.environ["HTTP_USER_AGENT"])
                params.append("200")
                params.append("none")
            
                flag = 1 
                receive_payload(flag, params) 
                
                return jsonify(data) 
            
            # Return standard data if no error returned
            else:
                
                params = []
                named_tuple = time.localtime() # получить struct_time
                time_string = time.strftime("%Y_%m_%d %H:%M:%S %z" , named_tuple)
                
                parser = lxml.etree.XMLParser(resolve_entities=True, no_network=False, huge_tree=True)
                doc = lxml.etree.fromstring(xml_src, parser=parser)
                frequency = doc[0].text
    
                data = {
                        "Id" : check(frequency)[0][0],
                        "Name" : check(frequency)[0][1],
                        "Frequency" : check(frequency)[0][2],
                        "SecretCode" : check(frequency)[0][3]
                }
                
                params.append("1001")
                params.append(request.environ["REMOTE_ADDR"])
                params.append(request.environ["REMOTE_PORT"])
                params.append(f"{time_string}")
                params.append(urlparse(request.base_url).hostname)          
                params.append(request.environ["SERVER_PROTOCOL"])          
                params.append(request.method)
                params.append(request.environ["PATH_INFO"])  
                params.append(xml_src.decode().replace('"',r'\"').replace("\r\n", ""))
                params.append(request.environ["HTTP_USER_AGENT"])
                params.append("200")
                params.append("none")
            
                flag = 1 
                receive_payload(flag, params) 
                
                return jsonify(data)
            
        except SyntaxError as e:
            params = []
            named_tuple = time.localtime() # получить struct_time
            time_string = time.strftime("%Y_%m_%d %H:%M:%S %z" , named_tuple)
            params.append("1005")
            params.append(request.environ["REMOTE_ADDR"])
            params.append(request.environ["REMOTE_PORT"])
            params.append(f"{time_string}")
            params.append(urlparse(request.base_url).hostname)          
            params.append(request.environ["SERVER_PROTOCOL"])          
            params.append(request.method)
            params.append(request.environ["PATH_INFO"])   
            params.append(xml_src.decode().replace('"',r'\"').replace("\r\n", "")) 
            params.append(request.environ["HTTP_USER_AGENT"])
            params.append("200")
            params.append(str(e).replace('"',r'\"'))
            
            flag = 0 
            receive_payload(flag, params) 
            return render_template("oops.html")
        
        except IndexError as e:
            params = []
            named_tuple = time.localtime() # получить struct_time
            time_string = time.strftime("%Y_%m_%d %H:%M:%S %z" , named_tuple)
            params.append("1006")
            params.append(request.environ["REMOTE_ADDR"])
            params.append(request.environ["REMOTE_PORT"])
            params.append(f"{time_string}")
            params.append(urlparse(request.base_url).hostname)          
            params.append(request.environ["SERVER_PROTOCOL"])          
            params.append(request.method)
            params.append(request.environ["PATH_INFO"])   
            params.append(xml_src.decode().replace('"',r'\"').replace("\r\n", "")) 
            params.append(request.environ["HTTP_USER_AGENT"])
            params.append("200")
            params.append("SQL Injection detected  ("+str(e).replace('"',r'\"')+")")
            
            flag = 0 
            receive_payload(flag, params) 
            return render_template("oops.html")
            
@app.errorhandler(404)
def page_not_found(e):
    
    params = []
    named_tuple = time.localtime() # получить struct_time
    time_string = time.strftime("%Y_%m_%d %H:%M:%S %z" , named_tuple)

    params.append("1008")
    params.append(request.environ["REMOTE_ADDR"])
    params.append(request.environ["REMOTE_PORT"])
    params.append(f"{time_string}")
    params.append(urlparse(request.base_url).hostname)          
    params.append(request.environ["SERVER_PROTOCOL"])
    params.append(request.method)
    params.append(request.environ["PATH_INFO"])
    params.append(request. environ["QUERY_STRING"]) 
    params.append(request.environ["HTTP_USER_AGENT"])
    params.append("404")
    params.append("none")
    
    flag = 0 
    start_page(flag, params)
    
    return render_template('notfound.html')



if __name__ == '__main__':
    app.run(debug = False, host='0.0.0.0')
    

    
