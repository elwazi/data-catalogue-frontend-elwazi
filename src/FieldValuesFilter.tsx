import React, {useEffect, useState} from 'react';
import {
    GetListParams, useDataProvider, useResourceContext}
    from 'ra-core';
import {FilterList, FilterListItem} from 'ra-ui-materialui';
import ContentFilter from '@mui/icons-material/FilterList';

interface Props {
    column: string;
    valueGetter?: Function;
}


export const FieldValuesFilter = (
    {
        column,
        valueGetter
    }: Props) => {
    const [columnValues, setColumnValues] = useState<string[]>([]);
    const dataProvider = useDataProvider();
    const resource = useResourceContext();

    const isSelected = (value:any, filters:any) => {
        const [selectedKey, selectedValue] = Object.entries(value)[0];
        return filters?.[selectedKey] == selectedValue
    };
    const toggleFilter = (value:any, filters:any) => {
        const [selectedKey, selectedValue] = Object.entries(value)[0];
        if (selectedKey in filters) {
            if (filters?.[selectedKey].find((v:any) => v === selectedValue)) {
                filters[selectedKey] = filters[selectedKey].filter((v:any) => v !== selectedValue)
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
                const distinctValues = [...new Set(data.map((item:any) => (valueGetter?.(item) ?? item[column]) as string))].sort();
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
    console.log(columnValues);
    console.log(isSelected);
    console.log(toggleFilter);
    return (
        <div style={{maxHeight: '300px', overflowY: 'auto'}}>
            <FilterList label={column} icon={<ContentFilter/>}>
                {columnValues.map(value => (
                    // TODO allow multiple selection
                    <FilterListItem
                        label={value}
                        key={value}
                        value={Object.fromEntries([[column, value]])}
                        isSelected={isSelected}
                        toggleFilter={toggleFilter}
                    />
                ))}
            </FilterList>
        </div>
    );
};

