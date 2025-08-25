import fakeDataProvider from "ra-data-fakerest";
import {DataProvider, GetListParams, GetListResult, fetchUtils} from "react-admin";
import {DC_API_DATA_PATH} from "./constants";
const httpClient = fetchUtils.fetchJson;

const apiUrl = DC_API_DATA_PATH;

// Helper function to group array items by a key
const groupBy = <T extends Record<string, any>>(array: T[], key: string): { [key: string]: T[] } => 
  array.reduce((acc: { [key: string]: T[] }, obj: T) => {
    (acc[obj[key]] = acc[obj[key]] || []).push(obj);
    return acc;
  }, {});

// Fields that contain comma-separated values
const commaSeparatedFields = ['d_domain', 'd_countries', 'du_permission', 'dh_disease_status'];

// Interface for record types
interface DataRecord {
  [key: string]: any;
}

// Custom data provider that handles comma-separated fields
const addCommaSeparatedFieldsHandling = (dataProvider: DataProvider): DataProvider => {
    const enhancedDataProvider: DataProvider = {
        ...dataProvider,
        getList: (resource: string, params: GetListParams): Promise<GetListResult> => {
            const { filter, pagination } = params;
            
            // Extract comma-separated field filters
            const commaSeparatedFilters: DataRecord = {};
            const regularFilters: DataRecord = { ...filter };
            
            // Process each comma-separated field
            commaSeparatedFields.forEach(field => {
                if (filter && field in filter) {
                    commaSeparatedFilters[field] = filter[field];
                    delete regularFilters[field];
                }
            });
            
            // Get ALL data first (no pagination at this level)
            return dataProvider.getList(resource, {
                ...params,
                filter: regularFilters,
                pagination: { page: 1, perPage: 1000 } // Get all data
            }).then((result: GetListResult) => {
                // Apply comma-separated filtering on the client side
                let filteredData = result.data;
                
                // Apply each comma-separated filter
                Object.entries(commaSeparatedFilters).forEach(([field, values]) => {
                    if (Array.isArray(values)) {
                        // For array of values, check if ANY value is in the comma-separated field
                        filteredData = filteredData.filter((record: DataRecord) => {
                            if (!record[field]) return false;
                            const recordValues = record[field].split(',').map((v: string) => v.trim());
                            // At least one of the filter values must match
                            return values.some((filterValue: string) => recordValues.includes(filterValue));
                        });
                    } else if (typeof values === 'string') {
                        // For a single value, check if it exists in the comma-separated field
                        filteredData = filteredData.filter((record: DataRecord) => {
                            if (!record[field]) return false;
                            const recordValues = record[field].split(',').map((v: string) => v.trim());
                            return recordValues.includes(values);
                        });
                    }
                });
                
                // Calculate total count after filtering
                const totalCount = filteredData.length;
                
                // Apply pagination to the filtered data
                const { page = 1, perPage = 25 } = pagination || {};
                const startIndex = (page - 1) * perPage;
                const endIndex = startIndex + perPage;
                const paginatedData = filteredData.slice(startIndex, endIndex);
                
                return {
                    data: paginatedData,
                    total: totalCount
                };
            });
        }
    };
    
    return enhancedDataProvider;
};

export const createDataProvider = async (): Promise<DataProvider> => {
    const url = `${apiUrl}`;
    const response = await httpClient(url, {method: 'GET'});

    let data = {
        datasets: response.json.datasets.map((record: DataRecord, i: number) => ({
            id: i,
            ...record
        })),
        projects: response.json.projects.map((record: DataRecord, i: number) => ({
            id: record.record_id,
            ...record,
            p_keywords: record.p_keywords
                .split(/[,;]/)
                .map((i: string) => i.trim())
                .map((i: string) => ({name: i}))
        })),
    };
    
    // Create the base data provider and enhance it with comma-separated fields handling
    const baseDataProvider = fakeDataProvider(data, true);
    return addCommaSeparatedFieldsHandling(baseDataProvider);
};