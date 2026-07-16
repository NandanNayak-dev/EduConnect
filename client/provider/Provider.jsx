import { PropTypes } from "prop-types";
import { createContext, useState, useMemo, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

export const EduConnectContext = createContext(null);

const Provider = ({ children }) => {
    const [alertBoxOpenStatus, setAlertBoxOpenStatus] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [loadingStatus, setLoadingStatus] = useState(false);
    
    // Theme Mode State
    const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');

    const toggleMode = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        localStorage.setItem('themeMode', newMode);
    };

    // Custom MUI Theme
    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            primary: {
                main: '#1a73e8', // Google Blue
                light: '#8ab4f8',
                dark: '#174ea6',
            },
            secondary: {
                main: '#188038', // Google Green
                light: '#5bb974',
                dark: '#137333',
            },
            background: {
                default: mode === 'light' ? '#ffffff' : '#202124',
                paper: mode === 'light' ? '#ffffff' : '#2d2e30',
            },
            text: {
                primary: mode === 'light' ? '#202124' : '#e8eaed',
                secondary: mode === 'light' ? '#5f6368' : '#9aa0a6',
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
            button: {
                textTransform: 'none',
                fontWeight: 500,
                letterSpacing: '0.25px',
            }
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
                        }
                    },
                    containedPrimary: {
                        background: mode === 'light' ? '#1a73e8' : '#8ab4f8',
                        color: mode === 'light' ? '#fff' : '#202124',
                        '&:hover': {
                            background: mode === 'light' ? '#174ea6' : '#d2e3fc',
                        }
                    }
                }
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
                        border: mode === 'light' ? '1px solid #dadce0' : '1px solid #5f6368',
                        backgroundImage: 'none',
                    }
                }
            }
        }
    }), [mode]);

    const contextValue = {
        alertBoxOpenStatus,
        setAlertBoxOpenStatus,
        alertSeverity,
        setAlertSeverity,
        loadingStatus,
        setLoadingStatus,
        alertMessage,
        setAlertMessage,
        mode,
        toggleMode
    };

    return (
        <EduConnectContext.Provider value={contextValue}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </EduConnectContext.Provider>
    );
}

Provider.propTypes = {
    children: PropTypes.node.isRequired
}

export default Provider;