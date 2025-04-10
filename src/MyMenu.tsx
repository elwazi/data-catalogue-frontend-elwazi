import * as React from 'react';
import { Menu } from 'react-admin';
import DatasetIcon from '@mui/icons-material/Storage';
import ProjectIcon from '@mui/icons-material/Folder';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';

export const MyMenu = () => {
    const navigate = useNavigate();

    return (
        <Menu>
            <MenuItem onClick={() => navigate('/datasets')} sx={{ color: 'text.primary' }}>
                <ListItemIcon>
                    <DatasetIcon />
                </ListItemIcon>
                <ListItemText primary="Datasets" />
            </MenuItem>
            
            <MenuItem onClick={() => navigate('/projects')} sx={{ color: 'text.primary' }}>
                <ListItemIcon>
                    <ProjectIcon />
                </ListItemIcon>
                <ListItemText primary="Projects" />
            </MenuItem>

            <MenuItem onClick={() => navigate('/about')} sx={{ color: 'text.primary' }}>
                <ListItemIcon>
                    <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="About" />
            </MenuItem>
        </Menu>
    );
};

export default MyMenu; 