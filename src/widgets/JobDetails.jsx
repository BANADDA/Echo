import {
  CalendarToday as CalendarTodayIcon,
  CloudUpload as CloudUploadIcon,
  Info as InfoIcon,
  Storage as StorageIcon,
  Timeline as TimelineIcon,
  Timer as TimerIcon,
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
import moment from 'moment';
import React from 'react';
import { Line } from 'react-chartjs-2';

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

  const data = {
    labels: ['Epoch 1', 'Epoch 2', 'Epoch 3', 'Epoch 4'],
    datasets: [
      {
        label: 'Training Accuracy',
        data: [0.75, 0.80, 0.85, 0.90],
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
      },
      {
        label: 'Validation Accuracy',
        data: [0.70, 0.78, 0.82, 0.88],
        fill: true,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        pointBackgroundColor: 'rgba(153, 102, 255, 1)',
        tension: 0.4,
      },
      {
        label: 'Training Loss',
        data: [0.45, 0.35, 0.30, 0.25],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
    },
    elements: {
      line: {
        tension: 0.4, // Smooth the lines
      },
      point: {
        radius: 3,
      },
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ marginBottom: '20px', padding: '20px', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ marginBottom: '20px' }}>
            {job.suffix} 💡
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box display="flex" flexDirection="column" gap={2}>
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
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarTodayIcon color="primary" />
                  <Typography variant="body1">
                    <strong>Train Created On:</strong> {createdAt ? moment(createdAt).format('DD-MM-YYYY HH:mm') : 'N/A'}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarTodayIcon color="primary" />
                  <Typography variant="body1">
                    <strong>Train Finished On:</strong> {finishedAt ? moment(finishedAt).format('DD-MM-YYYY HH:mm') : 'N/A'}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <TimerIcon color="primary" />
                  <Typography variant="body1">
                    <strong>Train Duration:</strong> {job.duration}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box height="300px">
                <Line data={data} options={options} />
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ marginTop: '20px' }}>
            <Grid item xs={6}>
              <Button variant="contained" color="primary" startIcon={<InfoIcon />} fullWidth>
                View More Details
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" color="secondary" startIcon={<CloudUploadIcon />} fullWidth>
                Deploy Model
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default JobDetails;
