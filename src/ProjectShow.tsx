import {
    Show,
    SimpleShowLayout,
    useRecordContext,
    useDataProvider,
    TopToolbar,
} from "react-admin";
import {
    Box,
    Typography,
    Link,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    Paper,
} from '@mui/material';
import {
    OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Breadcrumb component
const ProjectBreadcrumb = () => {
    const record = useRecordContext();
    const navigate = useNavigate();
    
    if (!record) return null;
    
    return (
        <Box sx={{ mb: 2, backgroundColor: '#ffffff', p: 2, borderRadius: '4px' }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/')}
                    sx={{
                        color: '#333',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        '&:hover': { color: '#c13f27' }
                    }}
                >
                    Home
                </Link>
                <span>/</span>
                <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/projects')}
                    sx={{
                        color: '#c13f27',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        '&:hover': { color: '#a0351f' }
                    }}
                >
                    Projects
                </Link>
                <span>/</span>
                <Typography component="span" variant="body2" sx={{ color: '#333' }}>
                    {record.p_acronym || record.p_title || 'Project'}
                </Typography>
            </Typography>
        </Box>
    );
};

// Project Header
const ProjectHeader = () => {
    const record = useRecordContext();
    
    if (!record) return null;
    
    return (
        <Box sx={{ mb: 3, backgroundColor: '#ffffff', p: 3, borderRadius: '4px' }}>
            <Typography
                variant="h3"
                sx={{
                    color: '#c13f27',
                    fontWeight: 'bold',
                    fontSize: '2.5rem',
                    mb: 1,
                }}
            >
                {record.p_acronym || record.p_title || 'Untitled Project'}
            </Typography>
            {record.p_title && record.p_acronym && (
                <Typography
                    variant="h6"
                    sx={{
                        color: '#333',
                        fontWeight: 'normal',
                        fontSize: '1.1rem',
                    }}
                >
                    {record.p_title}
                </Typography>
            )}
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
            marginTop: '16px',
            fontSize: '1.3rem',
        }}
    >
        {children}
    </Typography>
);

// Overview Section
const OverviewSection = () => {
    const record = useRecordContext();
    
    if (!record) return null;
    
    const description = record.p_description || 'No description available.';
    
    return (
        <Box sx={{ mb: 3 }}>
            <SectionHeading>Overview</SectionHeading>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>
                {description}
            </Typography>
        </Box>
    );
};

// Datasets Table Component
const DatasetsTable = () => {
    const record = useRecordContext();
    const dataProvider = useDataProvider();
    const navigate = useNavigate();
    const [datasets, setDatasets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchDatasets = async () => {
            if (!record?.p_acronym) {
                setLoading(false);
                return;
            }
            
            try {
                const result = await dataProvider.getList('datasets', {
                    pagination: { page: 1, perPage: 100 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: { p_acronym: record.p_acronym },
                });
                setDatasets(result.data || []);
            } catch (error) {
                console.error('Error fetching datasets:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchDatasets();
    }, [record, dataProvider]);
    
    if (loading) {
        return <Typography variant="body2" color="text.secondary">Loading datasets...</Typography>;
    }
    
    if (datasets.length === 0) {
        return <Typography variant="body2" color="text.secondary">No datasets found for this project.</Typography>;
    }
    
    // Helper to get domain chip color
    const getDomainColor = (domain: string) => {
        const domainColors: { [key: string]: string } = {
            'Omics': '#4caf50',
            'Geospatial': '#4caf50',
            'Demographic & Health': '#4caf50',
            'Image/Video': '#4caf50',
        };
        return domainColors[domain] || '#4caf50';
    };
    
    return (
        <Box sx={{ backgroundColor: '#ffffff', borderRadius: '4px', overflow: 'hidden' }}>
            <Table size="small" sx={{ backgroundColor: '#ffffff' }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#ffffff' }}>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333', backgroundColor: '#ffffff' }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333', backgroundColor: '#ffffff' }}>Domain</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333', backgroundColor: '#ffffff' }}>Provenance</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333', backgroundColor: '#ffffff' }}>Countries</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {datasets.map((dataset: any) => (
                        <TableRow key={dataset.id} hover sx={{ backgroundColor: '#ffffff' }}>
                            <TableCell sx={{ backgroundColor: '#ffffff' }}>
                                <Link
                                    component="button"
                                    onClick={() => navigate(`/datasets/${dataset.id}/show`)}
                                    sx={{
                                        color: '#c13f27',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        '&:hover': { textDecoration: 'underline' }
                                    }}
                                >
                                    {dataset.d_name || 'Untitled Dataset'}
                                </Link>
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#ffffff' }}>
                                {dataset.d_domain && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Chip
                                            label={dataset.d_domain}
                                            size="small"
                                            sx={{
                                                backgroundColor: getDomainColor(dataset.d_domain),
                                                color: '#fff',
                                                fontSize: '0.75rem',
                                            }}
                                        />
                                    </Box>
                                )}
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#ffffff' }}>
                                {dataset.d_provenance || 'N/A'}
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#ffffff' }}>
                                {dataset.d_countries || 'N/A'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};

// Additional Information Section with Tabs
const AdditionalInformationSection = () => {
    const record = useRecordContext();
    const [tabValue, setTabValue] = useState(0);
    const dataProvider = useDataProvider();
    const [datasetCount, setDatasetCount] = useState<number>(0);
    
    useEffect(() => {
        const fetchDatasetCount = async () => {
            if (!record?.p_acronym) return;
            
            try {
                const result = await dataProvider.getList('datasets', {
                    pagination: { page: 1, perPage: 1 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: { p_acronym: record.p_acronym },
                });
                setDatasetCount(result.total || 0);
            } catch (error) {
                console.error('Error fetching dataset count:', error);
            }
        };
        
        fetchDatasetCount();
    }, [record, dataProvider]);
    
    if (!record) return null;
    
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
    
    // Count publications (placeholder - adjust based on actual data structure)
    const publicationCount = record.p_publications?.length || 0;
    
    return (
        <Box sx={{ mt: 3 }}>
            <SectionHeading>Catalogue Contributions</SectionHeading>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    sx={{
                        '& .MuiTab-root': {
                            color: '#c13f27',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: '1rem',
                        },
                        '& .Mui-selected': {
                            color: '#c13f27 !important',
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#c13f27',
                        },
                    }}
                >
                    <Tab label={`Datasets (${datasetCount})`} />
                    <Tab label={`Publications (${publicationCount})`} />
                </Tabs>
            </Box>
            <Box sx={{ mt: 2 }}>
                {tabValue === 0 && <DatasetsTable />}
                {tabValue === 1 && (
                    <Typography variant="body2" color="text.secondary">
                        No publications available.
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

// Sidebar component
const ProjectSidebar = () => {
    const record = useRecordContext();
    const dataProvider = useDataProvider();
    const [similarProjects, setSimilarProjects] = useState<any[]>([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchSimilarProjects = async () => {
            if (!record) return;
            
            try {
                const result = await dataProvider.getList('projects', {
                    pagination: { page: 1, perPage: 5 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: {},
                });
                // Filter out current project and take first 3
                const filtered = (result.data || [])
                    .filter((p: any) => p.id !== record.id)
                    .slice(0, 3);
                setSimilarProjects(filtered);
            } catch (error) {
                console.error('Error fetching similar projects:', error);
            }
        };
        
        fetchSimilarProjects();
    }, [record, dataProvider]);
    
    if (!record) return null;
    
    // Parse keywords
    const keywords = record.p_keywords 
        ? (typeof record.p_keywords === 'string' 
            ? record.p_keywords.split(/[,;]/).map((k: string) => k.trim()).filter(Boolean)
            : Array.isArray(record.p_keywords) 
                ? record.p_keywords.map((k: any) => typeof k === 'string' ? k : k.name)
                : [])
        : [];
    
    return (
        <Paper 
            elevation={1} 
            sx={{ 
                p: 3, 
                backgroundColor: '#FFF8E1',
                borderRadius: '8px',
            }}
        >
            {/* Funding Section */}
            {record.p_funding && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#c13f27', fontWeight: 'bold', mb: 1 }}>
                        Funding
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.6 }}>
                        The research is supported by the Fogarty International Center, the National Institute of Environmental Health Sciences (NIEHS),{' '}
                        <Link 
                            href="https://dsi-africa.org/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            sx={{ color: '#c13f27' }}
                        >
                            the Data Science for Health Discovery and Innovation in Africa (DS-I Africa)
                        </Link>
                        {' '}and the Office of Strategic Coordination (OSC) of the National Institutes of Health under Award Number {record.p_funding}. The content is solely the responsibility of the authors and does not necessarily represent the official views of the National Institutes of Health.
                    </Typography>
                    <Box sx={{ borderBottom: '1px solid #e0e0e0', mt: 2 }} />
                </Box>
            )}
            
            {/* Website Section */}
            {record.p_website && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#c13f27', fontWeight: 'bold', mb: 1 }}>
                        Website
                    </Typography>
                    <Link
                        href={record.p_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: '#333',
                            textDecoration: 'underline',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            '&:hover': { color: '#c13f27' }
                        }}
                    >
                        {record.p_website}
                    </Link>
                    <Box sx={{ borderBottom: '1px solid #e0e0e0', mt: 2 }} />
                </Box>
            )}
            
            {/* Tags Section */}
            {keywords.length > 0 && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#c13f27', fontWeight: 'bold', mb: 1 }}>
                        Tags
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {keywords.map((keyword: string, idx: number) => (
                            <Chip
                                key={idx}
                                label={keyword}
                                size="small"
                                sx={{
                                    backgroundColor: '#333',
                                    color: '#fff',
                                    fontSize: '0.75rem',
                                    '&:hover': { backgroundColor: '#555' }
                                }}
                            />
                        ))}
                    </Box>
                    <Box sx={{ borderBottom: '1px solid #e0e0e0', mt: 2 }} />
                </Box>
            )}
            
            {/* Similar Projects Section */}
            {similarProjects.length > 0 && (
                <Box>
                    <Typography variant="h6" sx={{ color: '#c13f27', fontWeight: 'bold', mb: 1 }}>
                        Similar Projects
                    </Typography>
                    {similarProjects.map((project: any) => (
                        <Typography
                            key={project.id}
                            component="div"
                            sx={{ mb: 1 }}
                        >
                            <Link
                                component="button"
                                onClick={() => navigate(`/projects/${project.id}/show`)}
                                sx={{
                                    color: '#333',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    '&:hover': { color: '#c13f27', textDecoration: 'underline' }
                                }}
                            >
                                {project.p_acronym || project.p_title}
                            </Link>
                        </Typography>
                    ))}
                    <Box sx={{ borderBottom: '1px solid #c13f27', mt: 2 }} />
                </Box>
            )}
        </Paper>
    );
};

// Main Project Show Layout
const ProjectShowLayout = () => {
    return (
        <Box sx={{ backgroundColor: '#FFF8E1', minHeight: '100vh', py: 3, px: 4 }}>
            <ProjectBreadcrumb />
            <ProjectHeader />
            
            <Box sx={{ display: 'flex', gap: 4, mt: 3 }}>
                {/* Main Content */}
                <Box sx={{ flex: 2 }}>
                    <Paper elevation={0} sx={{ backgroundColor: '#ffffff', p: 3, mb: 3, borderRadius: '4px' }}>
                        <OverviewSection />
                    </Paper>
                    <Paper elevation={0} sx={{ backgroundColor: '#ffffff', p: 3, borderRadius: '4px' }}>
                        <AdditionalInformationSection />
                    </Paper>
                </Box>
                
                {/* Sidebar */}
                <Box sx={{ flex: 1, minWidth: '300px', maxWidth: '400px' }}>
                    <ProjectSidebar />
                </Box>
            </Box>
        </Box>
    );
};

// Empty actions toolbar
const ShowActions = () => (
    <TopToolbar>
        {/* No actions */}
    </TopToolbar>
);

// Main ProjectShow component
export const ProjectShow = () => {
    return (
        <Show actions={<ShowActions />}>
            <SimpleShowLayout>
                <ProjectShowLayout />
            </SimpleShowLayout>
        </Show>
    );
};

export default ProjectShow;
