import urllib.request
import json
try:
    data = json.dumps({"prompt": "HI"}).encode('utf-8')
    req = urllib.request.Request('http://127.0.0.1:8001/api/chat', method='POST', data=data, headers={'Content-Type': 'application/json'})
    resp = urllib.request.urlopen(req)
    print(resp.status)
    print(resp.read())
except Exception as e:
    print(e)
    if hasattr(e, 'code'):
        print(e.code)
    if hasattr(e, 'read'):
        print(e.read())
