import {Admin, Resource, Loading, DataProvider} from "react-admin";
import {createDataProvider} from "./createDataProvider";
import {BrowserRouter} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import {DatasetList, GenomicList} from "./datasets";
import {DC_BASENAME, DC_GA_MEASUREMENT_ID, DC_TITLE} from "./constants";
import {theme} from "./theme";
import {i18nProvider} from "./i18nProvider";
import ReactGA from "react-ga4";
import ElwaziLogo from "./elwaziLogo";
import {MyLayout} from "./MyLayout";
import {ProjectsList} from "./projects";
import {CustomRoutes} from "ra-core";
import { Route } from 'react-router-dom';
import About from './About';

function enableAnalytics() {
    ReactGA.initialize(DC_GA_MEASUREMENT_ID);
}
const DummyTitle = () => (<div>hellow title</div>);
export const App = () => {
    const [dataProvider, setDataProvider] = useState<DataProvider | null>(null);

    useEffect(() => {
        enableAnalytics(); // Initialize Google Analytics when the component mounts
        const fetchDataProvider = async () => {
            const _dataProvider = await createDataProvider();
            setDataProvider(_dataProvider);
        }
        document.body.style.zoom = "85%";
        fetchDataProvider();
        // Clear all localStorage to ensure fresh column settings
        localStorage.clear();
        
        // Clear specific React Admin keys that might override defaultVisible
        localStorage.removeItem("RaStore.preferences.datasets.datagrid.availableColumns");
        localStorage.removeItem("RaStore.preferences.datasets.datagrid.columns");
        localStorage.removeItem("RaStore.preferences.datasets.datagrid.hiddenColumns");
        localStorage.removeItem("RaStore.preferences.datasets.datagrid.columnVisibilityModel");
        localStorage.removeItem("RaStore.datasets.listParams");
        localStorage.removeItem("RaStore.preferences.datasets");
        
        // Clear any cached datagrid preferences
        Object.keys(localStorage).forEach(key => {
            if (key.includes('datasets') && key.includes('datagrid')) {
                localStorage.removeItem(key);
            }
        });
    }, []);

    return dataProvider
        ? (
            <div>
                    <Admin dataProvider={dataProvider}
                           theme={theme}
                           title={DC_TITLE}
                           layout={MyLayout}
                           i18nProvider={i18nProvider}
                           basename={DC_BASENAME}
                           disableTelemetry
                    >
                        <Resource name="datasets" list={<DatasetList/>} />
                        <Resource name="projects" list={ProjectsList}/>
                        <CustomRoutes>
                            <Route path="/about" element={<About />} />
                        </CustomRoutes>
                    </Admin>
            </div>
        )
        : (<div>Loading...</div>);
};
