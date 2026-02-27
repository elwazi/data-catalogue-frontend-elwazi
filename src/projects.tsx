import { List, useListContext, RecordContextProvider } from "react-admin";
import {Card, CardContent, Box, Typography, Divider, Chip, Link as MuiLink} from '@mui/material';
import { FilterLiveSearch } from "ra-ui-materialui";
import ReadMoreTextField from './ReadMoreTextField';
import ConditionalUrlField from './ConditionalUrlField';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PageHeader from './PageHeader';
import { useNavigate } from 'react-router-dom';

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

// Projects list content component that uses ListContext
const ProjectsListContent = () => {
    const { data, isLoading } = useListContext();
    
    if (isLoading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="body1" color="text.secondary">
                    Loading projects...
                </Typography>
            </Box>
        );
    }
    
    if (!data || data.length === 0) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="body1" color="text.secondary">
                    No projects found.
                </Typography>
            </Box>
        );
    }
    
    return (
        <Box sx={{ p: 3 }}>
            {data.map((record: ProjectRecord, index: number) => (
                <Box key={record.id || index}>
                    <ProjectCardWrapper record={record} />
                    {index < data.length - 1 && (
                        <Divider sx={{ backgroundColor: '#c13f27', height: '1px', my: 3 }} />
                    )}
                </Box>
            ))}
        </Box>
    );
};

// Wrapper to provide record context
const ProjectCardWrapper = ({ record }: { record: ProjectRecord }) => {
    const navigate = useNavigate();
    
    const handleTitleClick = () => {
        if (record.id) {
            navigate(`/projects/${record.id}/show`);
        }
    };
    
    return (
        <RecordContextProvider value={record}>
            <Box>
                {/* Project Title */}
                <Typography 
                    variant="h5" 
                    sx={{ 
                        color: '#c13f27', 
                        fontWeight: 'bold',
                        mb: 1.5,
                        cursor: 'pointer',
                        '&:hover': {
                            textDecoration: 'underline',
                        }
                    }}
                    onClick={handleTitleClick}
                >
                    {record.p_title || record.p_acronym || 'Untitled Project'}
                </Typography>
                
                {/* Description */}
                {record.p_description && (
                    <Box sx={{ mb: 2 }}>
                        <ReadMoreTextField source="p_description" length={200} />
                    </Box>
                )}
            
            {/* Website Link */}
            {record.p_website && (() => {
                try {
                    new URL(record.p_website);
                    return (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography component="span" sx={{ color: '#c13f27', fontWeight: 'bold' }}>
                                    Website:
                                </Typography>
                                {' '}
                                <MuiLink
                                    href={record.p_website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        color: '#1976d2',
                                        textDecoration: 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    {record.p_website}
                                    <OpenInNewIcon sx={{ fontSize: 14 }} />
                                </MuiLink>
                            </Typography>
                        </Box>
                    );
                } catch {
                    return null;
                }
            })()}
            
            {/* Datasets Count and Tags */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                {record.dataset_count !== undefined && record.dataset_count !== null && (
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        <Typography component="span" sx={{ color: '#c13f27', fontWeight: 'bold' }}>
                            Datasets:
                        </Typography>
                        {' '}
                        <Typography component="span" sx={{ color: 'text.secondary' }}>
                            {record.dataset_count}
                        </Typography>
                    </Typography>
                )}
                
                {(() => {
                    const keywords = record.p_keywords 
                        ? (Array.isArray(record.p_keywords) 
                            ? record.p_keywords.map((k: Keyword) => (typeof k === 'string' ? k : k.name))
                            : (typeof record.p_keywords === 'string' 
                                ? record.p_keywords.split(/[,;]/).map((k: string) => k.trim()).filter(Boolean)
                                : []))
                        : [];
                    
                    if (keywords.length === 0) return null;
                    
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body2" component="span" sx={{ color: '#c13f27', fontWeight: 'bold', mr: 0.5 }}>
                                Tags:
                            </Typography>
                            {keywords.map((keyword: string, idx: number) => (
                                <Chip
                                    key={idx}
                                    label={keyword}
                                    size="small"
                                    sx={{
                                        backgroundColor: '#4caf50',
                                        color: '#ffffff',
                                        borderRadius: '16px',
                                        border: 'none',
                                        fontSize: '0.75rem',
                                        height: '24px',
                                        fontWeight: 500,
                                        '&:hover': {
                                            backgroundColor: '#45a049',
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    );
                })()}
            </Box>
        </Box>
        </RecordContextProvider>
    );
};

export const ProjectsList = () => {
    return (
        <Box>
            <PageHeader title="Projects" />
        <List
            actions={false}
            // aside={<FilterSidebar/>}
        >
                <ProjectsListContent />
        </List>
        </Box>
    )
};
