import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
    title: string;
}

export const PageHeader = ({ title }: PageHeaderProps) => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                backgroundColor: '#FFF3E0', // Same orange as navbar hover
                py: 3,
                px: 3,
                mb: 0,
                width: '100%',
                boxSizing: 'border-box',
            }}
        >
            {/* Breadcrumbs */}
            <Breadcrumbs 
                aria-label="breadcrumb" 
                sx={{ mb: 2 }}
            >
                <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/')}
                    sx={{
                        color: '#c13f27',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        '&:hover': {
                            textDecoration: 'underline'
                        }
                    }}
                >
                    Home
                </Link>
                <Typography variant="body2" color="text.primary">
                    {title}
                </Typography>
            </Breadcrumbs>

            {/* Page Title */}
            <Typography
                variant="h4"
                sx={{
                    color: '#c13f27',
                    fontWeight: 'bold',
                    mb: 0,
                }}
            >
                {title}
            </Typography>

            {/* Divider */}
            <Box
                sx={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: '#fcc300', // Same orange as navbar accent
                    mt: 2,
                }}
            />
        </Box>
    );
};

export default PageHeader;

