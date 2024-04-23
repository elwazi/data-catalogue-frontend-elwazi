import fakeDataProvider from "ra-data-fakerest";
import {fetchUtils} from "react-admin";
const httpClient = fetchUtils.fetchJson;
const apiUrl = import.meta.env.VITE_SIMPLE_REST_URL

const groupBy = (array, key) => array.reduce((acc, obj) => ((acc[obj[key]] = acc[obj[key]] || []).push(obj), acc), {});

export const createDataProvider = async () => {
    const url = `${apiUrl}`;
    const response = await httpClient(url, {method: 'GET'});
    const data = response.json
        .map((record, i) => ({id: i, ...record}));


    let groupedData = groupBy(data, 'redcap_event_name');

    return fakeDataProvider({datasets: groupedData['Dataset']}, true);
};
