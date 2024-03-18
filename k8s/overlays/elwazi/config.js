window.config = {
    "ENVIRONMENT":"elwazi",
    "REST_ENDPOINT_URL": 'https://raw.githubusercontent.com/ebi-ait/data-catalogue-frontend/main/data/cohort_data.json',
    "SCHEMA_ENDPOINT_URL": 'https://raw.githubusercontent.com/ebi-ait/data-catalogue-frontend/main/data/cohort_schema.json',
    "RESOURCE_JSON_PATH": '',
    "GRID_CONFIG":  [
        {
            "name": "cohort_name",
        },
        {
            "name": "website",
        },
        {
            "name": "countries"
        },
        {
            "name": "available_data_types.demographic"
        },
        {
            "name": "demographic",
            "valueGetter": params => params.data.available_data_types.demographic.text
        }
    ]
}
