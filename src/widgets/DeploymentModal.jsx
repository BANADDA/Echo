import React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Divider} from '@mui/material';

const DeploymentModal = ({ job, onClose, onConfirm }) => {
  if (!job) return null;

  return (
    <Dialog open={Boolean(job)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Deploy Model</DialogTitle>
      <Divider/>
      <DialogContent>
        <Typography variant="h6" component="div" gutterBottom>
          Model Specifications
        </Typography>
      
        <Box mb={2} p={4}>
          <Typography variant="body1"><strong>Model Name:</strong> {job.modelName}</Typography>
          <Typography variant="body1"><strong>Base Model:</strong> {job.baseModel}</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{p:4}}>
        <Button
          variant="contained"
          color="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onConfirm(job.id)}
        >
          Confirm Deployment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeploymentModal;
