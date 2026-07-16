import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8', // Google Blue
      light: '#8ab4f8',
      dark: '#174ea6',
      contrastText: '#fff',
    },
    secondary: {
      main: '#188038', // Google Green
      light: '#5bb974',
      dark: '#137333',
      contrastText: '#fff',
    },
    background: {
      default: '#ffffff', // Google prefers white backgrounds for content
      paper: '#ffffff',
    },
    text: {
      primary: '#202124',
      secondary: '#5f6368',
    },
    success: {
      main: '#188038',
    },
    error: {
      main: '#d93025',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Google Sans", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: {
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0.25px',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '8px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
          },
        },
        containedPrimary: {
          background: '#1a73e8',
          '&:hover': {
            background: '#174ea6',
          }
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
          border: '1px solid #dadce0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
        }
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s',
            '&:hover fieldset': {
              borderColor: '#818cf8',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4f46e5',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
          fontSize: '1rem',
          minWidth: 100,
          margin: '0 8px',
          borderRadius: '8px 8px 0 0',
          transition: 'all 0.2s',
          '&.Mui-selected': {
            color: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.05)',
          },
          '&:hover': {
            backgroundColor: 'rgba(79, 70, 229, 0.08)',
            color: '#4f46e5',
          },
        },
      },
    },
  },
});

export default theme;
