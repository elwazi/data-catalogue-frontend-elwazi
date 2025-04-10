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
    useListContext,
    useRecordContext,
    Pagination
} from "react-admin";
import CustomBulkActionButtons from './CustomBulkActionButtons'; // Adjust the path as necessary

// TODO this should come from a module because it would be shared by other catalogues
import {FieldValuesFilter} from './FieldValuesFilter';
import {Box, Card, CardContent, Divider, Grid, Theme, Typography, useMediaQuery, Button, Tooltip} from '@mui/material';
import React, { useState } from "react";
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

// Custom layout component that wraps the List and Charts
const CustomListLayout = ({ children, ...props }: any) => {
    const listContext = useListContext();
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <ListContextProvider value={listContext}>
                <DatasetListCharts />
            </ListContextProvider>
            <div>
                {children}
            </div>
        </div>
    );
};

// Component to render charts below the datagrid
const DatasetListCharts = () => {
    const { filterValues } = useListContext();
    
    return (
        <Box mb={4} sx={{ marginLeft: '16px', marginRight: '16px' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'black', fontWeight: 'bold' }}>
                Dataset Analytics {Object.keys(filterValues).length > 0 ? 'for filtered datasets' : 'for all datasets'}
            </Typography>
            <DatasetCharts filter={filterValues} />
            <Divider sx={{ my: 2, backgroundColor: '#c13f27', opacity: 0.3 }} />
        </Box>
    );
};

// Custom component for DAC Email with button
const DacEmailButton = () => {
    const record = useRecordContext();
    const [showDetails, setShowDetails] = useState(false);

    if (!record) return null;

    const getAccessRequestContent = () => {
        if (record.dac_url && record.dac_url.trim() !== '') {
            return (
                <a 
                    href={record.dac_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#3f51b5', textDecoration: 'underline' }}
                >
                    Access Request Portal
                </a>
            );
        } else if (record.dac_email && record.dac_email.trim() !== '') {
            return <span>{record.dac_email}</span>;
        } else {
            return (
                <a 
                    href="https://helpdesk.elwazi.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#3f51b5', textDecoration: 'underline' }}
                >
                    Contact the Helpdesk
                </a>
            );
        }
    };

    return (
        <div>
            {!showDetails ? (
                <Button 
                    variant="contained" 
                    size="small" 
                    onClick={() => setShowDetails(true)}
                    style={{ backgroundColor: '#c13f27', color: 'white' }}
                >
                    Go
                </Button>
            ) : (
                getAccessRequestContent()
            )}
        </div>
    );
};

// Custom component for project acronym with tooltip showing full title
const ProjectAcronymWithTooltip = () => {
    const record = useRecordContext();
    
    if (!record) return null;
    
    return (
        <Tooltip 
            title={
                <Typography style={{ fontSize: '14px', padding: '8px 4px' }}>
                    {record.p_title || "No title available"}
                </Typography>
            } 
            arrow 
            placement="top"
            componentsProps={{
                tooltip: {
                    sx: {
                        maxWidth: 350,
                        backgroundColor: '#f5f5f5',
                        color: '#333',
                        border: '1px solid #ddd',
                        boxShadow: '0px 2px 8px rgba(0,0,0,0.15)'
                    }
                }
            }}
        >
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                {record.p_accronym}
            </span>
        </Tooltip>
    );
};

// Define props interface for DatasetList
interface DatasetListProps {
    filter?: Record<string, any>;
    [key: string]: any;
}

export const DatasetList = (props: DatasetListProps) => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

    return (
        <List {...props}
            bulkActionButtons={<CustomBulkActionButtons />}
            actions={<ListActions/>}
            aside={<FilterSidebar/>}
            filter={props.filter}
            exporter={exporter}
            component={CustomListLayout}
            perPage={50}
            pagination={<Pagination rowsPerPageOptions={[10, 25, 50, 100]} />}
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
                            link="show"
                        >
                            <ProjectAcronymWithTooltip />
                        </ReferenceField>
                        <TextField source="d_name"/>
                        <CommaField source="d_category"/>
                        <TextField source="d_type"/>
                        <CommaField source="d_countries" />
                        <NumberField source="sample_size"/>
                        <ReferenceField source="record_id"
                            reference="projects"
                            label="Access Request"
                        >
                            <DacEmailButton />
                        </ReferenceField>
                        <CommaField source="data_use_permission"/>
                    </DatagridConfigurable>
                )
            }
        </List>
    );
};

export const GenomicList = () => DatasetList({filter:{d_category:'Genomic'}})
