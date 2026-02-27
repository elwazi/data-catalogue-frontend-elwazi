import {Layout, LayoutProps} from 'react-admin';
import {MyAppBar} from "./MyAppBar";
import Footer from './Footer';
import { Box } from '@mui/material';

// Empty menu to hide the sidebar
const NoMenu = () => null;

export const MyLayout = (props: LayoutProps) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
        <Layout {...props}
                appBar={MyAppBar}
                menu={NoMenu}
                sx={{
                    flex: 1,
                    width: '100%',
                    '& .RaLayout-content': {
                        marginLeft: 0,
                        width: '100%',
                        maxWidth: '100%',
                    },
                    '& .RaLayout-contentWithSidebar': {
                        marginLeft: 0,
                    },
                    '& .MuiDrawer-root': {
                        display: 'none',
                    },
                    '& .RaAppBar-menuButton': {
                        display: 'none !important',
                    },
                    '& button[aria-label*="menu"], & button[aria-label*="Menu"]': {
                        display: 'none !important',
                    },
                }}
        />
        <Footer />
    </Box>
);
