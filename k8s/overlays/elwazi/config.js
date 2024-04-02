window.config = {
    "ENVIRONMENT":"elwazi",
    "basename": "/catalogue/elwazi",
    "REST_ENDPOINT_URL": '/api/redcap_data.json',
    "SCHEMA_ENDPOINT_URL": 'https://raw.githubusercontent.com/ebi-ait/data-catalogue-frontend-elwazi/main/data/catalogue-schema.json',
    "RESOURCE_JSON_PATH": '',
    "GRID_CONFIG":  [
        {
            "name": "d_status",
        },
        {
            "name": "d_category",
        },
        {
            "name": "d_name"
        },
        {
            "name": "d_description"
        },
        {
            "name": "d_type"
        }
    ],
    FILTER_FIELDS: [
        {
            field: "d_category",
            type: "checkbox",
            data_type: "string"
        }
    ]
}
