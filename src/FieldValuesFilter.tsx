import React, {useEffect, useState} from 'react';
import {GetListParams, useDataProvider, useResourceContext, useTranslate} from 'ra-core';
import {Button, Count, FilterList, FilterListItem} from 'ra-ui-materialui';
import {Box, Collapse, Typography} from '@mui/material';
import {ExpandLess, ExpandMore} from '@mui/icons-material';

interface Props {
    column: string;
    valueGetter?: Function;
}

// Interface for values that might be objects with a name property
interface NamedValue {
    name: string;
    [key: string]: any;
}

function toTitleCase(str: string): string {
    return str
        .split(' ') // Split the string into an array of words
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word and make the rest lowercase
        .join(' '); // Join the array back into a string
}

function getDistinctArray(array: any[], key: string | null = null): any[] {
    return array.reduce((acc: any[], currentItem: any) => {
        // Determine the value to compare for distinctiveness
        const valueToCompare = key ? currentItem[key] : currentItem;

        // Check if the valueToCompare is already in the accumulator
        if (!acc.some((item: any) => {
            // Compare item based on the key or valueToCompare directly
            return key ? item[key] === valueToCompare : item === valueToCompare;
        })) {
            acc.push(currentItem);
        }

        return acc;
    }, []);
}

// Helper function to check if a value is a NamedValue
function isNamedValue(value: any): value is NamedValue {
    return typeof value === 'object' && value !== null && 'name' in value;
}

// Check if a field should be treated as comma-separated
const isCommaSeparatedField = (column: string): boolean => {
    return ['d_category', 'd_countries', 'data_use_permission'].includes(column);
};

export const FieldValuesFilter = (
    {
        column,
        valueGetter
    }: Props) => {
    const [columnValues, setColumnValues] = useState<(string | NamedValue)[]>([]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [counts, setCounts] = useState<Record<string, number>>({});

    const dataProvider = useDataProvider();
    const resource = useResourceContext();
    const translate = useTranslate();
    const buttonLabel = toTitleCase(translate(`resources.${resource}.fields.${column}`))

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };
    const isSelected = (value: any, filters: any) => {
        const entries = Object.entries(value);
        if (!entries.length) return false;
        
        const [selectedKey, selectedValue] = entries[0];
        
        // Handle comma-separated fields
        if (isCommaSeparatedField(selectedKey)) {
            // Check if we have any filters for this field
            return selectedKey in filters && 
                   Array.isArray(filters[selectedKey]) && 
                   filters[selectedKey].includes(selectedValue);
        }
        
        // Regular field handling
        let existingFilters = filters?.[selectedKey] || [];
        return existingFilters?.includes(selectedValue);
    };
    
    const toggleFilter = (value: any, filters: any) => {
        const entries = Object.entries(value);
        if (!entries.length) return filters;
        
        const [selectedKey, selectedValue] = entries[0];
        
        // Handle comma-separated fields
        if (isCommaSeparatedField(selectedKey)) {
            if (selectedKey in filters) {
                if (filters[selectedKey].includes(selectedValue)) {
                    // Remove the value from filter
                    filters[selectedKey] = filters[selectedKey].filter((v: any) => v !== selectedValue);
                    if (filters[selectedKey].length === 0) {
                        delete filters[selectedKey];
                    }
                } else {
                    // Add the value to filter
                    filters[selectedKey].push(selectedValue);
                }
            } else {
                // Create new filter
                filters[selectedKey] = [selectedValue];
            }
            
            return filters;
        }
        
        // Regular field handling
        if (selectedKey in filters) {
            if (filters?.[selectedKey].includes(selectedValue)) {
                filters[selectedKey] = filters[selectedKey].filter((v: any) => v !== selectedValue)
                if (filters[selectedKey].length == 0) {
                    delete filters[selectedKey];
                }
            } else {
                filters[selectedKey].push(selectedValue)
            }
        } else {
            filters[selectedKey] = [selectedValue]
        }
        return filters;
    };

    const splitValues = (value: string) => {
        return value.split(',').map((v: string) => v.trim()).filter(v => v !== '');
    };

    useEffect(() => {
        const fetchColumnValues = async () => {
            try {
                const { data } = await dataProvider.getList(resource, {
                    pagination: { page: 1, perPage: 1000 },
                    sort: { field: 'id', order: 'ASC' },
                } as GetListParams);

                const cleanValues = data.map((item: any) => (valueGetter?.(item) ?? item[column]))
                    .filter(value => value !== undefined && value !== null)
                    .flatMap(i => typeof i === 'string' ? splitValues(i) : i)
                    .map(i => {
                        if (isNamedValue(i)) {
                            i.name = i.name.trim();
                        }
                        return i;
                    })
                    .filter(i => isNamedValue(i) ? (i.name !== '') : true)
                    .filter(value => value !== '');

                let distinctValues: (string | NamedValue)[] = [];
                if (cleanValues.length > 0 && isNamedValue(cleanValues[0])) {
                    distinctValues = getDistinctArray(cleanValues, 'name');
                } else {
                    // Use Array.from() to convert Set to array for better TypeScript compatibility
                    distinctValues = Array.from(new Set(cleanValues)).sort();
                }
                setColumnValues(distinctValues);

                // Calculate accurate counts for comma-separated fields
                if (isCommaSeparatedField(column)) {
                    const countMap: Record<string, number> = {};
                    distinctValues.forEach((value: string | NamedValue) => {
                        const valueStr = isNamedValue(value) ? value.name : String(value);
                        // Count records containing this category
                        const count = data.filter(record => {
                            if (!record[column]) return false;
                            const values = record[column].split(',').map((v: string) => v.trim());
                            return values.includes(valueStr);
                        }).length;
                        countMap[valueStr] = count;
                    });
                    setCounts(countMap);
                }
            } catch (error) {
                console.error(`Error fetching column values for column ${column} of resource ${resource}:`, error);
            }
        };

        fetchColumnValues();
    }, [
        dataProvider,
        column,
        resource,
        valueGetter
    ]);

    // Custom Count component that uses our pre-calculated counts for comma-separated fields
    const CustomCount = ({ value }: { value: string }) => {
        if (!isCommaSeparatedField(column)) {
            // For non-comma-separated fields, use the standard filtering approach
            const filterObj = Object.fromEntries([[column, value]]);
            return <Count filter={filterObj} />;
        }
        
        // For comma-separated fields, use our pre-calculated counts
        return <span>{counts[value] || 0}</span>;
    };

    return (
        <div style={{maxHeight: '300px', overflowY: 'auto'}}>
            <Button onClick={toggleCollapse}
                    label={buttonLabel}>
                {isCollapsed ? <ExpandMore/> : <ExpandLess/>}
            </Button>
            <Collapse in={!isCollapsed}>
                {/* hide FilterList's label and icon because they are shown with the Collapse controls */}
                <FilterList
                    label=""
                    icon={null}
                >
                    {columnValues
                        .filter(value => value !== '')
                        .map(value => {
                            const valueStr = isNamedValue(value) ? value.name : String(value);
                            
                            // Create a simple filter object with the value
                            const filterValue = { [column]: valueStr };
                            
                            return (
                                <FilterListItem
                                    label={
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography>{valueStr}</Typography>
                                            <CustomCount value={valueStr} />
                                        </Box>
                                    }
                                    key={JSON.stringify(filterValue)}
                                    value={filterValue}
                                    isSelected={isSelected}
                                    toggleFilter={toggleFilter}
                                />
                            );
                        })}
                </FilterList>
            </Collapse>
        </div>
    );
};