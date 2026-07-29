import React, { useState } from 'react';
import { Box, Typography, MenuItem, Select, Button, CircularProgress, useTheme, Paper } from '@mui/material';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TerminalIcon from '@mui/icons-material/Terminal';
import CodeIcon from '@mui/icons-material/Code';

const LANGUAGE_VERSIONS = {
  java: '15.0.2',
  python: '3.10.0',
  c: '10.2.0',
};

const CODE_SNIPPETS = {
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,
  c: `#include <stdio.h>

int main() {
    printf("Hello World\n");
    return 0;
}`,
  python: `print("Hello World")`,
};

const Playground = () => {
  const theme = useTheme();
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(CODE_SNIPPETS['python']);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(CODE_SNIPPETS[newLang]);
    setOutput('');
    setInput('');
  };

  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput('');
    setIsError(false);

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/execute`, {
        language: language,
        code: code,
        input: input
      }, { headers: { Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}` } });

      if (response.data.stderr) {
        setIsError(true);
        setOutput(response.data.stderr);
      } else {
        setOutput(response.data.stdout || 'Program executed successfully (no output).');
      }
    } catch (error) {
      setIsError(true);
      setOutput(error.response?.data?.message || 'An error occurred while executing the code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, height: { xs: 'auto', md: 'calc(100vh - 64px)' }, minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f8fafc' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: 2, backgroundColor: 'primary.main', display: 'flex', color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CodeIcon />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
            Code Playground
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Select
            value={language}
            onChange={handleLanguageChange}
            size="small"
            sx={{ 
              minWidth: 160, 
              backgroundColor: 'background.paper',
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.divider },
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            <MenuItem value="python">Python 3</MenuItem>
            <MenuItem value="java">Java</MenuItem>
            <MenuItem value="c">C</MenuItem>
          </Select>

          <Button
            variant="contained"
            color="primary"
            onClick={handleRunCode}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            {isLoading ? 'Executing...' : 'Run Code'}
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexGrow: 1, gap: 3, flexDirection: { xs: 'column', md: 'row' }, minHeight: 0 }}>
        <Paper elevation={0} sx={{ flex: 1.5, minHeight: { xs: '400px', md: 'auto' }, borderRadius: 3, overflow: 'hidden', border: `1px solid ${theme.palette.divider}`, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f1f5f9', display: 'flex', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f56' }} />
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#27c93f' }} />
          </Box>
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            <Editor
            height="100%"
            language={language === 'c' || language === 'cpp' ? 'cpp' : language}
            value={code}
            onChange={(value) => setCode(value)}
            theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              wordWrap: 'on',
              automaticLayout: true,
            }}
          />
          </Box>
        </Paper>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minHeight: { xs: '500px', md: 'auto' } }}>
          <Paper elevation={0} sx={{ flex: 1, borderRadius: 3, overflow: 'hidden', border: `1px solid ${theme.palette.divider}`, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f1f5f9', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Custom Input
              </Typography>
            </Box>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your input here..."
              style={{
                flexGrow: 1,
                padding: '16px',
                border: 'none',
                resize: 'none',
                outline: 'none',
                backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#fff',
                color: theme.palette.text.primary,
                fontFamily: '"Fira Code", monospace',
                fontSize: '14px'
              }}
            />
          </Paper>

          <Paper elevation={0} sx={{ flex: 1, borderRadius: 3, overflow: 'hidden', border: `1px solid ${theme.palette.divider}`, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f1f5f9', display: 'flex', alignItems: 'center', gap: 1 }}>
              <TerminalIcon fontSize="small" color="action" />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Terminal Output
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                backgroundColor: '#0d1117',
                color: isError ? '#ff7b72' : '#56d364',
                p: 3,
                fontFamily: '"Fira Code", monospace',
                fontSize: '14px',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                overflowY: 'auto',
              }}
            >
              {output ? output : <Typography sx={{ color: '#8b949e', fontStyle: 'italic', fontSize: '14px', fontFamily: 'inherit' }}>Waiting for code execution...</Typography>}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Playground;
