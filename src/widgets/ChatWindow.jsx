import React from 'react';
import { Box, Typography } from '@mui/material';

const ChatWindow = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        LLama-2 Agric Assistant
      </Typography>
      <Typography variant="body1">
        This is where the chat messages will be displayed.
      </Typography>
    </Box>
  );
};

export default ChatWindow;
