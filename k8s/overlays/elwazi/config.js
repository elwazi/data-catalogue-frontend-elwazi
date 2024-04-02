window.appConfig = {
    "ENVIRONMENT":"elwazi",
    "basename": "/catalogue/elwazi",
    "REST_ENDPOINT_URL": '/catalogue/elwazi/redcap_data.json',
    "SCHEMA_ENDPOINT_URL": '/catalogue/elwazi/schema_endpoint.json',
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
