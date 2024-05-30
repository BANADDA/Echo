import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Divider, CircularProgress, Snackbar,Alert} from '@mui/material';

const DeploymentModal = ({ job, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  if (!job) return null;

  const handleConfirmDeployment = async () => {
    const modelData = {
      model_id: job.baseModel,
      model_name: job.modelName
    };

    setLoading(true);

    try {
      const response = await axios.post('https://jarvis-server-1.onrender.com/deploy-model', modelData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Deployment successful:', response.data);
      setSnackbarMessage('Deployment successful wait for around 5 minutes for your model to get ready ');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error deploying model:', error);
      setSnackbarMessage('Error deploying model: ' + error.message);
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <Dialog open={Boolean(job)} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Deploy Model</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography variant="h6" component="div" gutterBottom>
            Model Specifications
          </Typography>

          <Box mb={2} p={4}>
            <Typography variant="body1"><strong>Model Name:</strong> {job.modelName}</Typography>
            <Typography variant="body1"><strong>Base Model:</strong> {job.baseModel}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleConfirmDeployment()}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Confirm Deployment'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DeploymentModal;
