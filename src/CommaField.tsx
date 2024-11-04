import React from 'react';
import { Chip, Box } from '@mui/material';
import { useRecordContext } from 'react-admin';

interface CountriesFieldProps {
    source: string;
}

const CountriesField = ({ source }: CountriesFieldProps) => {
    const record = useRecordContext();
    
    if (!record || !record[source]) {
        return null;
    }

    const countries = record[source].split(',').map((country: string) => country.trim());

    return (
        <Box display="flex" flexWrap="wrap" gap={1}>
            {countries.map((country: string, index: number) => (
                <Chip
                    key={`${country}-${index}`}
                    label={country}
                    size="small"
                    sx={{
                        backgroundColor: '#E5E5E5',  // Light gray background
                        color: '#000000',           // black text
                        borderRadius: '16px',       // Rounded pill shape
                        border: 'none',             // Remove outline
                        '&:hover': {
                            backgroundColor: '#D1E9FF',  // Slightly darker on hover
                        }
                    }}
                />
            ))}
        </Box>
    );
};

export default CountriesField;
