import fakeDataProvider from "ra-data-fakerest";
import {fetchUtils} from "react-admin";
import {DC_API_DATA_PATH} from "./constants";
const httpClient = fetchUtils.fetchJson;

const apiUrl = DC_API_DATA_PATH;

const groupBy = (array, key) => array.reduce((acc, obj) => ((acc[obj[key]] = acc[obj[key]] || []).push(obj), acc), {});

export const createDataProvider = async () => {
    const url = `${apiUrl}`;
    const response = await httpClient(url, {method: 'GET'});

    let data = {
        datasets: response.json.datasets.map((record, i) => ({
            id: i,
            ...record
        })),
        projects: response.json.projects.map((record, i) => ({
            id: record.record_id,
            ...record,
            p_keywords: record.p_keywords
                .split(/[,;]/)
                .map(i=>i.trim())
                .map(i=>({name:i}))
        })),
    };
    return fakeDataProvider(data, true);
};