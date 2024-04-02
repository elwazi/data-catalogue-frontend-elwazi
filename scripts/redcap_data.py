
import requests
import json

data = {
    'token': '-',
    'content': 'report',
    'format': 'json',
    'report_id': '1065',
    'csvDelimiter': '',
    'rawOrLabel': 'label',
    'rawOrLabelHeaders': 'label',
    'exportCheckboxLabel': 'true',
    'returnFormat': 'json'
}
r = requests.post('https://redcap.h3abionet.org/redcap/api/',data=data)
print('HTTP Status: ' + str(r.status_code))
print(r.json())

records = r.json()
with open('../k8s/overlays/elwazi/redcap_data.json', 'w') as f:
    json.dump(records, f, indent=4, separators=(',', ': '))
