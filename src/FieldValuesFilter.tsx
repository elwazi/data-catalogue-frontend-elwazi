import React, {useEffect, useState} from 'react';
import {GetListParams, useDataProvider, useResourceContext, useTranslate} from 'ra-core';
import {Button, Count, FilterList, FilterListItem} from 'ra-ui-materialui';
import {Box, Collapse, Typography} from '@mui/material';
import {ExpandLess, ExpandMore} from '@mui/icons-material';

interface Props {
    column: string;
    valueGetter?: Function;
}

function toTitleCase(str) {
    return str
        .split(' ') // Split the string into an array of words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word and make the rest lowercase
        .join(' '); // Join the array back into a string
}

function getDistinctArray(array, key = null) {
    return array.reduce((acc, currentItem) => {
        // Determine the value to compare for distinctiveness
        const valueToCompare = key ? currentItem[key] : currentItem;

        // Check if the valueToCompare is already in the accumulator
        if (!acc.some(item => {
            // Compare item based on the key or valueToCompare directly
            return key ? item[key] === valueToCompare : item === valueToCompare;
        })) {
            acc.push(currentItem);
        }

        return acc;
    }, []);
}

export const FieldValuesFilter = (
    {
        column,
        valueGetter
    }: Props) => {
    const [columnValues, setColumnValues] = useState<string[]>([]);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const dataProvider = useDataProvider();
    const resource = useResourceContext();
    const translate = useTranslate();
    const buttonLabel = toTitleCase(translate(`resources.${resource}.fields.${column}`))

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };
    const isSelected = (value: any, filters: any) => {
        const [selectedKey, selectedValue] = Object.entries(value)[0];
        let existingFilters = filters?.[selectedKey] || [];
        return existingFilters?.includes(selectedValue);
    };
    const toggleFilter = (value: any, filters: any) => {
        const [selectedKey, selectedValue] = Object.entries(value)[0];

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

    useEffect(() => {
        const fetchColumnValues = async () => {
            try {
                const {data} = await dataProvider.getList(resource, {
                    pagination: {page: 1, perPage: 200},
                    sort: {field: 'id', order: 'ASC'},
                } as GetListParams);

                const cleanValues = data.map((item: any) => (valueGetter?.(item) ?? item[column]))
                    .filter(value => value !== undefined)
                    .filter(value => value !== null)
                    .flatMap(i => i)
                    .map(i => (typeof i === 'string')?i.trim():i)
                    .map(i => {
                        if (typeof i === 'object') {
                            i['name'] = i['name'].trim();
                        }
                        return i;
                    })
                    .filter(i => (typeof i ==='object') ? (i['name'] !== '') : true)
                    .filter(value => value !== '');
                let distinctValues = [];
                if (typeof cleanValues[0] === 'object') {
                    distinctValues = getDistinctArray(cleanValues, 'name')
                } else {
                    distinctValues = [...new Set(cleanValues)].sort();
                }
                setColumnValues(distinctValues);
            } catch (error) {
                console.error(`Error fetching column values for column ${column} of resource ${resource}:`, error);
            }
        };

        fetchColumnValues();
    }, [
        dataProvider,
        column,
        resource
    ]);

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
                            const filterForCategory = Object.fromEntries([[column, value]]);
                            return (
                                <FilterListItem
                                    label={
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography>{value?.['name'] ?? value}</Typography>
                                            <Count filter={filterForCategory}/>
                                        </Box>
                                    }
                                    key={JSON.stringify(filterForCategory)}
                                    value={filterForCategory}
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

