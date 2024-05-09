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

export const DatasetList = (props) => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

    return (
        <List
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
                        <TextField source="d_category"/>
                        <TextField source="d_type"/>
                        <NumberField source="sample_size"/>
                        <ArrayField source="d_countries">
                            <SingleFieldList linkType={false}>
                                <ChipField source="name" size="small" />
                            </SingleFieldList>
                        </ArrayField>
                        <ReferenceField source="record_id"
                                        reference="projects"
                                        link={"list"}
                        >
                            <TextField source="p_accronym" />
                        </ReferenceField>
                        <TextField source="data_use_permission"/>
                    </DatagridConfigurable>
                )
            }
        </List>
    );
};

export const GenomicList = () => DatasetList({filter:{d_category:'Genomic'}})
