import {
    DatagridConfigurable,
    FilterLiveSearch,
    List,
    SavedQueriesList,
    SelectColumnsButton,
    TextField,
    TopToolbar
} from "react-admin";

// TODO this should come from a module because it would be shared by other catalogues
import {FieldValuesFilter} from './FieldValuesFilter';
import {Card, CardContent, Theme, useMediaQuery} from '@mui/material';
import React from "react";
import {ExportButton, SimpleList} from "ra-ui-materialui";

const FilterSidebar = () => (
    <Card sx={{order: -1}}>
        <CardContent>
            <SavedQueriesList/>
            <FilterLiveSearch/>
            <FieldValuesFilter column="d_category"/>
            <FieldValuesFilter column="d_type"/>
            <FieldValuesFilter column="d_status"/>
            <FieldValuesFilter column="data_use_permission"/>
        </CardContent>
    </Card>
);
const ListActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
        <ExportButton/>
    </TopToolbar>
);

export const DatasetList = () => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

    return (
        <List
            actions={<ListActions/>}
            aside={<FilterSidebar/>}
        >
            {
                isSmall ? (
                    <SimpleList
                        primaryText={(record) => record.d_name}
                        secondaryText={(record) => record.d_category}
                        tertiaryText={(record) => record.d_status}
                    />
                ) : (
                    <DatagridConfigurable>
                        <TextField source="d_name"/>
                        <TextField source="d_category"/>
                        <TextField source="d_type"/>
                        <TextField source="d_status"/>
                        <TextField source="sample_size"/>
                        <TextField source="data_use_permission"/>
                    </DatagridConfigurable>
                )
            }
        </List>
    );
};
