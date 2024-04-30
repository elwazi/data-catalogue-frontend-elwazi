import {Datagrid, DatagridConfigurable, List, SelectColumnsButton, TextField, TopToolbar} from "react-admin";

// TODO this should come from a module becuase it would be shared by other catalogues
import {FieldValuesFilter} from './FieldValuesFilter';
import {Card, CardContent} from '@mui/material';
import {TextInput} from "../.vite/deps/react-admin";

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
const ListActions = () => (
    <TopToolbar>
        <SelectColumnsButton />
    </TopToolbar>
);
export const DatasetList = () => {
    return (
        <List
            actions={<ListActions />}
            aside={<FilterSidebar/>}
        >
            <DatagridConfigurable>
                <TextField source="d_name"/>
                <TextField source="d_category"/>
                <TextField source="d_type"/>
                <TextField source="d_status"/>
                <TextField source="sample_size"/>
                <TextField source="data_use_permission"/>
            </DatagridConfigurable>
        </List>
    )
};
