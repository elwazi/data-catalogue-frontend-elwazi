import {
    Show,
    SimpleShowLayout,
    TextField,
    NumberField,
    DateField,
    useRecordContext,
    useShowContext,
    TopToolbar,
} from "react-admin";
import {
    Box,
    Divider,
    Grid,
    Typography,
    List,
    ListItem,
    ListItemText,
    Link,
    Chip,
} from '@mui/material';
import {
    Download as DownloadIcon,
    OpenInNew as OpenInNewIcon,
    Email as EmailIcon,
    Article as ArticleIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    HelpOutline as HelpOutlineIcon,
} from '@mui/icons-material';
import CommaField from './CommaField';
import ReadMoreTextField from './ReadMoreTextField';
import PageHeader from './PageHeader';
import React, { useState } from 'react';

// Red banner header component
const DatasetHeaderBanner = () => {
    const record = useRecordContext();
    
    if (!record) return null;
    
    return (
        <Box
            sx={{
                backgroundColor: '#c13f27',
                color: 'white',
                padding: '16px 24px',
                marginBottom: '24px',
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    color: 'white',
                    fontSize: '2rem',
                }}
            >
                {record.d_name || 'Untitled Dataset'}
            </Typography>
        </Box>
    );
};

// Section heading component
const SectionHeading = ({ children }: { children: React.ReactNode }) => (
    <Typography
        variant="h5"
        sx={{
            color: '#c13f27',
            fontWeight: 'bold',
            marginBottom: '12px',
            marginTop: '24px',
            fontSize: '1.5rem',
        }}
    >
        {children}
    </Typography>
);

// Description component that uses record context
const DescriptionSection = () => {
    const record = useRecordContext();
    
    // Debug logging
    React.useEffect(() => {
        console.log('=== DescriptionSection Debug ===');
        console.log('Record:', record);
        console.log('d_description:', record?.d_description);
        console.log('=======================');
    }, [record]);
    
    if (!record) {
        return (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Loading...
            </Typography>
        );
    }
    
    if (!record.d_description || typeof record.d_description !== 'string' || !record.d_description.trim()) {
        return (
            <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '1rem' }}>
                No description available
            </Typography>
        );
    }
    
    return (
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontSize: '1rem' }}>
            {record.d_description}
        </Typography>
    );
};

// Additional Information Section component that uses record context
const AdditionalInformationSection = () => {
    const record = useRecordContext();
    
    if (!record) {
        return <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>Loading...</Typography>;
    }
    
    return (
        <Box>
            {record.p_acronym ? (
                <InfoItem
                    label="Project"
                    value={<Typography variant="body1" sx={{ fontSize: '1rem' }}>{record.p_acronym}</Typography>}
                />
            ) : null}
            {record.d_provider ? (
                <InfoItem
                    label="Provider"
                    value={<Typography variant="body1" sx={{ fontSize: '1rem' }}>{record.d_provider}</Typography>}
                />
            ) : null}
            {record.d_provenance ? (
                <InfoItem
                    label="Provenance"
                    value={<ProvenanceField />}
                />
            ) : null}
            {record.d_exp_design ? (
                <InfoItem
                    label="Experiment Design"
                    value={<Typography variant="body1" sx={{ fontSize: '1rem' }}>{record.d_exp_design}</Typography>}
                />
            ) : null}
            {record.d_domain ? (
                <InfoItem
                    label="Data Domain"
                    value={<DomainChip />}
                />
            ) : null}
            {record.d_countries ? (
                <InfoItem
                    label="Country/ies"
                    value={<CommaField source="d_countries" />}
                />
            ) : null}
            {record.d_version ? (
                <InfoItem
                    label="Version"
                    value={<Typography variant="body1" sx={{ fontSize: '1rem' }}>{record.d_version}</Typography>}
                />
            ) : null}
            {record.d_status ? (
                <InfoItem
                    label="Status"
                    value={<Typography variant="body1" sx={{ fontSize: '1rem' }}>{record.d_status}</Typography>}
                />
            ) : null}
            {record.d_date_from ? (
                <InfoItem
                    label="Start Date"
                    value={<YearOrDateField source="d_date_from" />}
                />
            ) : null}
            {record.d_date_to ? (
                <InfoItem
                    label="End Date"
                    value={<YearOrDateField source="d_date_to" />}
                />
            ) : null}
        </Box>
    );
};

// Key-value pair component for Additional Information - Two column layout
const InfoItem = ({ label, value }: { label: string; value: React.ReactNode }) => {
    // Check if value is empty/null/undefined
    if (!value) {
        return null;
    }
    
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                mb: 1.5,
                alignItems: 'flex-start',
            }}
        >
            <Box
                sx={{
                    width: '40%',
                    minWidth: '150px',
                    pr: 2,
                }}
            >
                <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'text.primary', fontSize: '1rem' }}>
                    {label}:
                </Typography>
            </Box>
            <Box
                sx={{
                    width: '60%',
                    flex: 1,
                }}
            >
                {value}
            </Box>
        </Box>
    );
};

// Tags component using project keywords
const TagsSection = () => {
    const record = useRecordContext();
    
    if (!record || !record.p_keywords) {
        return null;
    }
    
    const keywords = Array.isArray(record.p_keywords)
        ? record.p_keywords.map((k: any) => (typeof k === 'string' ? k : k.name))
        : (typeof record.p_keywords === 'string' 
            ? record.p_keywords.split(/[;,\n]/).map((k: string) => k.trim()).filter(Boolean)
            : []);
    
    if (keywords.length === 0) {
        return null;
    }
    
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {keywords.map((keyword: string, index: number) => (
                <Chip
                    key={index}
                    label={keyword}
                    size="small"
                    sx={{
                        backgroundColor: '#4caf50',
                        color: 'white',
                        borderRadius: '16px',
                        fontWeight: 'medium',
                    }}
                />
            ))}
        </Box>
    );
};

// Data Use Conditions with View More
const DataUseConditionsSection = () => {
    const record = useRecordContext();
    const [expanded, setExpanded] = useState(false);
    
    if (!record || !record.du_permission) {
        return null;
    }
    
    const conditions = typeof record.du_permission === 'string'
        ? record.du_permission.split(',').map((c: string) => c.trim()).filter(Boolean)
        : [];
    
    if (conditions.length === 0) {
        return null;
    }
    
    const displayedConditions = expanded ? conditions : conditions.slice(0, 3);
    const hasMore = conditions.length > 3;
    
    return (
        <Box>
            <List dense>
                {displayedConditions.map((condition: string, index: number) => (
                    <ListItem key={index} sx={{ paddingLeft: 0, paddingRight: 0 }}>
                        <ListItemText
                            primary={condition}
                            primaryTypographyProps={{ variant: 'body1', sx: { fontSize: '1rem' } }}
                        />
                    </ListItem>
                ))}
            </List>
            {hasMore && (
                <Link
                    component="button"
                    variant="body1"
                    onClick={() => setExpanded(!expanded)}
                    sx={{
                        color: '#c13f27',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        marginTop: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontSize: '1rem',
                        '&:hover': {
                            textDecoration: 'underline',
                        },
                    }}
                >
                    {expanded ? (
                        <>
                            View Less <ExpandLessIcon sx={{ fontSize: 16, ml: 0.5 }} />
                        </>
                    ) : (
                        <>
                            View More <ExpandMoreIcon sx={{ fontSize: 16, ml: 0.5 }} />
                        </>
                    )}
                </Link>
            )}
        </Box>
    );
};

// Access Pathway links
const AccessPathwaySection = () => {
    const record = useRecordContext();
    
    if (!record) return null;
    
    const links = [];
    
    // Helpdesk link
    links.push({
        label: 'Contact the helpdesk',
        url: 'https://helpdesk.elwazi.org/',
        icon: <OpenInNewIcon sx={{ fontSize: 16 }} />,
    });
    
    // Email
    if (record.dap_url_email || record.dap_primary_email) {
        links.push({
            label: 'Email',
            url: `mailto:${record.dap_url_email || record.dap_primary_email}`,
            icon: <EmailIcon sx={{ fontSize: 16 }} />,
        });
    }
    
    // Publication DOI
    if (record.dap_pub_doi) {
        links.push({
            label: 'Publication',
            url: record.dap_pub_doi.startsWith('http') ? record.dap_pub_doi : `https://doi.org/${record.dap_pub_doi}`,
            icon: <ArticleIcon sx={{ fontSize: 16 }} />,
        });
    }
    
    // Repository URL
    if (record.dap_repo_url) {
        links.push({
            label: 'Repository',
            url: record.dap_repo_url,
            icon: <OpenInNewIcon sx={{ fontSize: 16 }} />,
        });
    }
    
    if (links.length === 0) {
        return null;
    }
    
    return (
        <List dense>
            {links.map((link, index) => (
                <ListItem key={index} sx={{ paddingLeft: 0, paddingRight: 0 }}>
                    <Link
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: '#1976d2',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        {link.icon}
                        <Typography variant="body1" sx={{ fontSize: '1rem' }}>{link.label}</Typography>
                    </Link>
                </ListItem>
            ))}
        </List>
    );
};

// Supporting Documentation
const SupportingDocumentationSection = () => {
    const record = useRecordContext();
    
    if (!record) return null;
    
    const documents = [];
    
    if (record.d_codebook) {
        documents.push({ label: 'Data Dictionary / Codebook', url: record.d_codebook });
    }
    if (record.d_consent) {
        documents.push({ label: 'Consent Form / Sharing Policy', url: record.d_consent });
    }
    if (record.d_crfs) {
        documents.push({ label: 'Case Report Form', url: record.d_crfs });
    }
    if (record.d_protocol_methods) {
        documents.push({ label: 'Protocol / Methods', url: record.d_protocol_methods });
    }
    if (record.d_doc_other) {
        documents.push({ label: 'Other Documentation', url: record.d_doc_other });
    }
    
    if (documents.length === 0) {
        return null;
    }
    
    return (
        <List dense>
            {documents.map((doc, index) => (
                <ListItem key={index} sx={{ paddingLeft: 0, paddingRight: 0 }}>
                    <Link
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: '#c13f27',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        <DownloadIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body1" sx={{ fontSize: '1rem' }}>{doc.label}</Typography>
                    </Link>
                </ListItem>
            ))}
        </List>
    );
};

// Domain as chip/tag
const DomainChip = () => {
    const record = useRecordContext();
    
    if (!record || !record.d_domain) {
        return null;
    }
    
    const domains = typeof record.d_domain === 'string'
        ? record.d_domain.split(',').map((d: string) => d.trim()).filter(Boolean)
        : [];
    
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {domains.map((domain: string, index: number) => (
                <Chip
                    key={index}
                    label={domain}
                    size="medium"
                    sx={{
                        backgroundColor: '#4caf50',
                        color: 'white',
                        borderRadius: '16px',
                        fontWeight: 'medium',
                        fontSize: '0.95rem',
                    }}
                />
            ))}
        </Box>
    );
};

// Provenance with help icon
const ProvenanceField = () => {
    const record = useRecordContext();
    
    if (!record || !record.d_provenance) {
        return null;
    }
    
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body1" sx={{ fontSize: '1rem' }}>{record.d_provenance}</Typography>
            <HelpOutlineIcon sx={{ fontSize: 14, color: '#c13f27' }} />
        </Box>
    );
};

// Date field that displays year only if it's just a year, otherwise full date
const YearOrDateField = ({ source }: { source: string }) => {
    const record = useRecordContext();
    
    if (!record || !record[source]) {
        return null;
    }
    
    const dateValue = record[source];
    
    // If it's just a year (4 digits), display as is
    if (typeof dateValue === 'string' && /^\d{4}$/.test(dateValue.trim())) {
        return <Typography variant="body1" sx={{ fontSize: '1rem' }}>{dateValue.trim()}</Typography>;
    }
    
    // Otherwise use DateField for proper date formatting
    return <DateField source={source} />;
};

const ShowActions = () => (
    <TopToolbar>
        {/* Edit button removed */}
    </TopToolbar>
);

export const DatasetShow = () => {
    const showContext = useShowContext();
    const record = useRecordContext();
    
    // Debug logging
    React.useEffect(() => {
        console.log('=== DatasetShow Debug ===');
        console.log('Show context:', showContext);
        console.log('Show context record:', showContext?.record);
        console.log('Show context isLoading:', showContext?.isLoading);
        console.log('Show context error:', showContext?.error);
        console.log('useRecordContext record:', record);
        console.log('Record ID:', record?.id || showContext?.record?.id);
        console.log('d_description value:', record?.d_description || showContext?.record?.d_description);
        console.log('d_description type:', typeof (record?.d_description || showContext?.record?.d_description));
        console.log('All keys in record:', record ? Object.keys(record) : (showContext?.record ? Object.keys(showContext.record) : 'No record'));
        console.log('Window location:', window.location.href);
        console.log('=======================');
    }, [record, showContext]);
    
    // Use record from showContext if useRecordContext doesn't have it
    const displayRecord = record || showContext?.record;
    
    // If still no record, show loading or error
    if (showContext?.isLoading) {
        return <div>Loading...</div>;
    }
    
    if (showContext?.error) {
        return <div>Error loading record: {String(showContext.error)}</div>;
    }
    
    return (
        <Box>
            <PageHeader title="Datasets" />
            <Show actions={<ShowActions />}>
                <SimpleShowLayout>
                    <DatasetHeaderBanner />
                    
                    <Grid container spacing={4}>
                        {/* Left Column - Main Content */}
                        <Grid item xs={12} md={8}>
                            {/* Description Section */}
                            <SectionHeading>Description</SectionHeading>
                            <Box sx={{ marginBottom: '24px' }}>
                                <DescriptionSection />
                            </Box>
                            
                            <Divider sx={{ my: 2, backgroundColor: '#c13f27', opacity: 0.3 }} />
                            
                            {/* Additional Information Section */}
                            <SectionHeading>Additional Information</SectionHeading>
                            <AdditionalInformationSection />
                        </Grid>
                        
                        {/* Right Column - Sidebar */}
                        <Grid item xs={12} md={4}>
                            {/* Data Use Conditions */}
                            <SectionHeading>Data Use Conditions</SectionHeading>
                            <DataUseConditionsSection />
                            
                            {/* Workspace */}
                            <SectionHeading>Workspace</SectionHeading>
                            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
                                {record?.d_workspace || 'N/A'}
                            </Typography>
                            
                            {/* Access Pathway */}
                            <SectionHeading>Access Pathway</SectionHeading>
                            <AccessPathwaySection />
                            
                            {/* Tags */}
                            <SectionHeading>Tags</SectionHeading>
                            <TagsSection />
                            
                            {/* Supporting Documentation */}
                            <SectionHeading>Supporting Documentation</SectionHeading>
                            <SupportingDocumentationSection />
                        </Grid>
                    </Grid>
                </SimpleShowLayout>
            </Show>
        </Box>
    );
};
