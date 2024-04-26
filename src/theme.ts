import {defaultTheme} from "react-admin";
import {RaThemeOptions} from "ra-ui-materialui/src/theme/types";
import {createTheme} from '@mui/material';
import {PaletteOptions} from "@mui/material";

let palette:PaletteOptions = {
    mode: 'light',
    primary: {main: '#c13f27'},
    secondary: {
        light: '#feecb3'
    },

    error: {main: '#c13f27'},
    background: {
        // default: 'white',
        // paper: '#feecb3'
    }
};

debugger;
const pp = createTheme()
export const theme:RaThemeOptions = {
    ...defaultTheme,
    palette: palette,
    typography: {
        fontFamily: [
            '"Open Sans"',
            '"Arial"',
            'sans-serif',
        ].join(','),
    },
    components: {
        ...defaultTheme.components,
        RaDatagrid: {
            styleOverrides: {
                root: {
                    backgroundColor: "#fef8e1",
                    "& .RaDatagrid-rowOdd": {
                        backgroundColor: "#ffffef",
                    },
                    "& .RaDatagrid-headerCell": {
                        backgroundColor: palette.secondary?.light,
                    },
                }
            }
        },
        MuiListItemText: {
            defaultProps: {
                variant: 'filled' as const,
            },
        },

    },
    sidebar: {
        width: 170, // The default value is 240
        // closedWidth: 70, // The default value is 55
    },
};
