import React from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Container, Box, Grid, Card, CardContent, Stack 
} from '@mui/material';
import { 
  RateReview as FeedbackIcon, 
  Insights as AnalyticsIcon, 
  Speed as FastIcon, 
  ArrowForward as ArrowIcon 
} from '@mui/icons-material';

function LandingPage({ onNavigateToLogin }) {
  const features = [
    {
      icon: <FeedbackIcon color="primary" sx={{ fontSize: 40 }} />,
      title: "Easy Collection",
      desc: "Deploy widgets and forms instantly to gather real-time user insights."
    },
    {
      icon: <AnalyticsIcon color="secondary" sx={{ fontSize: 40 }} />,
      title: "Smart Analytics",
      desc: "Visualize trends and process sentiment analysis using native tools."
    },
    {
      icon: <FastIcon color="success" sx={{ fontSize: 40 }} />,
      title: "Instant Response",
      desc: "Close the feedback loop immediately with automated team alerts."
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="inherit" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 0 } }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <FeedbackIcon color="primary" />
              <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                FeedBackCollection
              </Typography>
            </Stack>
            <Button variant="contained" size="small" sx={{ px: { sm: 3 } }} onClick={onNavigateToLogin}>
              Sign In
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: { xs: 6, sm: 8, md: 12 }, mb: { xs: 6, md: 8 }, flexGrow: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography 
              variant="h2" 
              component="h1" 
              fontWeight="800" 
              gutterBottom 
              sx={{ 
                fontSize: { xs: '2.2rem', sm: '3rem', md: '3.5rem' }, 
                color: '#1e293b',
                lineHeight: 1.2
              }}
            >
              Collect feedback that actually <span style={{ color: '#3b82f6' }}>drives growth</span>
            </Typography>
            
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                mb: 4, 
                fontWeight: '400', 
                lineHeight: 1.6,
                fontSize: { xs: '1rem', sm: '1.15rem' },
                px: { xs: 2, md: 0 }
              }}
            >
              Turn raw user opinions into actionable structural insights. Gather, track, and analyze user experiences across all your web ecosystems seamlessly.
            </Typography>

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              alignItems="center"
              sx={{ px: { xs: 4, sm: 0 } }}
            >
              <Button 
                variant="contained" 
                size="large" 
                fullWidth={{ xs: true, sm: false }}
                endIcon={<ArrowIcon />} 
                onClick={onNavigateToLogin}
                sx={{ py: 1.5, px: 4 }}
              >
                Get Started 
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ mb: { xs: 8, md: 12 } }}>
        <Grid container spacing={4}>
          {features.map((feat, index) => (
            <Grid size={{xs:12,sm:6,md:4}} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', 
                  borderRadius: 3, 
                  transition: '0.3s', 
                  '&:hover': { transform: 'translateY(-5px)' } 
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4 }, textAlign: { xs: 'center', sm: 'left' } }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                    {feat.icon}
                  </Box>
                  <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.3rem', sm: '1.5rem' } }}>
                    {feat.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.925rem', sm: '1rem' } }}>
                    {feat.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box component="footer" sx={{ py: 3, borderTop: '1px solid #e2e8f0', bgcolor: '#ffffff', mt: 'auto' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} FeedBackCollection Inc. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;