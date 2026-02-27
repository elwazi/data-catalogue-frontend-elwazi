import {AppBar} from 'react-admin';
import ElwaziLogo from "./elwaziLogo";
import {Box, styled, Button, Link, Typography} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import React, { useState } from 'react';

// Create a styled wrapper for ElwaziLogo to enforce white color
const WhiteElwaziLogo = styled(ElwaziLogo)({
    '& path, & svg': {
        fill: '#ffffff !important'
    }
});

export const MyAppBar = () => {
    const navigate = useNavigate();
    const [datasetsAnchorEl, setDatasetsAnchorEl] = useState<null | HTMLElement>(null);
    const datasetsMenuOpen = Boolean(datasetsAnchorEl);

    const handleDatasetsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setDatasetsAnchorEl(event.currentTarget);
    };

    const handleDatasetsMenuClose = () => {
        setDatasetsAnchorEl(null);
    };

    const handleDomainClick = (domain: string) => {
        navigate('/datasets?filter=' + encodeURIComponent(JSON.stringify({ d_domain: domain })));
        handleDatasetsMenuClose();
    };

    const domains = [
        { name: 'Omics', value: 'Omics' },
        { name: 'Demographic & Health', value: 'Demographic & Health' },
        { name: 'Geospatial', value: 'Geospatial' },
        { name: 'Image/Video', value: 'Image/Video' },
    ];
    
    return (
        <AppBar
            sx={{
                '& .RaAppBar-menuButton': {
                    display: 'none !important',
                },
                '& button[aria-label*="menu"]': {
                    display: 'none !important',
                },
                '& .MuiIconButton-root': {
                    '&:first-of-type': {
                        display: 'none !important',
                    },
                },
                '& button[aria-label*="Menu"]': {
                    display: 'none !important',
                },
            }}
        >
            <Box display="flex" alignItems="center">
                <Box ml={4} display="flex" alignItems="center" gap={2}>
                    <Link 
                        href="https://elwazi.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            textDecoration: 'none',
                            '&:hover': {
                                opacity: 0.8
                            }
                        }}
                    >
                        <WhiteElwaziLogo/>
                    </Link>
                    <Typography
                        variant="h6"
                        sx={{
                            color: '#ffffff',
                            fontWeight: 'bold',
                            fontSize: '1.25rem',
                            textDecoration: 'none',
                        }}
                    >
                        eLwazi Data Catalog
                    </Typography>
                </Box>
            </Box>
            <Box component="span" flex={1}/>
            <Button 
                onClick={() => navigate('/')}
                sx={{
                    color: '#ffffff',
                    textTransform: 'none',
                    fontWeight: 'medium',
                    fontSize: '1.15rem',
                    marginRight: 2,
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                }}
                startIcon={<HomeIcon sx={{ fontSize: '1.2rem' }} />}
            >
                Home
            </Button>
            <Button 
                onClick={() => navigate('/about')}
                sx={{
                    color: '#ffffff',
                    textTransform: 'none',
                    fontWeight: 'medium',
                    fontSize: '1.15rem',
                    marginRight: 2,
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                }}
            >
                About
            </Button>
            <Box
                onMouseEnter={handleDatasetsMenuOpen}
                onMouseLeave={handleDatasetsMenuClose}
                sx={{ position: 'relative', display: 'inline-block' }}
            >
                <Button 
                    onClick={() => navigate('/datasets?displayedFilters=%7B%7D&filter=%7B%7D')}
                    sx={{
                        color: '#ffffff',
                        textTransform: 'none',
                        fontWeight: 'medium',
                        fontSize: '1.15rem',
                        marginRight: 2,
                        padding: '8px 16px',
                        position: 'relative',
                        '&:hover': {
                            backgroundColor: '#FFF3E0',
                            color: '#c13f27',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '3px',
                                backgroundColor: '#fcc300',
                            }
                        }
                    }}
                    endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18, ml: 0.5 }} />}
                >
                    Datasets
                </Button>
                {datasetsMenuOpen && (
                    <Box
                        onMouseEnter={handleDatasetsMenuOpen}
                        onMouseLeave={handleDatasetsMenuClose}
                        sx={{
                            position: 'absolute',
                            top: 'calc(100% - 4px)',
                            left: 0,
                            backgroundColor: '#FFF3E0',
                            borderRadius: '8px',
                            minWidth: '220px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            zIndex: 1300,
                            overflow: 'hidden',
                            border: '1px solid rgba(193, 63, 39, 0.1)',
                            pt: 0.5,
                        }}
                    >
                        {domains.map((domain, index) => (
                            <Box
                                key={domain.value}
                                onClick={() => handleDomainClick(domain.value)}
                                sx={{
                                    color: '#c13f27',
                                    py: 1.5,
                                    px: 2.5,
                                    cursor: 'pointer',
                                    display: 'block',
                                    textDecoration: 'none',
                                    borderBottom: index < domains.length - 1 ? '1px solid rgba(193, 63, 39, 0.1)' : 'none',
                                    '&:hover': {
                                        backgroundColor: 'rgba(193, 63, 39, 0.08)'
                                    },
                                    '&:last-child': {
                                        borderBottom: 'none'
                                    }
                                }}
                            >
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        fontWeight: 500,
                                        fontSize: '1rem',
                                        color: '#c13f27'
                                    }}
                                >
                                    {domain.name}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
            <Button 
                onClick={() => navigate('/projects')}
                sx={{
                    color: '#ffffff',
                    textTransform: 'none',
                    fontWeight: 'medium',
                    fontSize: '1.15rem',
                    marginRight: 2,
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                }}
            >
                Projects
            </Button>
            <Button 
                component={Link}
                href="https://helpdesk.elwazi.org/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                    color: '#ffffff',
                    textTransform: 'none',
                    fontWeight: 'medium',
                    fontSize: '1.15rem',
                    marginRight: 2
                }}
            >
                Helpdesk
            </Button>
        </AppBar>
    );
};
