import {Admin, Resource,Loading} from "react-admin";
import {createDataProvider} from "./createDataProvider";
import {BrowserRouter} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import {DatasetList} from "./datasets";
import {DC_BASENAME, DC_GA_MEASUREMENT_ID, DC_TITLE} from "./constants";
import {theme} from "./theme";
import {i18nProvider} from "./i18nProvider";
import ReactGA from "react-ga4";
import ElwaziLogo from "./elwaziLogo";
import Dashboard from "./Dashboard";
import {MyLayout} from "./MyLayout";


function enableAnalytics() {
    ReactGA.initialize(DC_GA_MEASUREMENT_ID);
}
const DummyTitle = () => (<div>hellow title</div>);
export const App = () => {
    const [dataProvider, setDataProvider] = useState(null);

    useEffect(() => {
        const fetchDataProvider = async () => {
            const _dataProvider = await createDataProvider();
            setDataProvider(_dataProvider);
        }
        fetchDataProvider();
    }, []);

    return dataProvider
        ? (
            <div>
                    <Admin dataProvider={dataProvider}
                           theme={theme}
                           title={DC_TITLE}
                           // dashboard={Dashboard}
                           layout={MyLayout}
                           i18nProvider={i18nProvider}
                           basename={DC_BASENAME}
                    >
                        <Resource name="datasets" list={DatasetList}/>
                        {/*<Resource name="projects" list={ProjectsList} icon={AccountTreeIcon}/>*/}
                    </Admin>
                {/*<CookieConsent enableDeclineButton*/}
                {/*    onAccept={enableAnalytics}*/}
                {/*    cookieName="dcAnalyticsConsent">*/}
                {/*    This website uses cookies to enhance the user experience.*/}
                {/*</CookieConsent>*/}
            </div>
        )
        : (<div>Loading...</div>);
};
