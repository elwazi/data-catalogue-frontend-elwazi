import React, {useEffect, useState} from 'react';
import {GetListParams, useDataProvider, useResourceContext} from 'ra-core';
import {FilterList, FilterListItem, Button} from 'ra-ui-materialui';
import ContentFilter from '@mui/icons-material/FilterList';
import {Collapse, Typography} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {useTranslate} from "ra-core";

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
    // let buttonLabel = translateLabel({
    //     label: column,
    //     resource,
    //     source: column,
    // });
    const buttonLabel = toTitleCase(translate(`resources.${resource}.fields.${column}`))


// Example usage
    const sentence = "hello world! how are you doing?";
    const titleCased = toTitleCase(sentence);;
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
        let existingFilters = filters?.[selectedKey] || [];

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
                const distinctValues = [...new Set(data.map((item: any) => (valueGetter?.(item) ?? item[column]) as string))].sort();
                setColumnValues(distinctValues);
            } catch (error) {
                console.error('Error fetching column values:', error);
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
                {isCollapsed ? <ExpandMore /> : <ExpandLess />}
            </Button>
            <Collapse in={!isCollapsed}>
                    {/* hide label and icon because they are shown with the collapse controls*/}
                    <FilterList
                        label=""
                        icon={null}>
                        {columnValues
                            .filter(value=>value!==null)
                            .map(value=>value.trim())
                            .filter(value=>value!=='')
                            .map(value => {
                            return (
                                // TODO allow multiple selection
                                <FilterListItem
                                    label={value}
                                    key={value}
                                    value={Object.fromEntries([[column, value]])}
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

