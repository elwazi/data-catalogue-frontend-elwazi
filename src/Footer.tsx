import { Box, Typography, Container, Link as MuiLink } from '@mui/material';

export const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#c13f27',
                color: '#ffffff',
                py: 4,
                mt: 'auto',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}
        >
            <Container maxWidth="lg">
                <Typography
                    variant="h6"
                    sx={{
                        textAlign: 'center',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        mb: 1,
                        fontSize: '1.2rem',
                    }}
                >
                    Feedback
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        textAlign: 'center',
                        mb: 2,
                        fontSize: '1.05rem',
                    }}
                >
                    We’d appreciate your thoughts on the eLwazi Catalogue. Please submit your feedback via our{' '}
                    <MuiLink
                        href="https://redcap.h3abionet.org/redcap/surveys/?s=9T4EAYRTTNA99AEP"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: '#fcc300', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                        feedback form
                    </MuiLink>
                    .
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        textAlign: 'center',
                        lineHeight: 1.8,
                        color: '#ffffff',
                        fontSize: '1.05rem',
                        maxWidth: '900px',
                        margin: '0 auto',
                    }}
                >
                    eLwazi Open Data Science Platform is supported by the Office Of The Director, National Institutes Of Health (OD) and National Institution of Biomedical Imaging and Bioengineering, and NIH award number 1 U2C EB 032224 - 01.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;

