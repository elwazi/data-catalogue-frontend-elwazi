import os
from dotenv import load_dotenv
import config
import sys
import argparse
import json
import logging
import requests
from collections import defaultdict, Counter
from itertools import chain

load_dotenv()

LOG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "redcap_pipeline.log")


def setup_logging():
    logging.basicConfig(
        filename=LOG_FILE,
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
    )


def print_header(title):
    print("=" * 60)
    print(title)
    print("=" * 60)

def print_section(title):
    print(f"\n{title}")
    print("=" * 40)

def analyze_records(records, debug):
    """Efficiently analyze records with minimal memory usage"""
    if not debug or not records:
        return
    
    # Use Counter for efficient counting
    event_counts = Counter(record.get('redcap_event_name', 'None') for record in records)
    event_names = set(event_counts.keys())
    
    print(f"Event names: {sorted(event_names)}")
    print(f"Records by event:")
    for event_name, count in sorted(event_counts.items()):
        print(f"  {event_name}: {count} records")
    
    # Show sample record efficiently
    first_record = records[0]
    print(f"\nSample record - ID: {first_record.get('record_id', 'N/A')}, Event: {first_record.get('redcap_event_name', 'N/A')}")
    
    # Analyze important fields efficiently using set comprehensions
    important_fields = ['p_title', 'p_acronym', 'd_name', 'd_domain', 'd_countries']
    for field in important_fields:
        values = {record[field] for record in records if record.get(field)}
        print(f"{field}: {len(values)} unique values")
        if values and len(values) <= 10:
            print(f"  Values: {sorted(values)}")

def fetch_redcap_data(token_id, report_id='1236'):
    """Fetch data from REDCap API with optimized requests"""
    if not token_id or not str(token_id).strip():
        raise ValueError("TOKEN_ID is missing or empty. Set it in scripts/.env")

    base_data = {
        'token': token_id,
        'format': 'json',
        'returnFormat': 'json'
    }
    
    # Prepare both requests efficiently
    schema_data = {**base_data, 'content': 'metadata'}
    report_data = {
        **base_data, 
        'content': 'report',
        'report_id': report_id,
        'csvDelimiter': '',
        'rawOrLabel': 'label',
        'rawOrLabelHeaders': 'label',
        'exportCheckboxLabel': 'true'
    }
    
    try:
        r_schema = requests.post(config.config['redcap_url'], data=schema_data, timeout=60)
        r_report = requests.post(config.config['redcap_url'], data=report_data, timeout=60)
    except requests.RequestException as e:
        raise ConnectionError(f"Could not connect to REDCap API: {e}") from e

    if r_schema.status_code != 200:
        raise RuntimeError(f"Schema fetch failed (HTTP {r_schema.status_code}): {r_schema.text}")

    if r_report.status_code != 200:
        raise RuntimeError(f"Report fetch failed (HTTP {r_report.status_code}): {r_report.text}")

    try:
        redcap_schema = r_schema.json()
        records = r_report.json()
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON response from REDCap API: {e}") from e

    if not isinstance(redcap_schema, list):
        raise ValueError(f"Schema response is not a list (got {type(redcap_schema).__name__})")

    if not isinstance(records, list):
        if isinstance(records, dict) and records.get('error'):
            raise RuntimeError(f"REDCap API error: {records['error']}")
        raise ValueError(f"Report response is not a list (got {type(records).__name__})")

    return redcap_schema, records

def process_records(records, redcap_schema, debug):
    """Process records efficiently with optimized data structures"""
    # Extract metadata fields efficiently using set for O(1) lookup
    target_forms = {"project_metadata", "contact_details"}
    form_fields = {
        field["field_name"] for field in redcap_schema 
        if field["form_name"] in target_forms
    }
    
    # Find project event name efficiently
    event_names = {record.get("redcap_event_name", "") for record in records}
    project_event_name = next((name for name in event_names if "project" in name.lower()), "Project Info")
    
    # Build metadata map keyed by record_id from project records
    metadata_by_record_id = {}
    for record in records:
        if record.get("redcap_event_name") == project_event_name:
            rid = record.get("record_id")
            if rid:
                metadata_by_record_id[rid] = {key: record[key] for key in form_fields if key in record}
    if debug:
        print(f"Project metadata entries collected: {len(metadata_by_record_id)}")
    
    # Process records in single pass for better efficiency
    project_records_processed = dataset_records_processed = 0
    projects = []
    datasets = []
    acronym_count = 0
    
    for record in records:
        event_name = record["redcap_event_name"]
        
        if event_name == project_event_name:
            # Update event name and add to projects
            record["redcap_event_name"] = "Project"
            projects.append(record)
            project_records_processed += 1
            
        elif event_name == "Dataset":
            # Apply metadata by matching record_id
            rid = record.get("record_id")
            if rid and rid in metadata_by_record_id:
                record.update(metadata_by_record_id[rid])
            dataset_records_processed += 1
            
            # Add missing acronyms in same pass
            if not record.get("p_acronym"):
                split_title = record.get("p_title", "").split(":")
                if split_title:
                    record["p_acronym"] = split_title[0]
                    acronym_count += 1
            
            datasets.append(record)
    
    # Update category field names efficiently
    def update_field_name(data, old_field, new_field):
        count = 0
        for item in data:
            if old_field in item:
                item[new_field] = item.pop(old_field)
                count += 1
        return count
    
    p_cat_count = update_field_name(projects, 'd_category_1', 'd_category')
    d_cat_count = update_field_name(datasets, 'd_category_1', 'd_category')
    
    # Debug: show distinct acronyms in projects vs datasets after propagation
    if debug:
        proj_acros = {p.get('p_acronym') for p in projects if p.get('p_acronym')}
        data_acros = {d.get('p_acronym') for d in datasets if d.get('p_acronym')}
        print(f"Distinct project acronyms: {len(proj_acros)} -> {sorted(list(proj_acros))[:10]}")
        print(f"Distinct dataset acronyms: {len(data_acros)} -> {sorted(list(data_acros))[:10]}")
    
    return projects, datasets, {
        'project_records_processed': project_records_processed,
        'dataset_records_processed': dataset_records_processed,
        'acronym_count': acronym_count,
        'p_cat_count': p_cat_count,
        'd_cat_count': d_cat_count
    }

def analyze_final_data(projects, datasets, debug):
    """Analyze final data efficiently using set comprehensions"""
    if not debug:
        return
    
    # Use set comprehensions for efficient unique value extraction
    project_acronyms = {project.get('p_acronym', '') for project in projects if project.get('p_acronym')}
    dataset_domains = {dataset.get('d_domain', '') for dataset in datasets if dataset.get('d_domain')}
    
    print(f"Project acronyms found: {len(project_acronyms)}")
    if project_acronyms:
        print(f"  Acronyms: {sorted(project_acronyms)}")
    
    print(f"Dataset domains found: {len(dataset_domains)}")
    if dataset_domains:
        print(f"  Domains: {sorted(dataset_domains)}")
    
    # Show samples efficiently
    if projects:
        sample_project = projects[0]
        print(f"\nSample project - ID: {sample_project.get('record_id', 'N/A')}, "
              f"Title: {sample_project.get('p_title', 'N/A')}, "
              f"Acronym: {sample_project.get('p_acronym', 'N/A')}")
    
    if datasets:
        sample_dataset = datasets[0]
        print(f"Sample dataset - ID: {sample_dataset.get('record_id', 'N/A')}, "
              f"Name: {sample_dataset.get('d_name', 'N/A')}, "
              f"Domain: {sample_dataset.get('d_domain', 'N/A')}, "
              f"Project Acronym: {sample_dataset.get('p_acronym', 'N/A')}")

def main():
    parser = argparse.ArgumentParser(description='Fetch data from REDCap and format it for the catalog (pipeline)')
    parser.add_argument('output_file', help='Path to the output JSON file')
    parser.add_argument('--report_id', type=str, default='1236', help='REDCap report ID to use (default: 1236)')
    parser.add_argument('--debug', action='store_true', default=True, help='Enable debug output (default: True)')
    parser.add_argument('--max_records', type=int, default=1000, help='Maximum number of records to fetch (default: 1000)')
    
    args = parser.parse_args()

    setup_logging()
    logging.info("Pipeline started")
    logging.info(
        "Config: output_file=%s report_id=%s debug=%s max_records=%s",
        args.output_file,
        args.report_id,
        args.debug,
        args.max_records,
    )
    
    print_header("REDCAP DATA PIPELINE")
    token_id = os.getenv('TOKEN_ID')
    print(f"Token ID loaded: {'Yes' if token_id else 'No'}")
    print(f"Output file: {args.output_file}, Report ID: {args.report_id}, Debug: {args.debug}, Max records: {args.max_records}")
    
    try:
        # Fetch data from REDCap
        logging.info("Fetching REDCap data")
        print("Fetching REDCap data...")
        redcap_schema, records = fetch_redcap_data(token_id, args.report_id)
        logging.info(
            "REDCap fetch complete: schema_fields=%s records=%s",
            len(redcap_schema),
            len(records),
        )
        print(f"Schema fields: {len(redcap_schema)}, Records: {len(records)}")
        
        if not records:
            raise Exception("No records received from REDCap API")
        
        # Limit records efficiently
        if len(records) > args.max_records:
            logging.info(
                "Limiting records from %s to %s",
                len(records),
                args.max_records,
            )
            print(f"Limiting records from {len(records)} to {args.max_records}")
            records = records[:args.max_records]
        
        # Analyze raw records
        analyze_records(records, args.debug)
        
        # Process records efficiently
        print_section("PROCESSING RECORDS")
        projects, datasets, stats = process_records(records, redcap_schema, args.debug)
        logging.info(
            "Processing complete: projects=%s datasets=%s project_records=%s dataset_records=%s",
            len(projects),
            len(datasets),
            stats["project_records_processed"],
            stats["dataset_records_processed"],
        )
        
        print(f"Projects: {len(projects)}, Datasets: {len(datasets)}")
        print(f"Project records processed: {stats['project_records_processed']}")
        print(f"Dataset records processed: {stats['dataset_records_processed']}")
        print(f"Added {stats['acronym_count']} missing acronyms")
        print(f"Field renames - Projects: category({stats['p_cat_count']}), Datasets: category({stats['d_cat_count']})")
        
        # Analyze final data
        if args.debug:
            print_section("FINAL DATA ANALYSIS")
            analyze_final_data(projects, datasets, args.debug)
        
        # Write output efficiently
        output_data = {"projects": projects, "datasets": datasets}
        with open(args.output_file, 'w') as f:
            json.dump(output_data, f, indent=4, separators=(',', ': '))
        
        logging.info("Data written to %s", args.output_file)
        logging.info(
            "Pipeline completed successfully: projects=%s datasets=%s",
            len(projects),
            len(datasets),
        )
        print(f"\nData successfully written to {args.output_file}")
        print(f"Final structure: projects({len(projects)}), datasets({len(datasets)})")
        
    except Exception as e:
        logging.error("Pipeline failed: %s", e)
        if os.path.isfile(args.output_file):
            logging.error("Existing output file was NOT modified: %s", args.output_file)
            print(
                f"Existing output file was NOT modified: {args.output_file}",
                file=sys.stderr,
            )
        else:
            logging.error("No output file written: %s", args.output_file)
            print(f"No output file written: {args.output_file}", file=sys.stderr)
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    
    print_header("PIPELINE COMPLETED")

if __name__ == "__main__":
    main()
