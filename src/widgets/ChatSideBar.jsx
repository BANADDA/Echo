import React from 'react';
import { Box, List, ListItem, ListItemText, Typography, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

const TruncatedText = styled('span')({
  display: 'block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '180px',
});

const ChatSidebar = () => {
  const previousChats = [
    'Training Large Language Models for Better Understanding',
    'Create an article about recent advancements in AI technology and its implications',
    'Analyze sports statistics and provide insights for the last decade',
  ];

  return (
    <Box sx={{ width: 280, bgcolor: 'white', borderRight: 1, borderColor: 'divider', padding: 3 }}>
        <Typography variant='h6'>Previous Chats</Typography>
      <List sx={{ justifyContent: 'center' }}>
        {previousChats.map((chat, index) => (
          <React.Fragment key={index}>
            <ListItem button sx={{ bgcolor: 'gray', borderRadius: 1, mb: 1 }}>
              <ListItemText
                primary={<TruncatedText>{chat}</TruncatedText>}
              />
            </ListItem>
            {index < previousChats.length - 1 && <Divider sx={{ borderColor: 'white' }} />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default ChatSidebar;
