"""Integration tests against running localhost:3000 and local DevKinsta only.
Creates synthetic local test requests; does not send mail or call Housecall Pro.
"""
import base64
import datetime
import json
import urllib.error
import urllib.request
import uuid
from zoneinfo import ZoneInfo

BASE = 'http://localhost:3000/api/local-estimates'
PNG = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=')
CONTACT = dict(first='Local', last='Integration Test', phone='2065550100', email='test@example.invalid', street='123 Test Street', city='Kirkland', state='WA', zip='98033')

def submit(kind, values, photos=None, request_id=None, failure=False, origin='http://localhost:3000'):
    boundary = 'ck-test-' + uuid.uuid4().hex
    data = bytearray()
    fields = dict(request_id=request_id or str(uuid.uuid4()), kind=kind, payload=json.dumps(values), simulate_failure='1' if failure else '0')
    for key, value in fields.items():
        data.extend(f'--{boundary}\r\nContent-Disposition: form-data; name="{key}"\r\n\r\n{value}\r\n'.encode())
    for key, content in (photos or {}).items():
        data.extend(f'--{boundary}\r\nContent-Disposition: form-data; name="{key}"; filename="test.png"\r\nContent-Type: image/png\r\n\r\n'.encode())
        data.extend(content); data.extend(b'\r\n')
    data.extend(f'--{boundary}--\r\n'.encode())
    req = urllib.request.Request(BASE, bytes(data), headers={'Content-Type':f'multipart/form-data; boundary={boundary}','Origin':origin})
    try:
        response=urllib.request.urlopen(req, timeout=60)
    except urllib.error.HTTPError as response_error:
        response=response_error
    return response.status, json.loads(response.read())

def check(label, condition):
    assert condition, label
    print('PASS:',label)

limits=json.load(urllib.request.urlopen(BASE))
check('local backend ready', limits['mode']=='local-mock' and limits['file_bytes']>0)
ev=dict(CONTACT,charger='hardwired',location='indoors',supply='yes',distance='yes', count='6', known='yes', amps0='90')
photos={'panel':PNG,'location':PNG}
request_id=str(uuid.uuid4())
status,result=submit('ev',ev,photos,request_id)
check('EV saved with two photos',status==201 and result['saved'] and result['photo_count']==2 and result['status']=='completed')
status,replay=submit('ev',ev,photos,request_id)
check('duplicate returns original receipt without reprocessing',status==200 and replay==result)
status,_=submit('ev',dict(ev,city='Seattle'),photos,request_id)
check('changed payload cannot overwrite existing request',status==409)
status,_=submit('ev',ev,{'panel':PNG})
check('required photo enforced server-side',status==422)
status,_=submit('ev',ev,{'panel':b'not an image','location':PNG})
check('fake image rejected',status==422)
status,_=submit('ev',dict(ev,email='bad'),photos)
check('invalid contact rejected',status==422)
status,_=submit('ev',ev,photos,origin='https://untrusted.example')
check('cross-origin submit blocked',status==403)
panel=dict(CONTACT,count='2',location='both',known='yes',amps0='200',amps1='other',other1='100')
panel_photos={f'panel{i}-{side}':PNG for i in range(2) for side in ['door','back']}
request_id=str(uuid.uuid4())
status,failed=submit('panel',panel,panel_photos,request_id,failure=True)
check('mock failure still saves request and all photos',status==202 and failed['saved'] and failed['status']=='needs_attention' and failed['photo_count']==4)
status,retried=submit('panel',panel,panel_photos,request_id)
check('retry reuses record and completes',status==201 and retried['reference']==failed['reference'] and retried['attempts']==2 and retried['status']=='completed')
visit=dict(CONTACT,charger='nema',location='outdoors',distance='unsure',supply='yes')
day=datetime.datetime.now(ZoneInfo('America/Los_Angeles')).date()
for i in range(3):
    day+=datetime.timedelta(days=1)
    while day.weekday()>4: day+=datetime.timedelta(days=1)
    visit.update({f'date{i}':str(day),f'from{i}':'08:00',f'to{i}':'09:00'})
status,result=submit('ev',visit)
check('EV visit branch works without photos',status==201 and result['photo_count']==0)
status,_=submit('ev',dict(visit,date1=visit['date0']))
check('duplicate visit dates rejected',status==422)
status,_=submit('ev',dict(visit,to0='07:00'))
check('invalid time window rejected',status==422)
status,_=submit('panel',dict(panel,count='7'),panel_photos)
check('panel limit enforced server-side',status==422)
print('All local integration checks passed.')
