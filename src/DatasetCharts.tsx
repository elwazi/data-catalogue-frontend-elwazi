import React, { useEffect, useState } from 'react';
import { useDataProvider, useTheme } from 'react-admin';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';

// Theme colors based on the website's theme
// Primary: #c13f27 (red)
// Secondary: #fcc300 (yellow/gold)
// Background: #FFF3E0 (light orange/cream)
const THEME_COLORS = [
  '#c13f27', // Primary red
  '#fcc300', // Secondary yellow/gold
  '#e57373', // Lighter red
  '#ffb74d', // Orange
  '#81c784', // Green
  '#64b5f6', // Blue
  '#9575cd', // Purple
  '#f06292', // Pink
  '#4db6ac', // Teal
  '#ff8a65', // Deep orange
];

// Interface for dataset records
interface DatasetRecord {
  id: string | number;
  d_name?: string;
  d_category?: string;
  d_type?: string;
  d_countries?: string;
  sample_size?: number | string;
  data_use_permission?: string;
  [key: string]: any;
}

// Interface for chart data
interface ChartData {
  name: string;
  value: number;
}

// Interface for component props
interface DatasetChartsProps {
  filter?: Record<string, any>;
}

export const DatasetCharts: React.FC<DatasetChartsProps> = ({ filter = {} }) => {
  const dataProvider = useDataProvider();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [datasets, setDatasets] = useState<DatasetRecord[]>([]);
  const [countriesData, setCountriesData] = useState<ChartData[]>([]);
  const [typesData, setTypesData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch datasets with pagination and apply the current filter
        const { data } = await dataProvider.getList('datasets', {
          pagination: { page: 1, perPage: 1000 }, // Adjust as needed
          sort: { field: 'id', order: 'ASC' },
          filter: filter, // Use the filter prop
        });
        
        setDatasets(data);
        
        // Process data for countries chart
        const countriesMap = new Map<string, number>();
        // Process data for types chart
        const typesMap = new Map<string, number>();
        
        data.forEach((dataset: DatasetRecord) => {
          // Process countries (comma-separated values)
          if (dataset.d_countries) {
            const countries = dataset.d_countries.split(',').map(c => c.trim());
            countries.forEach(country => {
              if (country) {
                countriesMap.set(country, (countriesMap.get(country) || 0) + 1);
              }
            });
          }
          
          // Process types
          if (dataset.d_type) {
            typesMap.set(dataset.d_type, (typesMap.get(dataset.d_type) || 0) + 1);
          }
        });
        
        // Convert maps to arrays for charts
        const countriesArray: ChartData[] = Array.from(countriesMap.entries())
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value) // Sort by count descending
          .slice(0, 10); // Take top 10 countries
        
        const typesArray: ChartData[] = Array.from(typesMap.entries())
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);
        
        setCountriesData(countriesArray);
        setTypesData(typesArray);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [dataProvider, filter]); // Add filter to dependency array to re-fetch when filters change
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress style={{ color: '#c13f27' }} />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  
  // Custom tooltip styles
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper elevation={3} sx={{ p: 1, backgroundColor: '#FFF3E0', border: '1px solid #c13f27' }}>
          <Typography variant="body2" sx={{ color: '#c13f27', fontWeight: 'bold' }}>
            {label}
          </Typography>
          <Typography variant="body2" sx={{ color: '#333' }}>
            {`${payload[0].name}: ${payload[0].value}`}
          </Typography>
        </Paper>
      );
    }
    return null;
  };
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 2, height: '100%', backgroundColor: '#FFF3E0', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#c13f27', fontWeight: 'bold' }}>
            Datasets by Country
          </Typography>
          <ResponsiveContainer width="100%" height={600}>
            <BarChart
              data={countriesData}
              margin={{ top: 20, right: 30, left: 20, bottom: 160 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end"
                height={100}
                interval={0}
                tick={{ fill: '#333' }}
              />
              <YAxis tick={{ fill: '#333' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  color: '#333',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
                verticalAlign="bottom"
                height={36}
              />
              <Bar 
                dataKey="value" 
                name="Number of Datasets" 
                fill="#c13f27" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 2, height: '100%', backgroundColor: '#FFF3E0', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#c13f27', fontWeight: 'bold' }}>
            Datasets by Type
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={typesData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#c13f27"
                dataKey="value"
              >
                {typesData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={THEME_COLORS[index % THEME_COLORS.length]} 
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [value, 'Datasets']}
                contentStyle={{ backgroundColor: '#FFF3E0', border: '1px solid #c13f27' }}
                itemStyle={{ color: '#c13f27' }}
              />
              <Legend 
                formatter={(value, entry, index) => (
                  <span style={{ color: '#333' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DatasetCharts; 