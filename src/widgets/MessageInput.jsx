import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const MessageInput = () => {
  return (
    <Box sx={{ p: 2, display: 'flex', borderTop: 1, borderColor: 'divider' }}>
      <TextField
        variant="outlined"
        placeholder="Type a message"
        fullWidth
        sx={{ mr: 2 }}
      />
      <IconButton color="primary" aria-label="send">
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default MessageInput;
