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
import jsonExport from 'jsonexport/dist';

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

// Define interfaces for the data structure
interface Keyword {
    name: string;
    [key: string]: any;
}

interface ProjectRecord {
    redcap_data_access_group?: string;
    p_title?: string;
    p_website?: string;
    p_description?: string;
    p_keywords?: Keyword[];
    [key: string]: any;
}

// Custom exporter function that only exports specific columns
const customExporter = (data: ProjectRecord[]) => {
    // Transform the data to only include the specified columns
    const exportData = data.map((record: ProjectRecord) => {
        // Extract keywords names if they exist
        const keywordsNames = record.p_keywords 
            ? record.p_keywords.map((keyword: Keyword) => keyword.name).join(', ') 
            : '';
            
        return {
            redcap_data_access_group: record.redcap_data_access_group || '',
            p_title: record.p_title || '',
            p_website: record.p_website || '',
            p_description: record.p_description || '',
            'p_keywords.name': keywordsNames
        };
    });

    // Use the jsonExport function to convert to CSV
    jsonExport(exportData, {
        delimiter: ',',
    }, (err: Error | null, csv: string) => {
        if (err) {
            console.error(err);
            return;
        }
        
        // Create a download link for the CSV
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'projects_export.csv';
        link.click();
        URL.revokeObjectURL(url);
    });
};

const ListActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
        <ExportButton exporter={customExporter} />
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
