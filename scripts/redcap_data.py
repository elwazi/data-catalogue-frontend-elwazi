
import json
import requests

data = {
    'token': '456202D2F8F6CE94F7EA4323C0C0079F',
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
records = r.json()

for record in records:
    if (record["redcap_event_name"] == "Project Info"):
        # print(record["record_id"] + ": " + record["redcap_event_name"])
        test_dict = {key:record[key] for key in ['p_title', 'p_title_other', 'p_accronym', 'p_website', 'p_description', 'p_keywords', 'project_metadata_complete','consent','title','firstname','surname','email','institution']}
    elif (record["redcap_event_name"] == "Dataset"):
        record.update(test_dict),
        # print(record["record_id"] + ": " + record["p_title"])
    else:
        break

for record in records:
    if (record["redcap_event_name"] == "Project Info"):
        # print(record["redcap_event_name"])
        records.remove(record)


records = r.json()
with open('/Users/wteh/PycharmProjects/data-catalogue-frontend-elwazi/JSON_endpoints/redcap_data.json', 'w') as f:
    json.dump(records, f, indent=4, separators=(',', ': '))
