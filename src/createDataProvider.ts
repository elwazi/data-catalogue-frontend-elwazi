import fakeDataProvider from "ra-data-fakerest";
import {fetchUtils} from "react-admin";
import {API_DATA_PATH} from "./constants";
const httpClient = fetchUtils.fetchJson;

function buildApiUrl() {
    const baseUriNoTrailingSlash = document.baseURI.endsWith('/')?document.baseURI.slice(0, -1):document.baseURI;
    const apiUrl = (API_DATA_PATH.startsWith('http') ? '': baseUriNoTrailingSlash) + API_DATA_PATH;
    return apiUrl;
}

const apiUrl = buildApiUrl();

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
