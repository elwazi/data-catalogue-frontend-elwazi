import {AppBar, TitlePortal} from 'react-admin';
import ElwaziLogo from "./elwaziLogo";
import {Box, styled} from "@mui/material";
import DSIAfricaLogo from "./dsiAfricaLogo";
import AfrigenLogo from "./afrigenLogo";

// Create a styled wrapper for ElwaziLogo to enforce white color
const WhiteElwaziLogo = styled(ElwaziLogo)({
    '& path, & svg': {
        fill: '#ffffff !important'
    }
});

const WhiteAfrigenLogo = styled(AfrigenLogo)({
    '& path, & svg': {
        fill: '#ffffff !important'
    }
});

export const MyAppBar = () => (
    <AppBar>
        <TitlePortal/>
        <Box component="span" flex={1}/>
        <WhiteElwaziLogo/>
        <WhiteAfrigenLogo/>
        <Box component="span" flex={1}/>
        <DSIAfricaLogo/>
        <Box component="span" flex={1}/>
    </AppBar>
);
