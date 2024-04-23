import {Admin, Resource,} from "react-admin";
import {createDataProvider} from "./createDataProvider";
import React, {useEffect, useState} from "react";
import {DatasetList} from "./datasets";
import {ProjectsList} from "./projects";
import DatasetIcon from "@mui/icons-material/Dataset";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
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
            <Admin dataProvider={dataProvider} title="eLwazi">
                <Resource name="datasets" list={DatasetList} />
                <Resource name="projects" list={ProjectsList} icon={AccountTreeIcon}/>
            </Admin>
        )
        : (<div>Loading...</div>);
};
