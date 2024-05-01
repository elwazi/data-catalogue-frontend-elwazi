import { AppBar, TitlePortal } from 'react-admin';
import Logo from "./Logo";
import {Box} from "@mui/material";


export const MyAppBar = () => (
    <AppBar>
        <TitlePortal />
        <Box component="span" flex={1} />
        <Logo />
        <Box component="span" flex={1} />
    </AppBar>
);
