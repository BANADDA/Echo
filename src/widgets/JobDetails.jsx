import {
  CheckCircle as CheckCircleIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Error as ErrorIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Info as InfoIcon,
  PauseCircle as PauseCircleIcon,
  Storage as StorageIcon,
  Sync as SyncIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import GraphWidget from '../wandb/wandGraphWidget';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const JobDetails = ({ job }) => {
  const convertTimestampToDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return null;
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  };

  const createdAt = convertTimestampToDate(job.createdAt);
  const finishedAt = convertTimestampToDate(job.finishedAt);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <SyncIcon sx={{ color: 'blue', animation: 'spin 2s linear infinite' }} />;
      case 'stopped':
        return <PauseCircleIcon sx={{ color: 'red' }} />;
      case 'completed':
        return <CheckCircleIcon sx={{ color: 'green' }} />;
      case 'pending':
        return <HourglassEmptyIcon sx={{ color: 'orange', animation: 'pulse 2s infinite' }} />;
      case 'failed':
        return <ErrorIcon sx={{ color: 'red' }} />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ marginBottom: '20px', padding: '20px', boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: '20px' }}>
            <Typography variant="h5" component="div">
              {job.suffix} 💡
            </Typography>
            {getStatusIcon(job.status)}
          </Box>
          <Box sx={{ backgroundColor: '#e8f5e9', padding: '16px', borderRadius: '8px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <TimelineIcon color="primary" />
                    <Typography variant="body1">
                      <strong>Model Type:</strong> {job.fineTuningType}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <StorageIcon color="primary" />
                    <Typography variant="body1">
                      <strong>Dataset ID:</strong> {job.huggingFaceId}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <InfoIcon color="primary" />
                    <Typography variant="body1">
                      <strong>Model ID:</strong> {job.baseModel}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
          {job.status !== 'pending' && job.status !== 'failed' && (
            <Box sx={{ marginTop: '20px' }}>
              <GraphWidget />
            </Box>
          )}
          <Grid container spacing={2} justifyContent="center" sx={{ marginTop: '20px' }}>
            {job.status === 'completed' && (
              <Grid item xs={6}>
                <Button variant="contained" color="secondary" startIcon={<CloudUploadIcon />} fullWidth>
                  Deploy Model
                </Button>
              </Grid>
            )}
            {job.status === 'failed' && (
              <Grid item xs={6}>
                <Button variant="contained" color="primary" startIcon={<EditIcon />} fullWidth>
                  Edit Training Job
                </Button>
              </Grid>
            )}
            {(job.status === 'failed' || job.status === 'pending') && (
              <Grid item xs={6}>
                <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} fullWidth>
                  Delete Model
                </Button>
              </Grid>
            )}
            <Grid item xs={6}>
              <Button variant="contained" color="primary" startIcon={<InfoIcon />} fullWidth>
                View More Details
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default JobDetails;
