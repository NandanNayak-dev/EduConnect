import React, { useState, useRef, useEffect } from 'react';
import { Box, Fab, Paper, Typography, IconButton, TextField, Button, CircularProgress, useTheme } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import Cookies from 'js-cookie';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hi there! I am the EduConnect AI Assistant. How can I help you today?' }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const theme = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/chat`, {
        messages: newMessages
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`
        }
      });

      if (response.data.status) {
        setMessages([...newMessages, { role: 'assistant', content: response.data.reply }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: "Sorry, I couldn't process that request." }]);
      }
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'assistant', content: "Error connecting to AI server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      <Fab 
        color="primary" 
        aria-label="chat" 
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: isOpen ? 'none' : 'flex'
        }}
      >
        <ChatIcon />
      </Fab>

      {isOpen && (
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 350,
            height: 500,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 3,
            zIndex: theme.zIndex.drawer + 2
          }}
        >
          <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">EduConnect AI</Typography>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'primary.contrastText' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1, bgcolor: 'background.default' }}>
            {messages.map((msg, index) => (
              <Box 
                key={index} 
                sx={{ 
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  bgcolor: msg.role === 'user' ? 'primary.main' : 'background.paper',
                  color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                  p: 1.5,
                  borderRadius: 2,
                  maxWidth: '85%',
                  boxShadow: 1,
                  whiteSpace: 'pre-wrap'
                }}
              >
                <Typography variant="body2">{msg.content}</Typography>
              </Box>
            ))}
            {isLoading && (
              <Box sx={{ alignSelf: 'flex-start', p: 1.5, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                <CircularProgress size={20} />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1 }}>
            <TextField 
              fullWidth 
              size="small" 
              placeholder="Ask me anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <IconButton color="primary" onClick={handleSend} disabled={isLoading || !input.trim()}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default ChatbotWidget;
