import {
    ArrayField,
    ChipField,
    DatagridConfigurable,
    List,
    SelectColumnsButton,
    SingleFieldList,
    TextField,
    TopToolbar
} from "react-admin";
import {Card, CardContent} from '@mui/material';

// TODO this should come from a module becuase it would be shared by other catalogues
import {FieldValuesFilter} from './FieldValuesFilter';

const FilterSidebar = () => (
    <Card sx={{ order: -1}}>
        <CardContent>
            <FieldValuesFilter column="p_title"/>
            <FieldValuesFilter column="p_website"/>
            {/*<FieldValuesFilter column="p_keywords"/>*/}
        </CardContent>
    </Card>
);

const ListActions = () => (
    <TopToolbar>
        <SelectColumnsButton />
    </TopToolbar>
);
export const ProjectsList = () => {
    return (
        <List
            actions={<ListActions />}
            aside={<FilterSidebar/>}>
            <DatagridConfigurable>
                <TextField source="p_title"/>
                <TextField source="p_website"/>
                <TextField source="p_accronym"/>
                <TextField source="p_description"/>
                <ArrayField source={"p_keywords"}>
                <SingleFieldList linkType={false}>
                    <ChipField source="name" size="small" />
                </SingleFieldList>
            </ArrayField>

            </DatagridConfigurable>
        </List>
    )
};
