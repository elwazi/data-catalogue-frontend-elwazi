import {AppBar, TitlePortal} from 'react-admin';
import ElwaziLogo from "./elwaziLogo";
import {Box} from "@mui/material";


export const MyAppBar = () => (
    <AppBar>
        <TitlePortal/>
        <Box component="span" flex={1}/>
        <ElwaziLogo/>
        <Box component="span" flex={1}/>
    </AppBar>
);
