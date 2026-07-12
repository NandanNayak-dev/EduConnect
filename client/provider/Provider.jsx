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
                main: '#4f46e5', // Deep Indigo
                light: '#818cf8',
                dark: '#3730a3',
            },
            secondary: {
                main: '#e11d48', // Vibrant Rose
                light: '#fb7185',
                dark: '#be123c',
            },
            background: {
                default: mode === 'light' ? '#f8fafc' : '#0f172a',
                paper: mode === 'light' ? '#ffffff' : '#1e293b',
            }
        },
        typography: {
            fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            button: {
                textTransform: 'none',
                fontWeight: 600,
            }
        },
        shape: {
            borderRadius: 12,
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                        }
                    }
                }
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        boxShadow: mode === 'light' 
                            ? '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)'
                            : '0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.5)',
                        border: mode === 'light' ? '1px solid #e2e8f0' : '1px solid #334155',
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