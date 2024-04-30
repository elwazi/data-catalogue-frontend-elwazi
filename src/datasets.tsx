import {Datagrid, DatagridConfigurable, List, SelectColumnsButton, TextField, TopToolbar} from "react-admin";

// TODO this should come from a module becuase it would be shared by other catalogues
import {FieldValuesFilter} from './FieldValuesFilter';
import {Card, CardContent} from '@mui/material';
import {FilterLiveSearch, SavedQueriesList, TextInput} from "react-admin";
import React from "react";

const FilterSidebar = () => (
    <Card sx={{ order: -1}}>
        <CardContent>
            <SavedQueriesList />
            <FilterLiveSearch />
            <FieldValuesFilter column="d_category"/>
            <FieldValuesFilter column="d_type"/>
            <FieldValuesFilter column="d_status"/>
            <FieldValuesFilter column="data_use_permission"/>
        </CardContent>
    </Card>
);
const ListActions = () => (
    <TopToolbar>
        <SelectColumnsButton />
    </TopToolbar>
);

const datasetFilters = [
    <TextInput label="Search" source="q"  />,
    <TextInput label="Name" source="d_name"  />,
];

export const DatasetList = () => {
    return (
        <List
            actions={<ListActions />}
            aside={<FilterSidebar/>}
        >
            <DatagridConfigurable>
                <TextField source="d_name"/>
                <TextField source="d_category"/>
                <TextField source="d_type"/>
                <TextField source="d_status"/>
                <TextField source="sample_size"/>
                <TextField source="data_use_permission"/>
            </DatagridConfigurable>
        </List>
    )
};
