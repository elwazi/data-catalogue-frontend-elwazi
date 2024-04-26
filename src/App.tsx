import {Admin, Resource,} from "react-admin";
import {createDataProvider} from "./createDataProvider";
import React, {useEffect, useState} from "react";
import {DatasetList} from "./datasets";
import {ProjectsList} from "./projects";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import {DC_TITLE} from "./constants";
import {theme} from "./theme";
import CookieConsent from "react-cookie-consent";


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
                >
                    <Resource name="datasets" list={DatasetList}/>
                    <Resource name="projects" list={ProjectsList} icon={AccountTreeIcon}/>
                </Admin>
                <CookieConsent enableDeclineButton>
                    This website uses cookies to enhance the user experience.
                </CookieConsent>
            </div>

        )
        : (<div>Loading...</div>);
};
