import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Link as MuiLink,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Chip,
    Divider,
    Card,
    CardContent,
    Container,
    Pagination,
    Select,
    MenuItem,
    FormControl,
    SelectChangeEvent,
} from '@mui/material';
import {
    Search as SearchIcon,
    Clear as ClearIcon,
    Storage as StorageIcon,
} from '@mui/icons-material';
import { useDataProvider } from 'react-admin';
import PageHeader from './PageHeader';

interface DatasetRecord {
    id: number;
    d_name?: string;
    d_description?: string;
    d_provenance?: string;
    d_countries?: string;
    d_subjects?: number | string;
    du_permission?: string;
    d_domain?: string;
    dap_repo_url?: string;
    dap_url_email?: string;
    dap_primary_email?: string;
    dap_other_contact_link?: string;
    dap_pub_doi?: string;
    [key: string]: any;
}

interface ProjectRecord {
    id: number | string;
    p_consort_network?: string;
    p_title?: string;
    p_description?: string;
    p_keywords?: any;
    [key: string]: any;
}

// Domain tag colors mapping
const getDomainColor = (domain: string): string => {
    const domainLower = domain.toLowerCase();
    if (domainLower.includes('omics')) return '#fcc300'; // Yellow
    if (domainLower.includes('demographic') || domainLower.includes('health')) return '#ffb3ba'; // Light red/pink
    if (domainLower.includes('geospatial')) return '#bae1ff'; // Light blue
    if (domainLower.includes('image') || domainLower.includes('video')) return '#c9c9ff'; // Light purple
    return '#e0e0e0'; // Default grey
};

// Access Path component
const AccessPathLinks = ({ record }: { record: DatasetRecord }) => {
    const navigate = useNavigate();
    const links = [];
    
    // Dataset Link (always show)
    links.push({
        label: 'Dataset Link',
        url: `/datasets/${record.id}/show`,
        isInternal: true,
    });
    
    // Email
    if (record.dap_url_email || record.dap_primary_email) {
        links.push({
            label: 'Email',
            url: `mailto:${record.dap_url_email || record.dap_primary_email}`,
            isInternal: false,
        });
    }
    
    // Publication
    if (record.dap_pub_doi) {
        const pubUrl = record.dap_pub_doi.startsWith('http') 
            ? record.dap_pub_doi 
            : `https://doi.org/${record.dap_pub_doi}`;
        links.push({
            label: 'Publication',
            url: pubUrl,
            isInternal: false,
        });
    }
    
    if (links.length === 0) return null;
    
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
            {links.map((link, index) => (
                <React.Fragment key={index}>
                    {link.isInternal ? (
                        <MuiLink
                            component="button"
                            onClick={() => navigate(link.url)}
                            sx={{
                                color: '#1976d2',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                border: 'none',
                                background: 'none',
                                padding: 0,
                                '&:hover': {
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            {link.label}
                        </MuiLink>
                    ) : (
                        <MuiLink
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                color: '#1976d2',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                '&:hover': {
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            {link.label}
                        </MuiLink>
                    )}
                    {index < links.length - 1 && (
                        <Typography component="span" sx={{ color: '#c13f27', mx: 0.5 }}>
                            /
                        </Typography>
                    )}
                </React.Fragment>
            ))}
        </Box>
    );
};

// Search Result Card Component
const SearchResultCard = ({ record }: { record: DatasetRecord }) => {
    const navigate = useNavigate();
    
    // Parse domain for tag display
    const domains = record.d_domain 
        ? (typeof record.d_domain === 'string' 
            ? record.d_domain.split(',').map(d => d.trim()).filter(Boolean)
            : [])
        : [];
    
    const primaryDomain = domains[0] || '';
    
    return (
        <Card
            sx={{
                mb: 3,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                borderRadius: '4px',
            }}
        >
            <CardContent sx={{ p: 3 }}>
                {/* Icon and Title */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <StorageIcon 
                        sx={{ 
                            color: '#8B4513', 
                            fontSize: 32, 
                            mr: 2, 
                            mt: 0.5 
                        }} 
                    />
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            color: 'text.primary',
                            fontSize: '1.25rem',
                            flex: 1,
                            cursor: 'pointer',
                            '&:hover': {
                                textDecoration: 'underline',
                                color: '#c13f27',
                            },
                        }}
                        onClick={() => navigate(`/datasets/${record.id}/show`)}
                    >
                        {record.d_name || 'Untitled Dataset'}
                    </Typography>
                </Box>
                
                {/* Description */}
                {record.d_description && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            mb: 2,
                            lineHeight: 1.6,
                            fontSize: '0.9375rem',
                        }}
                    >
                        {typeof record.d_description === 'string' && record.d_description.length > 300
                            ? `${record.d_description.substring(0, 300)}...`
                            : record.d_description}
                    </Typography>
                )}
                
                {/* Metadata */}
                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: '0.875rem',
                            color: 'text.secondary',
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        {record.d_provenance && (
                            <>
                                <Typography component="span" sx={{ color: '#c13f27', fontWeight: 'bold' }}>
                                    Provenance:
                                </Typography>
                                <Typography component="span"> {record.d_provenance}</Typography>
                                <Box
                                    component="span"
                                    sx={{
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '50%',
                                        backgroundColor: '#c13f27',
                                        display: 'inline-block',
                                        mx: 0.5,
                                    }}
                                />
                            </>
                        )}
                        {record.d_countries && (
                            <>
                                <Typography component="span" sx={{ color: '#c13f27', fontWeight: 'bold' }}>
                                    Countries:
                                </Typography>
                                <Typography component="span"> {record.d_countries}</Typography>
                                <Box
                                    component="span"
                                    sx={{
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '50%',
                                        backgroundColor: '#c13f27',
                                        display: 'inline-block',
                                        mx: 0.5,
                                    }}
                                />
                            </>
                        )}
                        {record.du_permission && (
                            <>
                                <Typography component="span" sx={{ color: '#c13f27', fontWeight: 'bold' }}>
                                    Permission:
                                </Typography>
                                <Typography component="span"> {record.du_permission.split(',')[0]}</Typography>
                                <Box
                                    component="span"
                                    sx={{
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '50%',
                                        backgroundColor: '#c13f27',
                                        display: 'inline-block',
                                        mx: 0.5,
                                    }}
                                />
                            </>
                        )}
                        {record.d_subjects && (
                            <>
                                <Typography component="span" sx={{ color: '#c13f27', fontWeight: 'bold' }}>
                                    N° subjects:
                                </Typography>
                                <Typography component="span">
                                    {' '}
                                    {typeof record.d_subjects === 'number' 
                                        ? record.d_subjects.toLocaleString() 
                                        : record.d_subjects}
                                </Typography>
                                <Box
                                    component="span"
                                    sx={{
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '50%',
                                        backgroundColor: '#c13f27',
                                        display: 'inline-block',
                                        mx: 0.5,
                                    }}
                                />
                            </>
                        )}
                        <Typography component="span" sx={{ color: '#c13f27', fontWeight: 'bold' }}>
                            Access Path:
                        </Typography>
                        <AccessPathLinks record={record} />
                    </Typography>
                </Box>
                
                {/* Domain Tag */}
                {primaryDomain && (
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography component="span" sx={{ color: '#c13f27', fontWeight: 'bold', fontSize: '0.875rem' }}>
                            Domain:
                        </Typography>
                        <Chip
                            label={primaryDomain}
                            size="small"
                            sx={{
                                backgroundColor: getDomainColor(primaryDomain),
                                color: '#000000',
                                fontWeight: 'medium',
                                fontSize: '0.8125rem',
                                height: '28px',
                            }}
                        />
                    </Box>
                )}
                
                {/* Dataset Button */}
                <Button
                    variant="contained"
                    onClick={() => navigate(`/datasets/${record.id}/show`)}
                    sx={{
                        backgroundColor: '#4caf50',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        px: 3,
                        '&:hover': {
                            backgroundColor: '#45a049',
                        },
                    }}
                >
                    Dataset
                </Button>
            </CardContent>
        </Card>
    );
};

// Helper to check if a dataset matches the search term (d_name, d_domain, d_description, d_countries)
const datasetMatchesSearch = (record: DatasetRecord, term: string): boolean => {
    if (!term.trim()) return false;
    const lower = term.toLowerCase();

    const fieldsToCheck: (keyof DatasetRecord)[] = [
        'd_name',
        'd_domain',
        'd_description',
        'd_countries',
    ];

    for (const field of fieldsToCheck) {
        const value = record[field];
        if (typeof value === 'string' && value.toLowerCase().includes(lower)) {
            return true;
        }
    }
    return false;
};

// Helper to check if a project matches the search term (p_consort_network, p_title, p_description, p_keywords)
const projectMatchesSearch = (record: ProjectRecord, term: string): boolean => {
    if (!term.trim()) return false;
    const lower = term.toLowerCase();

    const fieldsToCheck: (keyof ProjectRecord)[] = [
        'p_consort_network',
        'p_title',
        'p_description',
    ];

    for (const field of fieldsToCheck) {
        const value = record[field];
        if (typeof value === 'string' && value.toLowerCase().includes(lower)) {
            return true;
        }
    }

    // p_keywords may be an array of { name } or a comma-separated string
    const rawKeywords = record.p_keywords;
    if (Array.isArray(rawKeywords)) {
        const keywords = rawKeywords
            .map((k: any) => (typeof k === 'string' ? k : k?.name))
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
        if (keywords.includes(lower)) return true;
    } else if (typeof rawKeywords === 'string') {
        if (rawKeywords.toLowerCase().includes(lower)) return true;
    }

    return false;
};

// Search Results Content Component - custom search with client-side filtering
const SearchResultsContent = () => {
    const navigate = useNavigate();
    const dataProvider = useDataProvider();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [datasets, setDatasets] = useState<DatasetRecord[]>([]);
    const [projects, setProjects] = useState<ProjectRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // Fetch and filter datasets and projects when search term changes
    useEffect(() => {
        const urlQuery = searchParams.get('q') || '';
        setSearchQuery(urlQuery);
    }, [searchParams]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setDatasets([]);
            setProjects([]);
            return;
        }

        let isMounted = true;

        const doSearch = async () => {
            try {
                setLoading(true);
                const term = searchQuery.toLowerCase().trim();

                // Fetch all datasets and projects (no filter - we filter client-side)
                const [datasetsRes, projectsRes] = await Promise.all([
                    dataProvider.getList<DatasetRecord>('datasets', {
                        pagination: { page: 1, perPage: 10000 },
                        sort: { field: 'access_priority', order: 'ASC' },
                        filter: {},
                    }),
                    dataProvider.getList<ProjectRecord>('projects', {
                        pagination: { page: 1, perPage: 10000 },
                        sort: { field: 'id', order: 'ASC' },
                        filter: {},
                    }),
                ]);

                if (!isMounted) return;

                const filteredDatasets = datasetsRes.data.filter((r) =>
                    datasetMatchesSearch(r, term)
                );
                const filteredProjects = projectsRes.data.filter((r) =>
                    projectMatchesSearch(r, term)
                );

                setDatasets(filteredDatasets);
                setProjects(filteredProjects);
                setPage(1);
            } catch (e) {
                if (!isMounted) return;
                console.error('Search error:', e);
                setDatasets([]);
                setProjects([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        doSearch();
        return () => {
            isMounted = false;
        };
    }, [searchQuery, dataProvider]);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            setSearchParams({ q: searchQuery.trim() });
        } else {
            setSearchParams({});
        }
    };

    const handleClear = () => {
        setSearchQuery('');
        setSearchParams({});
        setDatasets([]);
        setProjects([]);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handlePerPageChange = (event: SelectChangeEvent<number>) => {
        setPerPage(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    // Paginate datasets
    const totalDatasets = datasets.length;
    const startIdx = (page - 1) * perPage;
    const paginatedDatasets = datasets.slice(startIdx, startIdx + perPage);

    const totalResults = totalDatasets + projects.length;

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Search Input */}
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search (e.g. project name, domain, country, keyword...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    variant="outlined"
                    sx={{
                        backgroundColor: '#f5f5f5',
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#f5f5f5',
                            '& fieldset': { borderColor: '#e0e0e0' },
                            '&:hover fieldset': { borderColor: '#c13f27' },
                            '&.Mui-focused fieldset': { borderColor: '#c13f27' },
                        },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {searchQuery && (
                                    <IconButton onClick={handleClear} edge="end" sx={{ mr: 1 }}>
                                        <ClearIcon />
                                    </IconButton>
                                )}
                                <IconButton onClick={handleSearch} edge="end" sx={{ color: '#c13f27' }}>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {!searchQuery.trim() ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        Enter a search term above to find datasets and projects.
                    </Typography>
                </Box>
            ) : loading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        Searching...
                    </Typography>
                </Box>
            ) : totalResults === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        No results found. Try a different search term.
                    </Typography>
                </Box>
            ) : (
                <>
                    {/* Results Count and Pagination Controls */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {totalResults} {totalResults === 1 ? 'result' : 'results'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FormControl size="small" sx={{ minWidth: 80 }}>
                                <Select
                                    value={perPage}
                                    onChange={handlePerPageChange}
                                    sx={{
                                        backgroundColor: '#c13f27',
                                        color: '#ffffff',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#c13f27' },
                                        '& .MuiSvgIcon-root': { color: '#ffffff' },
                                    }}
                                >
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                </Select>
                            </FormControl>
                            <Typography variant="body2">per page</Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ borderColor: '#c13f27', borderWidth: 1, mb: 3 }} />

                    {/* Datasets Section */}
                    {totalDatasets > 0 && (
                        <>
                            <Typography variant="h6" sx={{ color: '#c13f27', fontWeight: 'bold', mb: 2 }}>
                                Datasets ({totalDatasets})
                            </Typography>
                            {paginatedDatasets.map((record, index) => (
                                <React.Fragment key={record.id}>
                                    <SearchResultCard record={record} />
                                    {index < paginatedDatasets.length - 1 && (
                                        <Divider sx={{ borderColor: '#c13f27', borderWidth: 1, my: 3 }} />
                                    )}
                                </React.Fragment>
                            ))}
                            {totalDatasets > perPage && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                    <Pagination
                                        count={Math.ceil(totalDatasets / perPage)}
                                        page={page}
                                        onChange={handlePageChange}
                                        color="primary"
                                        sx={{
                                            '& .MuiPaginationItem-root.Mui-selected': {
                                                backgroundColor: '#c13f27',
                                                color: '#ffffff',
                                                '&:hover': { backgroundColor: '#a0351f' },
                                            },
                                        }}
                                    />
                                </Box>
                            )}
                        </>
                    )}

                    {/* Projects Section - use inline display instead of ProjectsSearchSection */}
                    {projects.length > 0 && (
                        <Box sx={{ mt: totalDatasets > 0 ? 6 : 0 }}>
                            <Divider sx={{ borderColor: '#c13f27', borderWidth: 1, mb: 2 }} />
                            <Typography variant="h6" sx={{ color: '#c13f27', fontWeight: 'bold', mb: 2 }}>
                                Projects ({projects.length})
                            </Typography>
                            {projects.map((project) => (
                                <Card
                                    key={project.id}
                                    sx={{
                                        mb: 3,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        borderRadius: '4px',
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 'bold',
                                                color: '#c13f27',
                                                mb: 1,
                                                cursor: 'pointer',
                                                '&:hover': { textDecoration: 'underline' },
                                            }}
                                            onClick={() => navigate(`/projects/${project.id}/show`)}
                                        >
                                            {project.p_title || 'Untitled Project'}
                                        </Typography>
                                        {project.p_consort_network && (
                                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontStyle: 'italic' }}>
                                                {project.p_consort_network}
                                            </Typography>
                                        )}
                                        {project.p_description && (
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'text.secondary',
                                                    mb: 2,
                                                    lineHeight: 1.6,
                                                    fontSize: '0.9375rem',
                                                }}
                                            >
                                                {typeof project.p_description === 'string' && project.p_description.length > 300
                                                    ? `${project.p_description.substring(0, 300)}...`
                                                    : project.p_description}
                                            </Typography>
                                        )}
                                        <Button
                                            variant="contained"
                                            onClick={() => navigate(`/projects/${project.id}/show`)}
                                            sx={{
                                                backgroundColor: '#c13f27',
                                                color: '#ffffff',
                                                fontWeight: 'bold',
                                                textTransform: 'none',
                                                px: 3,
                                                '&:hover': { backgroundColor: '#a0351f' },
                                            }}
                                        >
                                            Project
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
};

// Main Search Results Component
const SearchResults = () => {
    return (
        <Box sx={{ width: '100%' }}>
            <PageHeader title="Search Results" />
            <SearchResultsContent />
        </Box>
    );
};

export default SearchResults;
