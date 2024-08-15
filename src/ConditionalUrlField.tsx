import React from 'react';
import { useRecordContext, UrlField } from 'react-admin';

const ConditionalUrlField = ({ source }) => {
    const record = useRecordContext();
    const text = record ? record[source] : '';

    // Simple URL validation function
    const isValidUrl = (urlString) => {
        try {
            new URL(urlString);
            return true;
        } catch (err) {
            return false;
        }
    };

    if (!text || !isValidUrl(text)) {
        return null; // Return null if there is no valid URL
    }

    return (
        <div>
            <UrlField record={record} source={source} />
        </div>
    );
};

export default ConditionalUrlField;
