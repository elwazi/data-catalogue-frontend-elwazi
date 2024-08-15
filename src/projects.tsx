import {
    ArrayField,
    ChipField,
    DatagridConfigurable,
    List,
    SelectColumnsButton,
    SingleFieldList,
    TextField,
    TopToolbar,
    UrlField
} from "react-admin";
import {Card, CardContent} from '@mui/material';
import {ExportButton, FilterLiveSearch, ReferenceManyCount} from "ra-ui-materialui";
import ReadMoreTextField from './ReadMoreTextField';
import ConditionalUrlField from './ConditionalUrlField';

// TODO this should come from a module becuase it would be shared by other catalogues
// import {FieldValuesFilter} from './FieldValuesFilter';

const FilterSidebar = () => (
    <Card sx={{order: -1}}>
        <CardContent>
            <FilterLiveSearch/>
            {/*<FieldValuesFilter column="p_keywords"/>*/}
        </CardContent>
    </Card>
);

const ListActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
        <ExportButton/>
    </TopToolbar>
);
export const ProjectsList = () => {
    return (
        <List
            actions={<ListActions/>}
            // aside={<FilterSidebar/>}
        >
            <DatagridConfigurable>
                <TextField source="p_title"/>
                <TextField source="p_accronym"/>
                <ConditionalUrlField source="p_website"/>
                <ReadMoreTextField source="p_description" />
                <ArrayField source={"p_keywords"}>
                    <SingleFieldList linkType={false}>
                        <ChipField source="name" size="small"/>
                    </SingleFieldList>
                </ArrayField>
                <ReferenceManyCount
                    label="Datasets"
                    reference="datasets"
                    target="record_id"
                />

            </DatagridConfigurable>
        </List>
    )
};
