import {Datagrid, List, TextField} from "react-admin";

// TODO this should come from a module becuase it would be shared by other catalogues
import {FieldValuesFilter} from './FieldValuesFilter';
import {Card, CardContent} from '@mui/material';

const FilterSidebar = () => (
    <Card sx={{ order: -1}}>
        <CardContent>
            <FieldValuesFilter column="project_metadata_complete"/>

        </CardContent>
    </Card>
);
export const ProjectsList = () => {
    return (
        <List  aside={<FilterSidebar/>}>
            <Datagrid>
                <TextField source="id"/>
                <TextField source="p_title"/>
                <TextField source="p_website"/>
                <TextField source="p_accronym"/>
                <TextField source="p_description"/>
                <TextField source="p_keywords"/>
                <TextField source="project_metadata_complete"/>
            </Datagrid>
        </List>
    )
};
