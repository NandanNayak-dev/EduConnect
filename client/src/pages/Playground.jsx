import React, { useState } from 'react';
import { Box, Typography, MenuItem, Select, Button, CircularProgress, useTheme } from '@mui/material';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const LANGUAGE_VERSIONS = {
  java: '15.0.2',
  c: '10.2.0',
  cpp: '10.2.0',
  python: '3.10.0',
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
  cpp: `#include <iostream>

int main() {
    std::cout << "Hello World" << std::endl;
    return 0;
}`,
  python: `print("Hello World")`,
};

const Playground = () => {
  const theme = useTheme();
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(CODE_SNIPPETS['python']);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(CODE_SNIPPETS[newLang]);
    setOutput('');
  };

  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput('');
    setIsError(false);

    try {
      const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
        language: language,
        version: LANGUAGE_VERSIONS[language],
        files: [
          {
            content: code,
          },
        ],
      });

      if (response.data.run.stderr) {
        setIsError(true);
        setOutput(response.data.run.stderr);
      } else {
        setOutput(response.data.run.stdout || 'Program executed successfully (no output).');
      }
    } catch (error) {
      setIsError(true);
      setOutput(error.response?.data?.message || 'An error occurred while executing the code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          💻 Code Playground
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Select
            value={language}
            onChange={handleLanguageChange}
            size="small"
            sx={{ minWidth: 150, backgroundColor: 'background.paper' }}
          >
            <MenuItem value="python">Python 3</MenuItem>
            <MenuItem value="java">Java</MenuItem>
            <MenuItem value="c">C</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
          </Select>

          <Button
            variant="contained"
            color="primary"
            onClick={handleRunCode}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
          >
            {isLoading ? 'Running...' : 'Run Code'}
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexGrow: 1, gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1, borderRadius: 2, overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
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

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
            Terminal Output
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              backgroundColor: '#1e1e1e',
              color: isError ? '#ff6b6b' : '#a6e22e',
              p: 2,
              borderRadius: 2,
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              overflowY: 'auto',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {output ? output : 'Click "Run Code" to see the output here...'}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Playground;
