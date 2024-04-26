import fakeDataProvider from "ra-data-fakerest";
import {fetchUtils} from "react-admin";
import {DC_API_DATA_PATH} from "./constants";
const httpClient = fetchUtils.fetchJson;

const apiUrl = DC_API_DATA_PATH;

const groupBy = (array, key) => array.reduce((acc, obj) => ((acc[obj[key]] = acc[obj[key]] || []).push(obj), acc), {});

export const createDataProvider = async () => {
    const url = `${apiUrl}`;
    const response = await httpClient(url, {method: 'GET'});
    const data = response.json
        .map((record, i) => ({id: i, ...record}));

    let groupedData = groupBy(data, 'redcap_event_name');

    return fakeDataProvider({
        datasets: groupedData['Dataset'],
        projects: groupedData['Project Info'],
    }, true);
};
