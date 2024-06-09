import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const ChatCard = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  width: 'calc(50% - 16px)',
  boxSizing: 'border-box',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
  marginBottom: theme.spacing(2),
}));

const defaultChats = [
  { title: 'Plan a trip', description: 'I want to plan a trip to New York City.' },
  { title: 'How to make a cake', description: 'How to make a cake with chocolate and strawberries?' },
  { title: 'Business ideas', description: 'Generate 5 business ideas for a new startup company.' },
  { title: 'What is recursion?', description: 'What is recursion? Show me an example in python.' },
];

const DefaultChats = ({ onChatSelect }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
      {defaultChats.map((chat, index) => (
        <ChatCard key={index} onClick={() => onChatSelect(chat)}>
          <Typography variant="h6" noWrap>{chat.title}</Typography>
          <Typography variant="body2" noWrap>{chat.description}</Typography>
        </ChatCard>
      ))}
    </Box>
  );
};

export default DefaultChats;
