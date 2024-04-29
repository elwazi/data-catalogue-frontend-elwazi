import {defaultTheme} from "react-admin";
import {RaThemeOptions} from "ra-ui-materialui/src/theme/types";

export const theme: RaThemeOptions = {
    ...defaultTheme,
    palette: {
        // mode: 'light',
        primary: {
            main: '#c13f27'
        },
        secondary: {
            main: '#c13f27',
        },
        // error: {main: '#c13f27'},
    },
    // typography: {
    //     fontFamily: [
    //         '"Open Sans"',
    //         '"Arial"',
    //         'sans-serif',
    //     ].join(','),
    // },
    components: {
        ...defaultTheme.components,
        RaDatagrid: {
            styleOverrides: {
                root: {
                    "& .RaDatagrid-rowOdd": {
                        backgroundColor: "#FFF3E0",
                    },
                    "& .RaDatagrid-headerCell": {
                        backgroundColor: '#fcc300',
                    },
                }
            }
        },
    },
    sidebar: {
        width: 170, // The default value is 240
        //     closedWidth: 70, // The default value is 55
    },
};
