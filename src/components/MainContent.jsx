import { AppBar, Button, Card, CardContent, Container, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../auth/config/firebase-config';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    color: '#fff',
    minHeight: '100vh',
    padding: theme.spacing(0),
  },
  appBar: {
    marginTop: "0px",
    boxShadow: 'none',
    padding: theme.spacing(2, 0),
    textAlign: 'center',
    backgroundColor: '#E9F9E9',
    paddingRight: "10px",
    paddingLeft: "10px",
    color: "black"
  },
  tabs: {
    marginBottom: theme.spacing(2),
    borderBottom: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(3),
  },
  tab: {
    marginTop: "20px",
    textTransform: 'none',
    minWidth: 100,
    fontSize: "12px",
    fontWeight: '600',
    color: '#313C2D',
    '&:hover': {
      color: '#000',
      opacity: 1,
    },
  },
  selectedTab: {
    color: '#000',
    borderBottom: '2px solid #000',
  },
  cardContainer: {
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  card: {
    backgroundColor: '#023020',
    color: '#fff',
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  cardContent: {
    display: 'flex',
    alignItems: 'center',
  },
  cardImage: {
    width: '100px',
    height: '100px',
    marginRight: theme.spacing(2),
    borderRadius: '50%',
    objectFit: 'cover',
  },
  featured: {
    marginBottom: theme.spacing(1),
    fontWeight: 'bold',
    color: '#023020',
  },
  title: {
    color: '#031201',
    fontWeight: "bold",
    marginBottom: theme.spacing(4),
  },
  subtitle: {
    color: '#363535',
    fontWeight: "medium",
    marginBottom: theme.spacing(4),
  },
  subtitle2: {
    color: '#222121',
    fontWeight: "medium",
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(1),
    color: '#E9F9E9',
    '&:hover': {
      color: '#023020',
      backgroundColor: '#D8F5D8',
    },
  },
}));

const MainContent = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleGetStartedClick = () => {
    if (user) {
      navigate('/llms');
    } else {
      navigate('/sign-in');
    }
  };

  return (
    <Container className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Typography variant="h3" className={classes.title}>
          Jarvis
        </Typography>
        <Typography variant="subtitle1" className={classes.subtitle}>
          Fine-Tune models for you&apos;re exact use case. Use any dataset from huggingface. No coding required 
        </Typography>
        <div className="self-center mt-auto">
          <button className="inline-flex items-center justify-center px-8 py-2 bg-green-900 hover:bg-green-850 focus:outline-none focus:ring-4 focus:ring-green-850 focus:ring-opacity-50 text-white text-sm font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out group">
            Learn More
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
            </svg>
          </button>
        </div>
      </AppBar>
      <div className={classes.tabs}>
        <Typography variant="body1" className={classes.tab}>Large Language Models</Typography>
        <Typography variant="body1" className={classes.tab}>Natural Language Processing</Typography>
        <Typography variant="body1" className={classes.tab}>Computer Vision</Typography>
        <Typography variant="body1" className={classes.tab}>Regression Modeling</Typography>
      </div>
      <Typography variant="h5" className={classes.featured}>
        Services
      </Typography>
      <Typography variant="subtitle2" className={classes.subtitle2}>
        No Cost For Token Holders (min holding $100)
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} className={classes.cardContainer}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <img src="./static/img/llms.png" alt="Math Solver" className={classes.cardImage} />
              <div>
                <Typography variant="h6">Finetune</Typography>
                <Typography variant="body2" gutterBottom>
                  Personalize Llama and more, with specific data for your use-case
                </Typography>
                <Button className={classes.button} variant="text" onClick={handleGetStartedClick}>Get Started</Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} className={classes.cardContainer}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <img src="./static/img/voice.png" alt="SQL Expert" className={classes.cardImage} />
              <div>
                <Typography variant="h6">Provide Compute</Typography>
                <Typography variant="body2" gutterBottom>
                  Provide compute hardware & software and earn while in your area of comfort
                </Typography>
                <Button className={classes.button} variant="text">Coming Soon...</Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} className={classes.cardContainer}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <img src="./static/img/cv.png" alt="Framework Finder" className={classes.cardImage} />
              <div>
                <Typography variant="h6">API Inference</Typography>
                <Typography variant="body2" gutterBottom>
                  Deploy and chat with your fine-tuned models
                </Typography>
                <Button className={classes.button} variant="text">Coming Soon...</Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} className={classes.cardContainer}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <img src="./static/img/multimodal.png" alt="Adobe Express" className={classes.cardImage} />
              <div>
                <Typography variant="h6">Vision</Typography>
                <Typography variant="body2" gutterBottom>
                  Something special coming FY25
                </Typography>
                <Button className={classes.button} variant="text">Coming Soon...</Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MainContent
