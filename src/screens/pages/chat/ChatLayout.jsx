import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import ChatSidebar from '../../../widgets/ChatSideBar';
import ChatWindow from '../../../widgets/ChatWindow';
import MessageInput from '../../../widgets/MessageInput';
import Navbar from '../../../components/Navbar';

const ChatLayout = () => {
  // const { url } = useParams();
  //   console.log(url);
  return (
    <>
    <Navbar/>
    <Box sx={{ display: 'flex', height: '100vh', py:8 }}>
      <CssBaseline />
      <ChatSidebar />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <ChatWindow />
        <MessageInput />
      </Box>
    </Box>
    </>
  );
};

export default ChatLayout;
