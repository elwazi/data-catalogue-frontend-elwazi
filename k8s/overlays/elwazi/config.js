window.appConfig = {
    "ENVIRONMENT":"elwazi",
    "basename": "/catalogue/elwazi",
    "REST_ENDPOINT_URL": '/catalogue/elwazi/redcap_data.json',
    "SCHEMA_ENDPOINT_URL": '/catalogue/elwazi/schema_endpoint.json',
    "RESOURCE_JSON_PATH": '',
    "GRID_CONFIG":  [
        {
            "name": "p_title"
        },
        {
            "name": "d_status",
        },
        {
            "name": "d_category"
        },
        {
            "name": "d_name"
        },
        {
            "name": "d_type"
        },
        {
            "name": "sample_size"
        },
        {
            "name": "data_use_permission"
        }
    ],
    FILTER_FIELDS: [
        {
            field: "d_category",
            type: "checkbox",
            data_type: "string"
        },
        {
            field: "d_status",
            type: "checkbox",
            data_type: "string"
        },
        {
            field: "p_title",
            type: "checkbox",
            data_type: "string"
        },
        {
            field: "d_type",
            type: "checkbox",
            data_type: "string"
        },
        {
            field: "data_use_permission",
            type: "checkbox",
            data_type: "string"
        }
    ]
}
