import React from 'react';
import { Card, CardContent, Typography, Box, Container, Divider, Paper, useTheme } from '@mui/material';
import { Title } from 'react-admin';

const About: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Paper elevation={3} sx={{ p: 0, backgroundColor: '#FFF3E0', borderRadius: '8px' }}>
        <Card sx={{ border: 'none', boxShadow: 'none', backgroundColor: 'transparent' }}>
          <Title title="About Us" />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ 
              color: '#c13f27', 
              fontWeight: 'bold',
              mb: 3
            }}>
              Introduction to the eLwazi Catalogue
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
              The eLwazi Catalogue is an essential component of the platform, providing searchable metadata for datasets 
              generated and used by the DS-I Africa consortium and external organisations/projects across the African continent. 
              The catalogue FAIRifies the data science datasets in the following way:
            </Typography>
            
            <Box sx={{ ml: 2, mb: 3 }}>
              <Typography variant="body1" component="ul" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                <li><strong>Findable</strong> - through search and filter options</li>
                <li><strong>Accessible</strong> - coded to DUO (Data Use Ontology) conditions and restrictions</li>
                <li><strong>Interoperable</strong> - standardised and harmonised to the eLwazi metadata model</li>
                <li><strong>Reusable</strong> - clickable connections on datasets connect researchers to dataset providers</li>
              </Typography>
            </Box>
            
            <Box mt={5} mb={3}>
              <Typography variant="h5" gutterBottom sx={{ color: '#c13f27', fontWeight: 'bold', mb: 2 }}>
                The catalogue serves the following purposes:
              </Typography>
              <Box sx={{ ml: 2 }}>
                <Typography variant="body1" component="ul" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                  <li><strong>Centralised Repository:</strong> To provide a single platform where researchers, healthcare professionals, and policymakers can explore various African health-related data.</li>
                  <li><strong>Data Categorisation:</strong> To organise projects based on the data types they involve, making it easier for users to find datasets that align with their specific data needs, i.e. Geospatial; Demographic and Health; Omics and Image data.</li>
                  <li><strong>Regional Focus:</strong> To highlight projects that are specific to certain regions within Africa, thereby encouraging localised solutions and research.</li>
                  <li><strong>Interdisciplinary Collaboration:</strong> By listing various projects that involve different data types, the catalogue aims to foster interdisciplinary research and applications in healthcare.</li>
                  <li><strong>Transparency and Accessibility:</strong> To make health-related data more discoverable, accessible and transparent, thereby accelerating research and applications in healthcare.</li>
                  <li><strong>Institutional Support:</strong> To acknowledge and leverage the support from reputable institutions like the National Institutes of Health for credibility and resource allocation.</li>
                  <li><strong>Feedback Mechanism:</strong> The platform also has a feedback section, indicating its aim to continually evolve based on user input and needs.</li>
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 5, borderColor: '#c13f27', borderWidth: 1 }} />
            
            <Typography variant="h4" component="h1" gutterBottom sx={{ 
              color: '#c13f27', 
              fontWeight: 'bold',
              mb: 3
            }}>
              Submitting metadata to the eLwazi Catalogue
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
              Organisations and projects that would like to increase their dataset exposure findability, usability and accessibility 
              can submit a request to list information about their dataset/s on the eLwazi Catalogue. Dataset providers must commit 
              to maintaining their dataset/s metadata on the catalogue and work towards making sustainable long-term data management plans, 
              electing a Metadata Steward who will receive training and support from the eLwazi Catalogue development team.
            </Typography>
            
            <Box mt={5} mb={3}>
              <Typography variant="h5" gutterBottom sx={{ color: '#c13f27', fontWeight: 'bold', mb: 2 }}>
                Step 1: Register as a NEW organisation or project data provider
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6, ml: 2 }}>
                If you are new to the eLwazi Catalogue, you will need to identify a person who will be your Project Metadata Steward 
                responsible for managing your eLwazi metadata on the catalogue database, and you must complete an Expression of Interest form 
                <a href="https://redcap.h3abionet.org/redcap/surveys/?s=MXRD9XXXPFNKMKYT" style={{ color: '#c13f27', fontWeight: 'bold', textDecoration: 'none' }}> here</a>.
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6, ml: 2 }}>
                You will be asked to submit the following details on the form:
              </Typography>
              
              <Box sx={{ ml: 4 }}>
                <Typography variant="body1" component="ul" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                  <li>Name of affiliated consortium/network (if any)</li>
                  <li>Project Title</li>
                  <li>Principal Investigator name and email address</li>
                  <li>Dataset Type/s</li>
                  <li>Elected Metadata Steward name and email address</li>
                  <li>Project URL (if any)</li>
                  <li>Motivation for listing dataset</li>
                </Typography>
              </Box>
              
              <Typography variant="body1" paragraph sx={{ 
                fontSize: '1.1rem', 
                lineHeight: 1.6, 
                fontStyle: 'italic', 
                mt: 2, 
                ml: 2, 
                p: 2, 
                backgroundColor: 'rgba(193, 63, 39, 0.1)',
                borderLeft: '4px solid #c13f27',
                borderRadius: '4px'
              }}>
                Note: If you already have an organisation/project registered on the eLwazi catalogue and an elected project Metadata Steward, 
                please proceed directly to Step 3.
              </Typography>
            </Box>
            
            <Box mt={5} mb={3}>
              <Typography variant="h5" gutterBottom sx={{ color: '#c13f27', fontWeight: 'bold', mb: 2 }}>
                Step 2: Receive support and training from the eLwazi Catalogue development team
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6, ml: 2 }}>
                The eLwazi Catalogue development team will make contact with the elected Metadata Steward within 3-5 working days of receiving 
                the Expression of Interest form, establish a login profile to the REDCap instance hosting the catalogue backend database*.
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6, ml: 2 }}>
                Training videos for navigating the REDCap database are available 
                <a href="https://docs.google.com/document/d/1lWl-LE7gqtvy3xJc9iVazcpucSj0Ho_XC0YuIbAepUg/edit?tab=t.0#heading=h.iezi1hu3grgl" style={{ color: '#c13f27', fontWeight: 'bold', textDecoration: 'none' }}> here</a>, and guiding documentation for data entry
                <a href="https://docs.google.com/document/d/1vgta0wELV3hzo9AGn41O7xCNWmZHBO_3qkcdsXHvgcw/edit?tab=t.0#heading=h.bediety1f5te" style={{ color: '#c13f27', fontWeight: 'bold', textDecoration: 'none' }}> here</a>. These should be reviewed in advance by the elected Metadata Steward/s.
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6, ml: 2 }}>
                An online meeting will be scheduled to assist with an initial dataset submission.
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ 
                fontSize: '1.1rem', 
                lineHeight: 1.6, 
                fontStyle: 'italic', 
                mt: 2, 
                ml: 2, 
                p: 2, 
                backgroundColor: 'rgba(193, 63, 39, 0.1)',
                borderLeft: '4px solid #c13f27',
                borderRadius: '4px'
              }}>
                *Metadata Stewards will only be able to view, add, edit and delete records for their own organisation/network.
              </Typography>
            </Box>
            
            <Box mt={5} mb={3}>
              <Typography variant="h5" gutterBottom sx={{ color: '#c13f27', fontWeight: 'bold', mb: 2 }}>
                Step 3: Add or Edit Projects and Datasets
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6, ml: 2 }}>
                Metadata stewards can log in to the REDCap database and add project/s under the organisation / network of their allocated 
                Data Access Group, from there, one or more datasets can be added or edited for listing in the catalogue. Metadata Stewards 
                who may be working across multiple projects in different organisations may be allocated different data access groups which 
                can be switched between.
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6, ml: 2 }}>
                Metadata Stewards will be able to check their content on preliminary reports and then, once satisfied with their content, 
                mark it to go live on the catalogue by the following day.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Paper>
    </Container>
  );
};

export default About; 