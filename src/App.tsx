import {Admin, Resource,} from "react-admin";
import {createDataProvider} from "./createDataProvider";
import React, {useEffect, useState} from "react";
import {DatasetList} from "./datasets";
import {ProjectsList} from "./projects";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import {DC_BASENAME, DC_GA_MEASUREMENT_ID, DC_TITLE} from "./constants";
import {theme} from "./theme";
import CookieConsent from "react-cookie-consent";
import {i18nProvider} from "./i18nProvider";
import ReactGA from "react-ga4";


function enableAnalytics() {
    ReactGA.initialize(DC_GA_MEASUREMENT_ID);
}

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
                       title={DC_TITLE}
                       theme={theme}
                       i18nProvider={i18nProvider}
                       basename={DC_BASENAME}
                >
                    <Resource name="datasets" list={DatasetList}/>
                    <Resource name="projects" list={ProjectsList} icon={AccountTreeIcon}/>
                </Admin>
                <CookieConsent enableDeclineButton
                    onAccept={enableAnalytics}
                    cookieName="dcAnalyticsConsent">
                    This website uses cookies to enhance the user experience.
                </CookieConsent>
            </div>
        )
        : (<div>Loading...</div>);
};
