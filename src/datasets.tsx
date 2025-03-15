import {
    DatagridConfigurable,
    FilterLiveSearch,
    List,
    SavedQueriesList,
    SelectColumnsButton,
    TextField,
    TopToolbar,
    downloadCSV
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

// Define the type for our dataset record
interface DatasetRecord {
    redcap_data_access_group?: string;
    d_name?: string;
    d_category?: string;
    d_type?: string;
    d_countries?: string;
    sample_size?: number | string;
    data_use_permission?: string;
    [key: string]: any; // For other properties that might exist
}

// Custom exporter function to only export specific fields
const exporter = (data: any[]) => {
    // Extract only the fields we want to export
    const exportableData = data.map((record: any) => {
        const exportRecord: DatasetRecord = {
            redcap_data_access_group: record.redcap_data_access_group || '',
            d_name: record.d_name || '',
            d_category: record.d_category || '',
            d_type: record.d_type || '',
            d_countries: record.d_countries || '',
            sample_size: record.sample_size || '',
            data_use_permission: record.data_use_permission || ''
        };
        return exportRecord;
    });
    
    // Convert to CSV
    const headers = [
        'redcap_data_access_group', 
        'd_name', 
        'd_category', 
        'd_type', 
        'd_countries', 
        'sample_size', 
        'data_use_permission'
    ];
    
    // Create CSV content
    const csvContent = [
        headers.join(','), // CSV header row
        ...exportableData.map(record => 
            headers.map(header => {
                const value = record[header as keyof DatasetRecord];
                // Escape values that contain commas by wrapping in quotes
                return typeof value === 'string' && value.includes(',') 
                    ? `"${value}"` 
                    : value;
            }).join(',')
        )
    ].join('\n');
    
    // Download the CSV
    downloadCSV(csvContent, 'datasets');
};

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
        <ExportButton label="Export" exporter={exporter} />
    </TopToolbar>
);

export const DatasetList = (props: any) => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

    return (
        <List {...props}
            bulkActionButtons={<CustomBulkActionButtons />}
            actions={<ListActions/>}
            aside={<FilterSidebar/>}
            filter={props.filter}
            exporter={exporter}
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
                        <ReferenceField source="record_id"
                            reference="projects"
                        >
                            <TextField source="p_accronym" />
                        </ReferenceField>
                        <TextField source="d_name"/>
                        <CommaField source="d_category"/>
                        <TextField source="d_type"/>
                        <CommaField source="d_countries" />
                        <NumberField source="sample_size"/>
                        <CommaField source="data_use_permission"/>
                    </DatagridConfigurable>
                )
            }
        </List>
    );
};

export const GenomicList = () => DatasetList({filter:{d_category:'Genomic'}})
