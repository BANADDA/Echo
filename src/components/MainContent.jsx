import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Card, CardContent, Grid, Stack, Typography,
  useTheme, useMediaQuery, Container, Tabs, Tab, Paper
} from '@mui/material';
import { styled } from '@mui/system';
import { auth } from '../auth/config/firebase-config';
import { FaCheckCircle } from 'react-icons/fa';

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  '&.learn-more': {
    backgroundColor: '#28a745',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#218838',
    },
  },
  '&.get-started': {
    borderColor: '#28a745',
    color: '#28a745',
    '&:hover': {
      backgroundColor: '#28a745',
      color: '#fff',
    },
  },
  '&.disabled': {
    color: '#B0B0B0',
    backgroundColor: '#E0E0E0',
    '&:hover': {
      backgroundColor: '#E0E0E0',
    },
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#023020',
  color: '#fff',
  borderRadius: theme.shape.borderRadius,
  height: '100%',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const StyledCardImage = styled('img')({
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  objectFit: 'cover',
});

const ListItem = styled('li')(({ theme }) => ({
  position: 'relative',
  paddingLeft: theme.spacing(3),
  marginBottom: theme.spacing(2),
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: 'MediumSeaGreen',
  },
}));

const GreenTickListItem = styled(ListItem)({
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '24px',
    height: '24px',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'mediumseagreen\'%3E%3Cpath d=\'M9.71 16.29l-3.42-3.42 1.42-1.42 2 2 5-5 1.42 1.42z\'/%3E%3C/svg%3E")',
    backgroundSize: 'cover',
    borderRadius: '50%',
    backgroundColor: 'transparent',
  },
});

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const MainContent = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleGetStartedClick = () => {
    navigate(user ? '/llms' : '/sign-in');
  };

  const services = [
    { title: 'Finetune', image: './static/img/llms.png', description: 'Personalize Llama and more, with specific data for your use-case.', action: handleGetStartedClick },
    { title: 'Provide Compute', image: './static/img/voice.png', description: 'Provide compute hardware & software and earn while in your area of comfort.', disabled: true },
    { title: 'API Inference', image: './static/img/cv.png', description: 'Deploy and chat with your fine-tuned models.', disabled: true },
    { title: 'Vision', image: './static/img/multimodal.png', description: 'Something special coming FY25.', disabled: true },
  ];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const tabContent = [
    {
      image: './static/img/LLM.jpg',
      title: 'Large Language Models',
      content: [
        'Develop, improve, and manage the lifecycle of all models in your organization.',
        'Train custom models on our hosted GPUs to save time and money.',
        'Bring your own model, leverage foundation models, or start with any of the 50k pre-trained open source models in Roboflow Universe.',
        'Distill foundations models, like BLIP, DETIC, CLIP, and more to your custom data and smaller models to improve latency.',
      ],
    },
    {
      image: './static/img/NLP.png',
      title: 'Natural Language Processing',
      content: [
        'Process and understand human language through advanced machine learning models.',
        'Sentiment analysis, entity recognition, machine translation, and more.',
        'Leverage pre-trained models from Hugging Face or fine-tune your own.',
        'Implement chatbots, virtual assistants, and other NLP applications.',
      ],
    },
    {
      image: './static/img/ComputerVision.jpg',
      title: 'Computer Vision',
      content: [
        'Analyze and interpret visual data with cutting-edge computer vision techniques.',
        'Object detection, image classification, and segmentation.',
        'Use pre-trained models or train your own with custom datasets.',
        'Applications in healthcare, automotive, security, and more.',
      ],
    },
    {
      image: './static/img/predictive.jpg',
      title: 'Regression Modeling',
      content: [
        'Predict and analyze data trends using advanced regression modeling techniques.',
        'Linear regression, logistic regression, and more.',
        'Model evaluation and validation to ensure accuracy.',
        'Use cases in finance, marketing, healthcare, and more.',
      ],
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{
        py: { xs: 4, sm: 6, md: 8 },
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Grid container spacing={4} justifyContent="center" alignItems="center" sx={{ mb: 2, minHeight: '65vh' }}>
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h1" sx={{ fontSize: { xs: '42px', sm: '50px', md: '60px', fontFamily: 'Poppins' }, color: 'black', mb: 2 }}>
              YOGPT
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', pl: 0, fontFamily: 'Poppins', fontSize: { xs: '18px', sm: '24px', md: '30px' }, color: 'black', mb: 4, lineHeight: 1.5 }}>
              <GreenTickListItem>
                Fine-Tune Model for your exact use case.
              </GreenTickListItem>
              <GreenTickListItem>
                Use any dataset from huggingface.
              </GreenTickListItem>
              <GreenTickListItem>
                No coding required.
              </GreenTickListItem>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }} sx={{ fontFamily: 'Poppins' }}>
              <StyledButton variant="contained" className="learn-more">
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </StyledButton>
              <StyledButton variant="outlined" className="get-started" onClick={handleGetStartedClick}>
                Get Started
              </StyledButton>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              component="img"
              src="./static/img/jarvis.png"
              alt="Jarvis"
              sx={{
                width: '100%',
                maxWidth: '400px',
                height: 'auto',
                borderRadius: theme.shape.borderRadius,
              }}
            />
          </Grid>
        </Grid>

        <Paper elevation={2} sx={{ padding: 4 }}>
          <Tabs value={selectedTab} onChange={handleTabChange} centered>
            {['Large Language Models', 'Natural Language Processing', 'Computer Vision', 'Regression Modeling'].map((tab, index) => (
              <Tab key={tab} label={tab} sx={{ fontFamily: 'Poppins' }} />
            ))}
          </Tabs>

          {tabContent.map((tab, index) => (
            <TabPanel value={selectedTab} index={index} key={index}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Box
                    component="img"
                    src={tab.image}
                    alt={tab.title}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: theme.shape.borderRadius,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" sx={{ mb: 2, fontFamily: 'Poppins' }}>
                    {tab.title}
                  </Typography>
                  <Box component="ul" sx={{ listStyle: 'none', pl: 0 }}>
                    {tab.content.map((point, idx) => (
                      <GreenTickListItem key={idx}>
                        <Typography variant="body1" sx={{ fontFamily: 'Poppins' }}>{point}</Typography>
                      </GreenTickListItem>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>
          ))}
        </Paper>

        <Box sx={{ textAlign: 'center', my: 4, width: '100%' }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#023020', mb: 1, fontFamily: 'Poppins' }}>
            Services
          </Typography>
          <Typography variant="subtitle2" sx={{ color: '#222121', fontWeight: 'medium', fontFamily: 'Poppins' }}>
            No Cost For Token Holders (min holding $100)
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
  {services.map((service, index) => (
    <Grid item xs={12} sm={6} md={3} key={index}>
      <StyledCard>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: 'center', flexGrow: 1 }}>
            <StyledCardImage src={service.image} alt={service.title} sx={{ mb: isMobile ? 0 : 2, mr: isMobile ? 2 : 0 }} />
            <Box sx={{ textAlign: 'left', flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontFamily: 'Poppins' }}>{service.title}</Typography>
              <Typography variant="body2" sx={{ mb: 2, fontFamily: 'Poppins' }}>{service.description}</Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center', mt: 'auto' }}>
            <StyledButton
              variant="text"
              onClick={service.action}
              disabled={service.disabled}
              className={service.disabled ? 'disabled' : ''}
              sx={{ fontFamily: 'Poppins' }}
            >
              {service.disabled ? 'Coming Soon...' : 'Get Started'}
            </StyledButton>
          </Box>
        </CardContent>
      </StyledCard>
    </Grid>
  ))}
</Grid>

      </Box>
    </Container>
  );
};

export default MainContent;
