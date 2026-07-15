#!/usr/bin/env python3
"""
Verify catalogue counts match what the React frontend displays.

The frontend (createDataProvider.ts) loads public/api/redcap_data.json and:
  - Shows only datasets where d_catalogue_ready == "Yes"
  - Shows all projects from the JSON
  - Sets project.dataset_count from catalog-ready datasets sharing record_id

Filter sidebar counts (FieldValuesFilter.tsx) use the same dataset list and
count exact matches (d_status, d_provenance, ...) or comma-separated tokens
(d_domain, d_countries, du_permission, dh_disease_status).

Usage:
  python scripts/verify_frontend_data.py
  python scripts/verify_frontend_data.py --json-path public/api/redcap_data.json
  python scripts/verify_frontend_data.py --filter '{"d_status":"Incomplete"}'
"""

import argparse
import json
import sys
from collections import Counter
from pathlib import Path
from typing import Any

COMMA_SEPARATED_FIELDS = frozenset(
    {"d_domain", "d_countries", "du_permission", "dh_disease_status"}
)

FILTER_SIDEBAR_COLUMNS = [
    "d_domain",
    "d_countries",
    "redcap_data_access_group",
    "d_provenance",
    "d_status",
    "du_permission",
    "dh_disease_status",
]

DEFAULT_JSON = (
    Path(__file__).resolve().parent.parent / "public" / "api" / "redcap_data.json"
)


def compute_access_priority(record):
    """Mirror createDataProvider.ts computeAccessPriority."""
    if _non_empty_str(record.get("dap_repo_url")):
        return 0
    if _non_empty_str(record.get("dap_url_email")):
        return 1
    if _non_empty_str(record.get("dap_primary_email")):
        return 2
    if _non_empty_str(record.get("dap_other_contact_link")):
        return 3
    return 4


def _non_empty_str(value):
    return isinstance(value, str) and value.strip() != ""


def build_frontend_data(raw):
    """Apply the same transforms as src/createDataProvider.ts."""
    raw_datasets = raw.get("datasets", [])
    raw_projects = raw.get("projects", [])

    catalog_ready = [
        d for d in raw_datasets if d.get("d_catalogue_ready") == "Yes"
    ]

    datasets = [
        {
            "id": i,
            "access_priority": compute_access_priority(record),
            **record,
        }
        for i, record in enumerate(catalog_ready)
    ]

    dataset_counts = {}
    for record in datasets:
        rid = record.get("record_id")
        if isinstance(rid, str) and rid:
            dataset_counts[rid] = dataset_counts.get(rid, 0) + 1

    projects = []
    for record in raw_projects:
        rid = record.get("record_id")
        keywords_raw = record.get("p_keywords") or ""
        keywords = [
            {"name": part.strip()}
            for part in keywords_raw.replace(";", ",").split(",")
            if part.strip()
        ]
        projects.append(
            {
                "id": rid,
                "dataset_count": dataset_counts.get(rid, 0),
                **record,
                "p_keywords": keywords,
            }
        )

    return {
        "datasets": datasets,
        "projects": projects,
        "raw_dataset_count": len(raw_datasets),
        "excluded_datasets": [
            d for d in raw_datasets if d.get("d_catalogue_ready") != "Yes"
        ],
    }


def split_comma_values(value):
    if not isinstance(value, str):
        return []
    return [part.strip() for part in value.split(",") if part.strip()]


def apply_list_filters(records, filters):
    """Mirror createDataProvider getList comma-separated + regular filters."""
    if not filters:
        return records

    comma_filters = {
        k: filters[k] for k in COMMA_SEPARATED_FIELDS if k in filters
    }
    regular_filters = {
        k: v for k, v in filters.items() if k not in COMMA_SEPARATED_FIELDS
    }

    filtered = records
    for field, values in comma_filters.items():
        if isinstance(values, list):
            filtered = [
                r
                for r in filtered
                if field in r
                and r[field]
                and any(v in split_comma_values(r[field]) for v in values)
            ]
        elif isinstance(values, str):
            filtered = [
                r
                for r in filtered
                if field in r
                and r[field]
                and values in split_comma_values(r[field])
            ]

    for field, value in regular_filters.items():
        filtered = [r for r in filtered if r.get(field) == value]

    return filtered


def sidebar_filter_counts(datasets, column):
    """Mirror FieldValuesFilter.tsx count logic on the frontend dataset list."""
    counts = Counter()

    if column in COMMA_SEPARATED_FIELDS:
        values_seen = set()
        for record in datasets:
            for token in split_comma_values(record.get(column)):
                values_seen.add(token)
        for value in sorted(values_seen):
            counts[value] = sum(
                1
                for record in datasets
                if record.get(column)
                and value in split_comma_values(record[column])
            )
    else:
        values_seen = {
            str(record[column])
            for record in datasets
            if record.get(column) not in (None, "")
        }
        for value in sorted(values_seen):
            counts[value] = sum(
                1 for record in datasets if record.get(column) == value
            )

    return counts


def print_header(title):
    print()
    print("=" * 60)
    print(title)
    print("=" * 60)


def print_counter(title, counts, indent=2):
    pad = " " * indent
    print(f"{pad}{title}")
    if not counts:
        print(f"{pad}  (none)")
        return
    for key, count in counts.most_common():
        print(f"{pad}  {key}: {count}")


def main():
    parser = argparse.ArgumentParser(
        description="Verify frontend-visible dataset/project counts from redcap_data.json"
    )
    parser.add_argument(
        "--json-path",
        type=Path,
        default=DEFAULT_JSON,
        help=f"Path to catalogue JSON (default: {DEFAULT_JSON})",
    )
    parser.add_argument(
        "--filter",
        type=str,
        default="",
        help='Optional JSON filter, e.g. \'{"d_status":"Incomplete"}\'',
    )
    args = parser.parse_args()

    json_path = args.json_path.resolve()
    if not json_path.is_file():
        print(f"Error: JSON file not found: {json_path}", file=sys.stderr)
        return 1

    with json_path.open(encoding="utf-8") as f:
        raw = json.load(f)

    if not isinstance(raw, dict) or "datasets" not in raw or "projects" not in raw:
        print("Error: JSON must contain 'projects' and 'datasets' arrays", file=sys.stderr)
        return 1

    filters = {}
    if args.filter:
        filters = json.loads(args.filter)
        if not isinstance(filters, dict):
            print("Error: --filter must be a JSON object", file=sys.stderr)
            return 1

    data = build_frontend_data(raw)
    datasets = data["datasets"]
    projects = data["projects"]
    filtered_datasets = apply_list_filters(datasets, filters)

    print_header("FRONTEND DATA VERIFICATION")
    print(f"JSON file: {json_path}")
    print(f"Filter:    {filters or '(none — default datasets list)'}")

    print_header("RAW JSON vs FRONTEND (createDataProvider.ts)")
    print(f"  Raw datasets in JSON:              {data['raw_dataset_count']}")
    print(f"  Excluded (d_catalogue_ready != Yes): {len(data['excluded_datasets'])}")
    print(f"  Frontend datasets (catalog-ready):   {len(datasets)}")
    print(f"  Frontend projects (all in JSON):     {len(projects)}")

    excluded_by_ready = Counter(
        d.get("d_catalogue_ready") or "(empty)" for d in data["excluded_datasets"]
    )
    print_counter("Excluded datasets by d_catalogue_ready:", excluded_by_ready)

    if filters:
        print_header("FILTERED LIST (getList total)")
        print(f"  Matching datasets: {len(filtered_datasets)}")

    print_header("DATASET SIDEBAR FILTER COUNTS (FieldValuesFilter)")
    for column in FILTER_SIDEBAR_COLUMNS:
        counts = sidebar_filter_counts(datasets, column)
        nonzero = {k: v for k, v in counts.items() if v > 0}
        print_counter(f"{column}:", Counter(nonzero))

    print_header("PROJECT dataset_count (catalog-ready datasets per record_id)")
    projects_with_data = sum(1 for p in projects if p.get("dataset_count", 0) > 0)
    projects_without_data = len(projects) - projects_with_data
    print(f"  Projects with at least 1 catalog-ready dataset: {projects_with_data}")
    print(f"  Projects with 0 catalog-ready datasets:       {projects_without_data}")

    print_header("SUMMARY — compare these to the live frontend")
    print(f"  Home page datasets count:  {len(datasets)}")
    print(f"  Home page projects count:  {len(projects)}")
    print(f"  Datasets list (no filter): {len(datasets)}")
    if filters:
        print(f"  Datasets list (with filter): {len(filtered_datasets)}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
