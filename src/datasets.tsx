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

// TODO this should come from a module because it would be shared by other catalogs
import {FieldValuesFilter} from './FieldValuesFilter';
import {Box, Card, CardContent, Divider, Grid, Theme, Typography, useMediaQuery, Button, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';
import React, { useState } from "react";
import CommaField from './CommaField'; // Adjust the path accordingly
import DatasetCharts from './DatasetCharts';
import PageHeader from './PageHeader';
import { trackAccessPathwayGet } from './analytics';

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
    d_domain?: string;
    d_provenance?: string;
    d_countries?: string;
    d_subjects?: number | string;
    du_permission?: string;
    [key: string]: any; // For other properties that might exist
}

// Custom exporter function to only export specific fields
const exporter = (data: any[]) => {
    // Extract only the fields we want to export
    const exportableData = data.map((record: any) => {
        const exportRecord: DatasetRecord = {
            redcap_data_access_group: record.redcap_data_access_group || '',
            d_name: record.d_name || '',
            d_domain: record.d_domain || '',
            d_provenance: record.d_provenance || '',
            d_countries: record.d_countries || '',
            d_subjects: record.d_subjects || '',
            du_permission: record.du_permission || ''
        };
        return exportRecord;
    });
    
    // Convert to CSV
    const headers = [
        'redcap_data_access_group', 
        'd_name', 
        'd_domain', 
        'd_provenance', 
        'd_countries', 
        'sample_size', 
        'du_permission'
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
    <Card sx={{
        order: -1,
        position: 'sticky',
        top: '64px', // Adjust based on your app bar height
        minHeight: 'calc(100vh - 80px)', // Extend to full viewport minus app bar
        height: 'auto',
        overflowY: 'auto',
        minWidth: '280px',
        maxWidth: '320px',
        zIndex: 1000,
        marginRight: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
        <CardContent sx={{ 
            padding: '16px !important',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Typography variant="h6" sx={{ marginBottom: '16px', color: '#c13f27', fontWeight: 'bold' }}>
                Filters
            </Typography>
            <FilterLiveSearch/>
            <FieldValuesFilter column="d_domain"/>
            <FieldValuesFilter column="d_countries"/>
            <FieldValuesFilter column="redcap_data_access_group"/>
            <FieldValuesFilter column="d_provenance"/>
            <FieldValuesFilter column="d_status"/>
            <FieldValuesFilter column="du_permission"/>
            <FieldValuesFilter column="dh_disease_status"/>
            {/* Spacer to push content to top and fill remaining space */}
            <Box sx={{ flex: 1, minHeight: '20px' }} />
        </CardContent>
    </Card>
);

const ListActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
    </TopToolbar>
);

// Custom layout component that wraps the List and Charts
const CustomListLayout = ({ children, ...props }: any) => {
    const listContext = useListContext();
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', flex: 1 }}>
            <ListContextProvider value={listContext}>
                <DatasetAnalyticsTitle />
            </ListContextProvider>
            <div style={{ 
                flex: '1', 
                overflow: 'auto',
                maxHeight: 'calc(100vh - 220px)', // Adjusted to account for pagination space
                minHeight: '600px' // Increased minimum height for better table visibility
            }}>
                {children}
            </div>
            <ListContextProvider value={listContext}>
                <PaginationInWhitespace />
            </ListContextProvider>
            <ListContextProvider value={listContext}>
                <DatasetChartsOnly />
            </ListContextProvider>
        </div>
    );
};

// Component to render only the analytics title at the top
const DatasetAnalyticsTitle = () => {
    const { filterValues } = useListContext();
    
    return (
        <Box sx={{ marginLeft: '16px', marginRight: '16px', marginTop: '16px', marginBottom: '8px' }}>

        </Box>
    );
};

// Component to render only the charts at the bottom
const DatasetChartsOnly = () => {
    const { filterValues } = useListContext();
    
    return (
        <Box mb={4} mt={4} sx={{ marginLeft: '16px', marginRight: '16px' }}>
            <DatasetCharts filter={filterValues} />
            <Divider sx={{ my: 2, backgroundColor: '#c13f27', opacity: 0.3 }} />
        </Box>
    );
};

// Component to render pagination in the whitespace between table and charts
const PaginationInWhitespace = () => {
    return (
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: '16px',
            marginLeft: '16px', 
            marginRight: '16px',
            backgroundColor: '#fcc300',
            borderRadius: '4px',
            marginTop: '8px',
            marginBottom: '8px'
        }}>
            <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />
        </Box>
    );
};

const HELPDESK_URL = 'https://helpdesk.elwazi.org/';

const isExternalHttpUrl = (url: string): boolean => {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
};

/** External access URL using the same priority as the access pathway, excluding email-only paths. */
const getExternalAccessUrl = (record: DatasetRecord): string | null => {
    if (record.dap_repo_url?.trim()) {
        const url = record.dap_repo_url.trim();
        if (isExternalHttpUrl(url)) return url;
    }
    if (record.dap_url_email?.trim() || record.dap_primary_email?.trim()) {
        return null;
    }
    if (record.dap_other_contact_link?.trim()) {
        const url = record.dap_other_contact_link.trim();
        if (isExternalHttpUrl(url)) return url;
    }
    return HELPDESK_URL;
};

// Custom component for DAC Email with button
const DacEmailButton = () => {
    const record = useRecordContext();
    const [showDetails, setShowDetails] = useState(false);
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
    const [pendingExternalUrl, setPendingExternalUrl] = useState<string | null>(null);

    if (!record) return null;

    const trackGetClick = () => {
        trackAccessPathwayGet({
            dataset_id: String(record.id ?? ""),
            dataset_name: String(record.d_name ?? ""),
            project_acronym: String(record.p_acronym ?? ""),
        });
    };

    const handleGetClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        trackGetClick();

        const externalUrl = getExternalAccessUrl(record);
        if (externalUrl) {
            setPendingExternalUrl(externalUrl);
            setLeaveDialogOpen(true);
            return;
        }

        setShowDetails(true);
    };

    const handleLeaveConfirm = () => {
        if (pendingExternalUrl) {
            window.open(pendingExternalUrl, '_blank', 'noopener,noreferrer');
        }
        setLeaveDialogOpen(false);
        setPendingExternalUrl(null);
    };

    const handleLeaveCancel = () => {
        setLeaveDialogOpen(false);
        setPendingExternalUrl(null);
    };

    const getAccessRequestContent = () => {
        // Check dap_url_email second (email-only paths; URLs handled via Get + dialog)
        if (record.dap_url_email && record.dap_url_email.trim() !== '') {
            return <span>{record.dap_url_email}</span>;
        }
        if (record.dap_primary_email && record.dap_primary_email.trim() !== '') {
            return <span>{record.dap_primary_email}</span>;
        }
        return null;
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            {!showDetails ? (
                <Button
                    variant="contained"
                    size="small"
                    onClick={handleGetClick}
                    style={{ backgroundColor: '#c13f27', color: 'white' }}
                >
                    Get
                </Button>
            ) : (
                getAccessRequestContent()
            )}

            <Dialog open={leaveDialogOpen} onClose={handleLeaveCancel}>
                <DialogTitle sx={{ color: '#c13f27', fontWeight: 'bold' }}>
                    Leaving the eLwazi catalog
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You are now leaving the eLwazi catalog. You will be redirected to the
                        host to request your data access.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleLeaveCancel} color="inherit">
                        Stay in catalog
                    </Button>
                    <Button
                        onClick={handleLeaveConfirm}
                        variant="contained"
                        sx={{ backgroundColor: '#c13f27', '&:hover': { backgroundColor: '#a0351f' } }}
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

// Custom field component that wraps DacEmailButton with proper label
export const AccessRequestField = () => <DacEmailButton />;
AccessRequestField.defaultProps = { label: 'Access Pathway' };

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
                {record.p_acronym}
            </span>
        </Tooltip>
    );
};

// Add proper label for the ProjectAcronymWithTooltip component
const ProjectField = () => <ProjectAcronymWithTooltip />;
ProjectField.defaultProps = { label: 'Project' };

// Define props interface for DatasetList
interface DatasetListProps {
    filter?: Record<string, any>;
    [key: string]: any;
}

export const DatasetList = (props: DatasetListProps) => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    
    // Read filter from URL query parameters if available
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    let urlFilter = undefined;
    
    // Only apply URL filter if filter param exists and is not empty
    if (filterParam) {
        try {
            const parsed = JSON.parse(decodeURIComponent(filterParam));
            // Check if parsed filter is non-empty
            if (parsed && Object.keys(parsed).length > 0) {
                urlFilter = parsed;
            }
        } catch (e) {
            console.error('Error parsing filter from URL:', e);
        }
    }
    
    // Use URL filter if available, otherwise use props.filter, otherwise show all (undefined)
    const finalFilter = urlFilter || props.filter;

    return (
        <Box sx={{ width: '100%' }}>
            <PageHeader title="Datasets" />
        <List {...props}
            sx={{ width: '100%' }}
            bulkActionButtons={<CustomBulkActionButtons />}
            actions={<ListActions/>}
            aside={<FilterSidebar/>}
                filter={finalFilter}
            exporter={exporter}
            component={CustomListLayout}
            perPage={100}
            pagination={false}
            sort={{ field: 'access_priority', order: 'ASC' }}
        >
            {
                isSmall ? (
                    <SimpleList
                        primaryText={(record) => record.d_name}
                        secondaryText={(record) => record.d_domain}
                        tertiaryText={(record) => record.d_status}
                            linkType="show"
                    />
                ) : (
                        <DatagridConfigurable omit={['d_provenance']} rowClick="show">
                        <ProjectField />
                        <TextField source="d_name"/>
                        <CommaField source="d_domain"/>
                        <TextField source="d_provenance"/>
                        <CommaField source="d_countries" />
                        <NumberField source="d_subjects"/>
                        <AccessRequestField />
                        <CommaField source="du_permission"/>
                    </DatagridConfigurable>
                )
            }
        </List>
        </Box>
    );
};

export const GenomicList = () => DatasetList({filter:{d_domain:'Genomic'}})
