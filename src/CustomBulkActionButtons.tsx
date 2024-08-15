import React from 'react';
import { BulkExportButton, BulkDeleteButton } from 'react-admin';

const CustomBulkActionButtons = props => {
    // You can add your own conditions here if you want to conditionally render the BulkDeleteButton
    const shouldShowDeleteButton = false; // Set this to true or false based on your criteria

    return (
        <>
            <BulkExportButton {...props} />
            {shouldShowDeleteButton && <BulkDeleteButton {...props} />}
        </>
    );
};

export default CustomBulkActionButtons;
