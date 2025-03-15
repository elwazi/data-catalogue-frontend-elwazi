import {
    DatagridConfigurable,
    FilterLiveSearch,
    List,
    SavedQueriesList,
    SelectColumnsButton,
    TextField,
    TopToolbar,
    downloadCSV,
    ListContextProvider,
    useListContext
} from "react-admin";
import CustomBulkActionButtons from './CustomBulkActionButtons'; // Adjust the path as necessary

// TODO this should come from a module because it would be shared by other catalogues
import {FieldValuesFilter} from './FieldValuesFilter';
import {Box, Card, CardContent, Divider, Grid, Theme, Typography, useMediaQuery} from '@mui/material';
import React from "react";
import CommaField from './CommaField'; // Adjust the path accordingly
import DatasetCharts from './DatasetCharts';

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
            <FieldValuesFilter column="dh_clinical"/>
        </CardContent>
    </Card>
);

const ListActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
        <ExportButton label="Export" exporter={exporter} />
    </TopToolbar>
);

// Component to render charts below the datagrid
const DatasetListCharts = () => {
    const { filterValues } = useListContext();
    
    return (
        <Box mt={4} sx={{ marginLeft: '16px', marginRight: '16px' }}>
            <Divider sx={{ my: 2, backgroundColor: '#c13f27', opacity: 0.3 }} />
            <Typography variant="h6" gutterBottom sx={{ color: 'black', fontWeight: 'bold' }}>
                Dataset Analytics {Object.keys(filterValues).length > 0 ? 'for filtered datasets' : 'for all datasets'}
            </Typography>
            <DatasetCharts filter={filterValues} />
        </Box>
    );
};

// Custom layout component that wraps the List and Charts
const CustomListLayout = ({ children, ...props }: any) => {
    const listContext = useListContext();
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
                {children}
            </div>
            <ListContextProvider value={listContext}>
                <DatasetListCharts />
            </ListContextProvider>
        </div>
    );
};

export const DatasetList = (props: any) => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

    return (
        <List {...props}
            bulkActionButtons={<CustomBulkActionButtons />}
            actions={<ListActions/>}
            aside={<FilterSidebar/>}
            filter={props.filter}
            exporter={exporter}
            component={CustomListLayout}
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
