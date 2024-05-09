import {ArrayField, ChipField, SingleFieldList, useRecordContext} from 'react-admin';

export const TagsField = ({ source }) => {
    // Split the comma-separated string into an array of strings
    const record = useRecordContext();
    const commaSeparatedString = record[source];
    const delimiterRegex = /[,; ]/;
    const elementsArray = commaSeparatedString
        ? commaSeparatedString.split(delimiterRegex).map(item => ({item: item.trim()}))
        : [];

    return (
        <ArrayField source="items" record={{ items: elementsArray }} >
            <SingleFieldList>
                <ChipField source="item" />
            </SingleFieldList>
        </ArrayField>
    );
};
