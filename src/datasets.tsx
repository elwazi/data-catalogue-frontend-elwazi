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
import TuneIcon from '@mui/icons-material/Tune';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
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

const KNOWN_DOMAINS = ['Omics', 'Demographic & Health', 'Geospatial', 'Image/Video', 'Pathogen'];

/** Extract a single domain name from a filter value that may be a string or string[]. */
const getActiveDomain = (domainFilter: unknown): string | undefined => {
    if (typeof domainFilter === 'string' && KNOWN_DOMAINS.includes(domainFilter)) {
        return domainFilter;
    }
    if (Array.isArray(domainFilter) && domainFilter.length === 1
        && typeof domainFilter[0] === 'string'
        && KNOWN_DOMAINS.includes(domainFilter[0])) {
        return domainFilter[0];
    }
    return undefined;
};

/**
 * Read the list filter from the current location.
 * React Admin uses a hash router, so the query lives in the hash
 * (e.g. #/datasets?filter=...), not in window.location.search.
 */
const readFilterFromLocation = (): Record<string, any> | undefined => {
    const hash = window.location.hash || '';
    const hashQuery = hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : '';
    const query = hashQuery || (window.location.search || '').replace(/^\?/, '');
    if (!query) return undefined;

    const filterParam = new URLSearchParams(query).get('filter');
    if (!filterParam) return undefined;

    try {
        const parsed = JSON.parse(decodeURIComponent(filterParam));
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
            return parsed;
        }
    } catch (e) {
        console.error('Error parsing filter from URL:', e);
    }
    return undefined;
};

// Banner shown when a single domain is selected (e.g. via Home page cards)
const DatasetDomainBanner = () => {
    const { filterValues, total, isLoading } = useListContext();
    const domain = getActiveDomain(filterValues?.d_domain);

    if (!domain) return null;

    return (
        <Box
            sx={{
                backgroundColor: '#FFF3E0',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                marginLeft: '16px',
                marginRight: '16px',
                marginTop: '16px',
                marginBottom: '8px',
                padding: '16px',
                borderRadius: '4px',
            }}
        >
            <Typography
                variant="h5"
                sx={{ color: '#c13f27', fontWeight: 'bold', mb: 0.5 }}
            >
                {domain} Datasets
            </Typography>
            {!isLoading && typeof total === 'number' && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {total} {total === 1 ? 'dataset' : 'datasets'} available.
                </Typography>
            )}
        </Box>
    );
};

// A single sidebar filter: the record column and its display label
type SidebarFilter = { column: string; label: string };

// Per-domain sidebar filter sets. Keys must match the d_domain values exactly.
// When a domain page is active, its unique columns replace the default sidebar.
const DOMAIN_SIDEBAR_FILTERS: Record<string, SidebarFilter[]> = {
    'Omics': [
        { column: 'd_countries', label: 'Countries' },
        { column: 'd_provenance', label: 'Provenance' },
        { column: 'du_permission', label: 'Data Use Permission' },
        { column: 'p_consort_network', label: 'Consortium / Network' },
        { column: 'p_acronym', label: 'Project' },
        { column: 'd_status', label: 'Status' },
        { column: 'du_licensing', label: 'License' },
        { column: 'du_modifier', label: 'Data User Modifier' },
        { column: 'd_subjects', label: 'Sample Size' },
        { column: 'o_subject', label: 'Organism' },
        { column: 'o_type', label: 'Omics Type' },
        { column: 'o_epigenomics_approach', label: 'Epigenomics Approach' },
        { column: 'o_genomic_approach', label: 'Genomics Approach' },
        { column: 'o_metabolomics_approach', label: 'Metabolomics Approach' },
        { column: 'o_metagenomics_approach', label: 'Metagenomics Approach' },
    ],
    'Demographic & Health': [
        { column: 'd_countries', label: 'Countries' },
        { column: 'd_provenance', label: 'Provenance' },
        { column: 'du_permission', label: 'Data Use Permission' },
        { column: 'p_consort_network', label: 'Consortium / Network' },
        { column: 'p_acronym', label: 'Project' },
        { column: 'd_status', label: 'Status' },
        { column: 'du_licensing', label: 'License' },
        { column: 'du_modifier', label: 'Data User Modifier' },
        { column: 'd_subjects', label: 'Sample Size' },
        { column: 'dh_demographics', label: 'Demographics' },
        { column: 'dh_anthropometrics', label: 'Anthropometrics' },
        { column: 'dh_vitals', label: 'Vitals' },
        { column: 'dh_disease_status', label: 'Disease Status' },
        { column: 'dh_general_medical', label: 'General Medical History' },
        { column: 'dh_labs', label: 'Laboratory Tests' },
    ],
    'Geospatial': [
        { column: 'd_countries', label: 'Countries' },
        { column: 'd_provenance', label: 'Provenance' },
        { column: 'du_permission', label: 'Data Use Permission' },
        { column: 'p_consort_network', label: 'Consortium / Network' },
        { column: 'p_acronym', label: 'Project' },
        { column: 'd_status', label: 'Status' },
        { column: 'du_licensing', label: 'License' },
        { column: 'du_modifier', label: 'Data User Modifier' },
        { column: 'g_var_domain', label: 'Variable Domain' },
        { column: 'g_var_of_interest', label: 'Variable/s of Interest' },
        { column: 'g_spatial_domain', label: 'Spatial Domain' },
        { column: 'g_time_domain', label: 'Time Domain' },
        { column: 'g_temp_resolution', label: 'Temporal Resolution' },
        { column: 'g_product_type', label: 'Product Type' },
        { column: 'g_model_type', label: 'Model Type' },
        { column: 'g_spatial_resolution', label: 'Spatial Type' },
        { column: 'g_monitor_station', label: 'Monitoring Station Type' },
        { column: 'g_collection_type', label: 'Collection Type' },
        { column: 'g_collect_method', label: 'Collection Method' },
    ],
    'Image/Video': [
        { column: 'd_countries', label: 'Countries' },
        { column: 'd_provenance', label: 'Provenance' },
        { column: 'du_permission', label: 'Data Use Permission' },
        { column: 'p_consort_network', label: 'Consortium / Network' },
        { column: 'p_acronym', label: 'Project' },
        { column: 'd_status', label: 'Status' },
        { column: 'du_licensing', label: 'License' },
        { column: 'du_modifier', label: 'Data User Modifier' },
        { column: 'i_organism', label: 'Organism' },
        { column: 'i_method', label: 'Imaging Method' },
        { column: 'i_method_medical', label: 'Medical Imaging Method' },
        { column: 'i_type', label: 'Image Type' },
        { column: 'i_organ_system', label: 'Organ System' },
        { column: 'd_subjects', label: 'Sample Size' },
    ],
    'Pathogen': [
        { column: 'd_countries', label: 'Countries' },
        { column: 'd_provenance', label: 'Provenance' },
        { column: 'du_permission', label: 'Data Use Permission' },
        { column: 'p_consort_network', label: 'Consortium / Network' },
        { column: 'p_acronym', label: 'Project' },
        { column: 'd_status', label: 'Status' },
        { column: 'du_licensing', label: 'License' },
        { column: 'du_modifier', label: 'Data User Modifier' },
        { column: 'p_target_host', label: 'Target Host' },
        { column: 'p_microorganism', label: 'Microorganism Type' },
        { column: 'p_taxa', label: 'Taxonomic Lineage' },
        { column: 'p_detect_method', label: 'Detection Methods' },
        { column: 'p_phenotype', label: 'Pathogen Phenotypes' },
    ],
};

interface FilterSidebarProps {
    // Optional override; when omitted the sidebar auto-detects from the active d_domain filter
    filters?: SidebarFilter[];
    // Optional override; when omitted scoped from the active d_domain filter
    baseFilter?: Record<string, any>;
}

const FilterSidebar = ({ filters, baseFilter }: FilterSidebarProps) => {
    // Prefer live filterValues from React Admin (synced from the hash URL).
    // Falls back to explicit props when provided (e.g. GenomicList).
    const { filterValues } = useListContext();
    const activeDomain = getActiveDomain(filterValues?.d_domain);
    const resolvedFilters = filters ?? (activeDomain ? DOMAIN_SIDEBAR_FILTERS[activeDomain] : undefined);
    const resolvedBaseFilter = baseFilter
        ?? (resolvedFilters && activeDomain ? { d_domain: activeDomain } : undefined);

    return (
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
            {resolvedFilters ? (
                resolvedFilters.map((f) => (
                    <FieldValuesFilter
                        key={f.column}
                        column={f.column}
                        label={f.label}
                        baseFilter={resolvedBaseFilter}
                    />
                ))
            ) : (
                <>
                    <FieldValuesFilter column="d_domain"/>
                    <FieldValuesFilter column="d_countries"/>
                    <FieldValuesFilter column="redcap_data_access_group"/>
                    <FieldValuesFilter column="d_provenance"/>
                    <FieldValuesFilter column="d_status"/>
                    <FieldValuesFilter column="du_permission"/>
                    <FieldValuesFilter column="dh_disease_status"/>
                </>
            )}
            {/* Spacer to push content to top and fill remaining space */}
            <Box sx={{ flex: 1, minHeight: '20px' }} />
        </CardContent>
    </Card>
    );
};

const selectColumnsButtonSx = {
    backgroundColor: '#c13f27',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '0.95rem',
    textTransform: 'none' as const,
    borderRadius: '8px',
    px: 2.25,
    py: 1,
    boxShadow: 'none',
    '&:hover': {
        backgroundColor: '#a0351f',
        boxShadow: 'none',
    },
    '& .MuiButton-startIcon': {
        marginRight: 1,
        '& > svg': { fontSize: '1.35rem' },
    },
    '& .MuiButton-endIcon': {
        marginLeft: 1,
        '& > svg': { fontSize: '1.35rem' },
    },
};

const ListActions = () => (
    <>
        <DatasetDomainBanner />
        <TopToolbar>
            <SelectColumnsButton
                {...({
                    variant: 'contained',
                    size: 'medium',
                    startIcon: <TuneIcon />,
                    endIcon: <KeyboardArrowDownIcon />,
                    sx: selectColumnsButtonSx,
                } as object)}
            />
        </TopToolbar>
    </>
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
    // Subscribe to location so the page title/sidebar recompute when the hash filter changes
    const location = useLocation();

    // Read filter from the hash URL (React Admin hash router) or from props
    const urlFilter = readFilterFromLocation();
    const finalFilter = urlFilter || props.filter;

    // Show a domain-specific title (e.g. "Omics Datasets") when a single domain filter is active
    const activeDomain = getActiveDomain(finalFilter?.d_domain);
    const pageTitle = activeDomain ? `${activeDomain} Datasets` : 'Datasets';

    return (
        <Box sx={{ width: '100%' }} key={location.key}>
            <PageHeader title={pageTitle} />
        <List {...props}
            sx={{ width: '100%' }}
            bulkActionButtons={<CustomBulkActionButtons />}
            actions={<ListActions/>}
            aside={<FilterSidebar />}
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
