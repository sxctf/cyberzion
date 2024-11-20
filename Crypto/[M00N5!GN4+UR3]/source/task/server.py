import json
import base64
from flask import Flask, send_file, request
from core import sign, verify

app = Flask(__name__)

bank_acc = 'SB:FFFFFFFF'

with open('flag.txt', 'r') as f:
    flag = f.read().strip()

@app.post('/api/sign')
def route_send():
    app.logger.info(('sign', request.json))

    try:
        account_from = request.json['account_from']
        amount = request.json['amount']

        if (account_from == bank_acc):
            return 'Denied: You cannot use the bank account', 403

        M = (account_from, amount)
        (s1, s2) = sign(M)
        res = { 's1': s1, 's2': s2, 'M': M }

        return base64.b64encode(json.dumps(res).encode())
    except:
        return 'Bad request', 400

@app.post('/api/verify')
def route_verify():
    app.logger.info(('verify', request.json))

    try:
        sig = request.json['sig']
        data = base64.b64decode(sig)
        data = json.loads(data)

        s1 = data['s1']
        s2 = data['s2']
        M = data['M']

        valid = verify(s1, s2, M)
        res = { 'state': 'success' if valid else 'fail' }

        if (valid and M[0] == bank_acc):
            res['flag'] = flag

        return res
    except:
        return 'Bad request', 400

@app.route('/', defaults={ 'path': '' })
@app.route('/<path:path>')
def route_index(path):
    return send_file('static/index.html')

def create_app():
   return app
