import {Layout} from 'react-admin';
import {MyAppBar} from "./MyAppBar";
// import MyMenu from './MyMenu';

export const MyLayout = (props) => <Layout {...props}
                                           appBar={MyAppBar}
    // menu={MyMenu}
/>;
