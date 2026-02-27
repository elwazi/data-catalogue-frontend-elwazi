import { Box, Typography, Container, Grid, Card, CardContent, Button, CircularProgress, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDataProvider } from 'react-admin';
import { useEffect, useState } from 'react';
import DatasetIcon from '@mui/icons-material/Storage';
import ProjectIcon from '@mui/icons-material/Folder';
import SearchIcon from '@mui/icons-material/Search';

const Home = () => {
    const navigate = useNavigate();
    const dataProvider = useDataProvider();
    const [datasetsCount, setDatasetsCount] = useState<number | null>(null);
    const [projectsCount, setProjectsCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                // Fetch datasets count
                const datasetsResult = await dataProvider.getList('datasets', {
                    pagination: { page: 1, perPage: 1 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: {},
                });
                setDatasetsCount(datasetsResult.total ?? null);

                // Fetch projects count
                const projectsResult = await dataProvider.getList('projects', {
                    pagination: { page: 1, perPage: 1 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: {},
                });
                setProjectsCount(projectsResult.total ?? null);
            } catch (error) {
                console.error('Error fetching counts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, [dataProvider]);

    return (
        <Container maxWidth="xl" sx={{ mt: 2, mb: 4, px: { xs: 2, sm: 2, md: 3 } }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography 
                    variant="h2" 
                    component="h1" 
                    gutterBottom
                    sx={{ 
                        color: '#c13f27', 
                        fontWeight: 'bold',
                        mb: 2
                    }}
                >
                    eLwazi Data Catalogue
                </Typography>
                <Typography 
                    variant="h4" 
                    color="text.secondary"
                    sx={{ mb: 2, fontSize: { xs: '1.5rem', md: '1.75rem' } }}
                >
                    Discover and access datasets from across Africa
                </Typography>
            </Box>

            {/* Search Section */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography 
                    variant="h5" 
                    sx={{ 
                        color: '#c13f27', 
                        fontWeight: 'bold',
                        fontStyle: 'italic',
                        mb: 2,
                        fontSize: { xs: '1.5rem', md: '1.65rem' }
                    }}
                >
                    Search the Data Catalogue
                </Typography>
                <Box 
                    sx={{ 
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'stretch',
                        justifyContent: 'center',
                        maxWidth: '800px',
                        mx: 'auto',
                        height: '48px',
                    }}
                >
                    <TextField
                        fullWidth
                        placeholder="Search (e.g. project name, domain, country...)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        variant="outlined"
                        margin="none"
                        sx={{
                            flex: 1,
                            height: '100%',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '4px 0 0 4px',
                                backgroundColor: '#ffffff',
                                height: '100%',
                                boxSizing: 'border-box',
                                '& fieldset': {
                                    borderColor: '#e0e0e0',
                                    borderRight: 'none',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#c13f27',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#c13f27',
                                },
                            },
                            '& .MuiInputBase-input': {
                                padding: '0 16px',
                                fontSize: '1.15rem',
                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        sx={{
                            backgroundColor: '#c13f27',
                            borderRadius: '0 4px 4px 0',
                            minWidth: '56px',
                            flexShrink: 0,
                            px: 3,
                            '&:hover': {
                                backgroundColor: '#a0351f',
                            },
                        }}
                    >
                        <SearchIcon />
                    </Button>
                </Box>
            </Box>

            {/* Domain Cards Section - Datasets ribbon */}
            <Box sx={{ mb: 4 }}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        color: '#c13f27', 
                        fontWeight: 'bold',
                        mb: 2,
                        textAlign: 'left',
                        fontSize: { xs: '1.75rem', md: '2rem' }
                    }}
                >
                    Datasets
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card 
                            sx={{ 
                                height: '100%',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                borderBottom: '4px solid #fcc300',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4
                                }
                            }}
                            onClick={() => navigate('/datasets?filter=' + encodeURIComponent(JSON.stringify({ d_domain: 'Omics' })))}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '180px',
                                    backgroundColor: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderTopLeftRadius: '4px',
                                    borderTopRightRadius: '4px',
                                    overflow: 'hidden',
                                }}
                            >
                                <img
                                    src="/omics.png"
                                    alt="Omics datasets"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Box>
                            <CardContent sx={{ p: 3 }}>
                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        color: '#c13f27', 
                                        fontWeight: 'bold',
                                        mb: 2,
                                        fontSize: '1.4rem'
                                    }}
                                >
                                    Omics
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '1.3rem' }}>
                                    Data derived from large-scale biological analyses that study molecules within cells, tissues, or organisms aiming to understand how they work together to influence health and disease. Examples include Genomics, Transcriptomics, Proteomics...
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card 
                            sx={{ 
                                height: '100%',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                borderBottom: '4px solid #fcc300',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4
                                }
                            }}
                            onClick={() => navigate('/datasets?filter=' + encodeURIComponent(JSON.stringify({ d_domain: 'Demographic & Health' })))}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '180px',
                                    backgroundColor: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderTopLeftRadius: '4px',
                                    borderTopRightRadius: '4px',
                                    overflow: 'hidden',
                                }}
                            >
                                <img
                                    src="/demographic-health.png"
                                    alt="Demographic and health datasets"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Box>
                            <CardContent sx={{ p: 3 }}>
                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        color: '#c13f27', 
                                        fontWeight: 'bold',
                                        mb: 2,
                                        fontSize: '1.4rem'
                                    }}
                                >
                                    Demographic & Health
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '1.3rem' }}>
                                    Data and metadata that describes characteristics of a population of interest and their health status.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card 
                            sx={{ 
                                height: '100%',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                borderBottom: '4px solid #fcc300',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4
                                }
                            }}
                            onClick={() => navigate('/datasets?filter=' + encodeURIComponent(JSON.stringify({ d_domain: 'Geospatial' })))}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '180px',
                                    backgroundColor: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderTopLeftRadius: '4px',
                                    borderTopRightRadius: '4px',
                                    overflow: 'hidden',
                                }}
                            >
                                <img
                                    src="/geospatial.png"
                                    alt="Geospatial datasets"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Box>
                            <CardContent sx={{ p: 3 }}>
                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        color: '#c13f27', 
                                        fontWeight: 'bold',
                                        mb: 2,
                                        fontSize: '1.4rem'
                                    }}
                                >
                                    Geospatial
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '1.3rem' }}>
                                    Information that describes characteristics of a population and their health status. Environmental data such as land use, climate, or mobility, and air quality.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card 
                            sx={{ 
                                height: '100%',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                borderBottom: '4px solid #fcc300',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4
                                }
                            }}
                            onClick={() => navigate('/datasets?filter=' + encodeURIComponent(JSON.stringify({ d_domain: 'Image/Video' })))}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '180px',
                                    backgroundColor: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderTopLeftRadius: '4px',
                                    borderTopRightRadius: '4px',
                                    overflow: 'hidden',
                                }}
                            >
                                <img
                                    src="/image-video.png"
                                    alt="Image and video datasets"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Box>
                            <CardContent sx={{ p: 3 }}>
                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        color: '#c13f27', 
                                        fontWeight: 'bold',
                                        mb: 2,
                                        fontSize: '1.4rem'
                                    }}
                                >
                                    Image/Video
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '1.3rem' }}>
                                    Visual data captured through sensors, or imaging devices, represented as still images, moving sequences or tabulated metrics.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* About the Catalogue Banner */}
            <Box
                sx={{
                    mb: 4,
                    backgroundColor: '#FFF3E0',
                    borderTop: '4px solid #fcc300',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    px: 3,
                    py: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                <Box sx={{ maxWidth: { xs: '100%', md: '70%' } }}>
                    <Typography
                        variant="h6"
                        sx={{
                            color: '#c13f27',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            mb: 1,
                            fontSize: '1.35rem',
                        }}
                    >
                        About the Catalogue
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            lineHeight: 1.7,
                            fontSize: { xs: '1.15rem', md: '1.25rem' },
                        }}
                    >
                        The eLwazi Catalogue powers discovery of health and genomics data from across Africa.
                        By bringing together searchable metadata from the DS-I Africa consortium and partner
                        organisations, it makes datasets findable, accessible, interoperable, and reusable—
                        accelerating research and innovation on the continent.
                    </Typography>
                </Box>
                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/about')}
                        sx={{
                            borderColor: '#c13f27',
                            color: '#c13f27',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            px: 3,
                            py: 1,
                            '&:hover': {
                                borderColor: '#a0351f',
                                backgroundColor: '#fde0d6',
                            },
                        }}
                    >
                        Read More
                    </Button>
                </Box>
            </Box>

            {/* Dataset numbers / Project numbers */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Card 
                        sx={{ 
                            height: '100%',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 4
                            }
                        }}
                        onClick={() => navigate('/datasets?displayedFilters=%7B%7D&filter=%7B%7D')}
                    >
<CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <DatasetIcon sx={{ fontSize: 48, color: '#c13f27', mr: 2 }} />
                                <Box>
                                    <Typography variant="h4" sx={{ color: '#c13f27', fontWeight: 'bold', fontSize: { xs: '1.65rem', md: '1.9rem' } }}>
                                        Datasets
                                    </Typography>
                                    {loading ? (
                                        <CircularProgress size={16} sx={{ mt: 1 }} />
                                    ) : datasetsCount !== null ? (
                                        <Typography variant="h6" sx={{ color: '#c13f27', fontWeight: 'normal', mt: 0.5, fontSize: '1.25rem' }}>
                                            {datasetsCount.toLocaleString()} {datasetsCount === 1 ? 'dataset' : 'datasets'}
                                        </Typography>
                                    ) : null}
                                </Box>
                            </Box>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: '1.2rem' }}>
                                Browse and explore available datasets from various African research projects across the African continent.
                            </Typography>
                            <Button 
                                variant="contained" 
                                sx={{ 
                                    backgroundColor: '#c13f27',
                                    '&:hover': {
                                        backgroundColor: '#a0351f'
                                    }
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/datasets?displayedFilters=%7B%7D&filter=%7B%7D');
                                }}
                            >
                                View Datasets
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card 
                        sx={{ 
                            height: '100%',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 4
                            }
                        }}
                        onClick={() => navigate('/projects')}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <ProjectIcon sx={{ fontSize: 48, color: '#c13f27', mr: 2 }} />
                                <Box>
                                    <Typography variant="h4" sx={{ color: '#c13f27', fontWeight: 'bold', fontSize: { xs: '1.65rem', md: '1.9rem' } }}>
                                        Projects
                                    </Typography>
                                    {loading ? (
                                        <CircularProgress size={16} sx={{ mt: 1 }} />
                                    ) : projectsCount !== null ? (
                                        <Typography variant="h6" sx={{ color: '#c13f27', fontWeight: 'normal', mt: 0.5, fontSize: '1.25rem' }}>
                                            {projectsCount.toLocaleString()} {projectsCount === 1 ? 'project' : 'projects'}
                                        </Typography>
                                    ) : null}
                                </Box>
                            </Box>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: '1.2rem' }}>
                                Explore research projects and their associated datasets from various research institutions across Africa.
                            </Typography>
                            <Button 
                                variant="contained" 
                                sx={{ 
                                    backgroundColor: '#c13f27',
                                    '&:hover': {
                                        backgroundColor: '#a0351f'
                                    }
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/projects');
                                }}
                            >
                                View Projects
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Contributing Partners Section */}
            <Box sx={{ mb: 4 }}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        color: '#c13f27', 
                        fontWeight: 'bold',
                        mb: 2,
                        textAlign: 'left',
                        fontSize: { xs: '1.75rem', md: '2rem' }
                    }}
                >
                    Contributing Partners
                </Typography>
                <Typography 
                    variant="body1" 
                    sx={{ 
                        color: 'text.secondary',
                        mb: 2,
                        textAlign: 'left',
                        fontSize: '1.2rem'
                    }}
                >
                    Developed and maintained by:
                </Typography>
                <Grid container spacing={2}>
                    {/* eLwazi Card */}
                    <Grid item xs={12} md={4}>
                        <Card 
                            onClick={() => window.open('https://elwazi.org/', '_blank', 'noopener,noreferrer')}
                            sx={{ 
                                height: '100%',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                borderBottom: '4px solid #fcc300',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    cursor: 'pointer'
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '180px',
                                    backgroundColor: '#fef5e0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderTopLeftRadius: '4px',
                                    borderTopRightRadius: '4px',
                                    p: 3,
                                    overflow: 'hidden',
                                }}
                            >
                                <img 
                                    src={`${import.meta.env.BASE_URL}elwazi-continent-only.svg`}
                                    alt="eLwazi Logo" 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'contain',
                                        maxHeight: '180px'
                                    }} 
                                />
                            </Box>
                            <CardContent sx={{ p: 3 }}>
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        color: '#c13f27', 
                                        fontWeight: 'bold',
                                        mb: 1,
                                        fontSize: '1.15rem'
                                    }}
                                >
                                    eLwazi
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: 'text.secondary',
                                        display: 'block',
                                        mb: 2,
                                        fontSize: '0.9rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    OPEN DATA SCIENCE PLATFORM
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '1.15rem' }}>
                                    eLwazi provides a flexible, scalable open data science platform for the DSI-Africa consortium to find and access data, select tools and workflows and run analyses on a choice of computing environments, all through easy to use workspaces. The platform leverages Terra and Gen3 implementations of the Data Biosphere concept, incorporating Global Alliance for Genomics and Health tools and standards.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* DS-I Africa Card */}
                    <Grid item xs={12} md={4}>
                        <Card 
                            onClick={() => window.open('https://dsi-africa.org/', '_blank', 'noopener,noreferrer')}
                            sx={{ 
                                height: '100%',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                borderBottom: '4px solid #fcc300',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    cursor: 'pointer'
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '180px',
                                    backgroundColor: '#fef5e0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderTopLeftRadius: '4px',
                                    borderTopRightRadius: '4px',
                                    p: 3,
                                    overflow: 'hidden',
                                }}
                            >
                                <img 
                                    src="/dsi-africa.png" 
                                    alt="DS-I Africa Logo" 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'contain',
                                        maxHeight: '180px'
                                    }} 
                                />
                            </Box>
                            <CardContent sx={{ p: 3 }}>
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        color: '#c13f27', 
                                        fontWeight: 'bold',
                                        mb: 1,
                                        fontSize: '1.15rem'
                                    }}
                                >
                                    DS-I Africa
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: 'text.secondary',
                                        display: 'block',
                                        mb: 2,
                                        fontSize: '0.9rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    Data Science for Health Discovery and Innovation in Africa
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '1.15rem' }}>
                                    The Data Science for Health Discovery and Innovation in Africa (DS-I Africa) Initiative aims to leverage data science technologies to transform biomedical and public health research and develop solutions that would lead to improved health for individuals and populations.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* AfriGen-D Card */}
                    <Grid item xs={12} md={4}>
                        <Card 
                            onClick={() => window.open('https://afrigen-d.org/', '_blank', 'noopener,noreferrer')}
                            sx={{ 
                                height: '100%',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                borderBottom: '4px solid #fcc300',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    cursor: 'pointer'
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '180px',
                                    backgroundColor: '#fef5e0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderTopLeftRadius: '4px',
                                    borderTopRightRadius: '4px',
                                    p: 3,
                                    overflow: 'hidden',
                                }}
                            >
                                <img 
                                    src="/afrigen-d.png" 
                                    alt="AfriGen-D Logo" 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'contain',
                                        maxHeight: '180px'
                                    }} 
                                />
                            </Box>
                            <CardContent sx={{ p: 3 }}>
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        color: '#c13f27', 
                                        fontWeight: 'bold',
                                        mb: 1,
                                        fontSize: '1.15rem'
                                    }}
                                >
                                    AfriGen-D
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: 'text.secondary',
                                        display: 'block',
                                        mb: 2,
                                        fontSize: '0.9rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    African Genomics Data Hub
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '1.15rem' }}>
                                    The African Genomics Data Hub (AfriGen-D) offers a suite of interconnected resources and services to facilitate the implementation of African genomics research throughout all the research data life cycle, from data generation and discovery, to analysis and long term archiving. AfriGen-D reflects the value and application of African genomics to world, and the increased integration of genetics/genomics in healthcare and biomedical research, globally.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.15rem' }}>
                    Need help? <Link to="/about" style={{ color: '#c13f27', textDecoration: 'none' }}>Learn more</Link> or{' '}
                    <a 
                        href="https://helpdesk.elwazi.org/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#c13f27', textDecoration: 'none' }}
                    >
                        contact the helpdesk
                    </a>
                </Typography>
            </Box>
        </Container>
    );
};

export default Home;

