import os
from dotenv import load_dotenv
import config
import sys
import argparse

load_dotenv()

token_id = os.getenv('TOKEN_ID')

import json
import requests

# Set up argument parser for command line options
parser = argparse.ArgumentParser(description='Fetch data from REDCap and format it for the catalog')
parser.add_argument('output_file', help='Path to the output JSON file')
parser.add_argument('--report_id', type=str, default='1179', help='REDCap report ID to use (default: 1179)')
parser.add_argument('--debug', action='store_true', help='Enable debug output')

args = parser.parse_args()

file_path = args.output_file
report_id = args.report_id
debug = args.debug

print(f"Token ID loaded: {'Yes' if token_id else 'No'}")
print(f"Output file path: {file_path}")
print(f"Using report_id: {report_id}")

schema = {
    'token': token_id,
    'content': 'metadata',
    'format': 'json',
    'returnFormat': 'json',
}
print("Requesting REDCap schema metadata...")

# The data is obtained from the results of a REDCap report, which needs to be updated when
# REDCap field names change 
data = {
    'token': token_id,
    'content': 'report',
    'format': 'json',
    'report_id': '1236',
    'csvDelimiter': '',
    'rawOrLabel': 'label',
    'rawOrLabelHeaders': 'label',
    'exportCheckboxLabel': 'true',
    'returnFormat': 'json'
}
print("Requesting REDCap report data...")

r_schema = requests.post(config.config['redcap_url'],data=schema)
print('Schema HTTP Status: ' + str(r_schema.status_code))

if r_schema.status_code != 200:
    print(f"Error retrieving schema: {r_schema.text}")
    # Create empty output structure and exit
    output_data = {
        "projects": [],
        "datasets": []
    }
    with open(file_path, 'w') as f:
        json.dump(output_data, f, indent=4, separators=(',', ': '))
    print(f"Empty data structure written to {file_path}")
    sys.exit(1)

redcap_schema = r_schema.json()
print(f"Schema data received: {len(redcap_schema)} metadata fields")
if len(redcap_schema) > 0 and debug:
    print(f"Sample schema field: {json.dumps(redcap_schema[0], indent=2)}")
    
    # Print all schema field names
    print("\n=== ALL SCHEMA FIELDS ===")
    schema_field_names = set()
    form_names = set()
    for field in redcap_schema:
        schema_field_names.add(field.get("field_name", ""))
        form_names.add(field.get("form_name", ""))
    
    print(f"Available forms: {sorted(list(form_names))}")
    print(f"All schema field names ({len(schema_field_names)}):")
    print(json.dumps(sorted(list(schema_field_names)), indent=2))

r = requests.post(config.config['redcap_url'],data=data)
print('Report HTTP Status: ' + str(r.status_code))

if r.status_code != 200:
    print(f"Error fetching report: {r.text}")
    print(f"The report ID {report_id} might not exist or you don't have permission to access it.")
    print("Try with a different report_id using the --report_id parameter.")
    # Create empty output structure and exit
    output_data = {
        "projects": [],
        "datasets": []
    }
    with open(file_path, 'w') as f:
        json.dump(output_data, f, indent=4, separators=(',', ': '))
    print(f"Empty data structure written to {file_path}")
    sys.exit(1)

# Check if records is a list and not empty
try:
    records = r.json()
except json.JSONDecodeError:
    print(f"Error decoding JSON response: {r.text}")
    # Create empty output structure and exit
    output_data = {
        "projects": [],
        "datasets": []
    }
    with open(file_path, 'w') as f:
        json.dump(output_data, f, indent=4, separators=(',', ': '))
    print(f"Empty data structure written to {file_path}")
    sys.exit(1)

if not isinstance(records, list):
    print(f"Error: Records returned is not a list. Received: {type(records)}")
    if isinstance(records, dict) and 'error' in records:
        print(f"API Error: {records['error']}")
    print("Creating empty output structure and exiting")
    output_data = {
        "projects": [],
        "datasets": []
    }
    with open(file_path, 'w') as f:
        json.dump(output_data, f, indent=4, separators=(',', ': '))
    print(f"Empty data structure written to {file_path}")
    sys.exit(1)

print(f"Records received: {len(records)}")
if len(records) > 0 and debug:
    print(f"Sample record structure: {json.dumps(list(records[0].keys()), indent=2)}")
    print(f"Event names in data: {set([r.get('redcap_event_name', 'None') for r in records])}")
    
    # Print all fields from the records
    print("\n=== ALL FIELDS IN RECORDS ===")
    all_record_fields = set()
    for record in records:
        for field in record.keys():
            all_record_fields.add(field)
    
    print(f"All record fields ({len(all_record_fields)}):")
    print(json.dumps(sorted(list(all_record_fields)), indent=2))
    
    # Print sample values for each field from the first record
    print("\n=== SAMPLE VALUES FROM FIRST RECORD ===")
    first_record = records[0]
    for field in sorted(first_record.keys()):
        value = first_record[field]
        # Truncate long values for display
        if isinstance(value, str) and len(value) > 100:
            value = value[:100] + "..."
        print(f"{field}: {value}")
elif len(records) == 0:
    print("No records received from REDCap API")
    # Create empty output structure and exit
    output_data = {
        "projects": [],
        "datasets": []
    }
    with open(file_path, 'w') as f:
        json.dump(output_data, f, indent=4, separators=(',', ': '))
    print(f"Empty data structure written to {file_path}")
    sys.exit(0)

# This section creates a list of project metadata fields in REDCap by examining project forms
form_fields = []
for record in redcap_schema:
    if record["form_name"] == "project_metadata":
        form_fields.append(record["field_name"])
    elif record["form_name"] == "contact_details":
        form_fields.append(record["field_name"])

print(f"Metadata fields extracted: {len(form_fields)}")
if debug:
    print(f"Sample metadata fields: {form_fields[:5]} ...")

# This section copies project metadata from project events to dataset events in REDCap using the list
test_dict = {}

# Identify project and dataset event names in the data
event_names = set()
for record in records:
    event_names.add(record.get("redcap_event_name", ""))

print(f"Found event names in data: {event_names}")

# Try to find project event name - look for "Project" in the name
project_event_name = None
for name in event_names:
    if "project" in name.lower():
        project_event_name = name
        break

if not project_event_name:
    project_event_name = "Project Info"  # Default fallback
    print(f"No project event name found, using default: {project_event_name}")
else:
    print(f"Using project event name: {project_event_name}")

# Copy metadata from project records to dataset records
for record in records:
    if record["redcap_event_name"] == project_event_name:
        test_dict = {key:record[key] for key in form_fields if key in record}
        print(f"Copying metadata from {project_event_name} record_id: {record.get('record_id', 'unknown')}")
        print(f"Fields copied: {len(test_dict)}")
    elif record["redcap_event_name"] == "Dataset":
        record.update(test_dict)
        print(f"Updated Dataset record_id: {record.get('record_id', 'unknown')}")

# This section adds project acronyms if one does not already exist
acronym_count = 0
for record in records:
    if record.get("p_acronym", "") == "":
        split_title = record.get("p_title", "").split(":")
        if split_title and len(split_title) > 0:
            record["p_acronym"] = split_title[0]
            acronym_count += 1
print(f"Added {acronym_count} missing acronyms")

# Separate the projects and datasets to match test.json format
projects = []
datasets = []

# Transform records to match test.json format
for record in records:
    if record["redcap_event_name"] == project_event_name:
        # Change the event name to match test.json format "Project"
        record["redcap_event_name"] = "Project"
        projects.append(record)
    elif record["redcap_event_name"] == "Dataset":
        datasets.append(record)

print(f"Projects: {len(projects)}, Datasets: {len(datasets)}")

# Update field names to match test.json format
def update_field_name(data, old_field, new_field):
    count = 0
    for item in data:
        if old_field in item:
            item[new_field] = item.pop(old_field)
            count += 1
    return count

# Update acronym field to match test.json format
p_acr_count = update_field_name(projects, 'p_acronym', 'p_accronym')
d_acr_count = update_field_name(datasets, 'p_acronym', 'p_accronym')

# Update category field to match test.json format
p_cat_count = update_field_name(projects, 'd_category_1', 'd_category')
d_cat_count = update_field_name(datasets, 'd_category_1', 'd_category')

print(f"Field renames - Projects: acronym({p_acr_count}), category({p_cat_count})")
print(f"Field renames - Datasets: acronym({d_acr_count}), category({d_cat_count})")

# Create the output structure matching test.json format
output_data = {
    "projects": projects,
    "datasets": datasets
}

print(f"Writing data to {file_path}")
print(f"Final data structure: projects({len(projects)}), datasets({len(datasets)})")

with open(file_path, 'w') as f:
    json.dump(output_data, f, indent=4, separators=(',', ': '))

print(f"Data successfully written to {file_path}")

