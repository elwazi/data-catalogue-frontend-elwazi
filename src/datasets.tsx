import {Datagrid, List, TextField} from "react-admin";

// TODO this should come from a module becuase it would be shared by other catalogues
import {FieldValuesFilter} from './FieldValuesFilter';
import {Card, CardContent} from '@mui/material';

const FilterSidebar = () => (
    <Card sx={{ order: -1}}>
        <CardContent>
            <FieldValuesFilter column="d_category"/>
            <FieldValuesFilter column="d_type"/>
            <FieldValuesFilter column="d_status"/>
            <FieldValuesFilter column="data_use_permission"/>

        </CardContent>
    </Card>
);
export const DatasetList = () => {
    return (
        <List  aside={<FilterSidebar/>}>
            <Datagrid>
                <TextField source="id"/>
                <TextField source="d_name"/>
                <TextField source="d_category"/>
                <TextField source="d_type"/>
                <TextField source="d_status"/>
                <TextField source="sample_size"/>
                <TextField source="data_use_permission"/>
            </Datagrid>
        </List>
    )
};
