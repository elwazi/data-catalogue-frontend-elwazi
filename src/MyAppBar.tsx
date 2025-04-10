import {AppBar, TitlePortal} from 'react-admin';
import ElwaziLogo from "./elwaziLogo";
import {Box, styled, Button, Link} from "@mui/material";
import DSIAfricaLogo from "./dsiAfricaLogo";
import AfrigenLogo from "./afrigenLogo";

// Create a styled wrapper for ElwaziLogo to enforce white color
const WhiteElwaziLogo = styled(ElwaziLogo)({
    '& path, & svg': {
        fill: '#ffffff !important'
    }
});

const WhiteAfrigenLogo = styled(AfrigenLogo)({
    '& path, & svg, & g': {
        fill: '#ffffff !important',
        color: '#ffffff !important'
    }
});

export const MyAppBar = () => (
    <AppBar>
        <Box display="flex" alignItems="center">
            <TitlePortal/>
            <Box ml={4} display="flex" alignItems="center">
                <WhiteElwaziLogo/>
                <DSIAfricaLogo/>
            </Box>
        </Box>
        <Box component="span" flex={1}/>
        <Button 
            component={Link}
            href="https://helpdesk.elwazi.org/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: 'medium',
                fontSize: '1rem',
                marginRight: 2
            }}
        >
            Helpdesk
        </Button>
    </AppBar>
);
