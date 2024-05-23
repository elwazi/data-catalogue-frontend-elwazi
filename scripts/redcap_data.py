import json
import requests


schema = {
    'token': '-',
    'content': 'metadata',
    'format': 'json',
    'returnFormat': 'json',
}

# The data is obtained from the results of a REDCap report, which needs to be updated when
# REDCap field names change 
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

r_schema = requests.post('https://redcap.h3abionet.org/redcap/api/',data=schema)
print('HTTP Status: ' + str(r_schema.status_code))
redcap_schema = r_schema.json()

r = requests.post('https://redcap.h3abionet.org/redcap/api/',data=data)
print('HTTP Status: ' + str(r.status_code))
records = r.json()

# This section creates a list of project metadata fields in REDCap by examining project forms
form_fields = []
for record in redcap_schema:
    if record["form_name"] == "project_metadata":
        form_fields.append(record["field_name"])
    elif record["form_name"] == "contact_details":
        form_fields.append(record["field_name"])

# This section copies project metadata from project events to dataset events in REDCap using the list
for record in records:
    if (record["redcap_event_name"] == "Project Info"):
        # print(record["record_id"] + ": " + record["redcap_event_name"])
        test_dict = {key:record[key] for key in form_fields}
    elif (record["redcap_event_name"] == "Dataset"):
        record.update(test_dict),
        # print(record["record_id"] + ": " + record["p_title"])
    else:
        break

# This section adds project acronyms if one does not already exist
for record in records:
    if record["p_acronym"] == "":
        split_title = record["p_title"].split(":")
        record["p_acronym"] = split_title[0]

projects = []
datasets = []

# This section splits the redcap json into projects and datasets for the catalogue to display
for record in records:
     if record["redcap_event_name"] == "Project Info":
         projects.append(record)
     elif record["redcap_event_name"] == "Dataset":
         datasets.append(record)
     else:
        break

report = {
    "projects": projects,
    "datasets": datasets
}

with open('/Users/wteh/PycharmProjects/data-catalogue-frontend-elwazi/JSON_endpoints/redcap_data.json', 'w') as f:
    json.dump(report, f, indent=4, separators=(',', ': '))
