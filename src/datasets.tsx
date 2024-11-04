import {
    DatagridConfigurable,
    FilterLiveSearch,
    List,
    SavedQueriesList,
    SelectColumnsButton,
    TextField,
    TopToolbar
} from "react-admin";
import CustomBulkActionButtons from './CustomBulkActionButtons'; // Adjust the path as necessary

// TODO this should come from a module because it would be shared by other catalogues
import {FieldValuesFilter} from './FieldValuesFilter';
import {Card, CardContent, Theme, useMediaQuery} from '@mui/material';
import React from "react";
import CommaField from './CommaField'; // Adjust the path accordingly

import {
    ArrayField,
    ChipField,
    ExportButton,
    NumberField,
    ReferenceField,
    SimpleList,
    SingleFieldList
} from "ra-ui-materialui";

const FilterSidebar = () => (
    <Card sx={{order: -1}}>
        <CardContent>
            <FilterLiveSearch/>
            <FieldValuesFilter column="d_category"/>
            <FieldValuesFilter column="d_countries"/>
            <FieldValuesFilter column="redcap_data_access_group"/>
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

export const DatasetList = (props) => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

    return (
        <List {...props}
            bulkActionButtons={<CustomBulkActionButtons />}
            actions={<ListActions/>}
            aside={<FilterSidebar/>}
            filter={props.filter}
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
                        <CommaField source="d_category"/>
                        <TextField source="d_type"/>
                        <CommaField source="d_countries" />
                        <NumberField source="sample_size"/>
                        <ReferenceField source="record_id"
                                        reference="projects"
                        >
                            <TextField source="p_accronym" />
                        </ReferenceField>
                        <CommaField source="data_use_permission"/>
                    </DatagridConfigurable>
                )
            }
        </List>
    );
};

export const GenomicList = () => DatasetList({filter:{d_category:'Genomic'}})
