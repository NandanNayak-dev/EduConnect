import { AppBar, Toolbar, Box, Typography, Button, ButtonGroup, IconButton, useTheme } from '@mui/material';
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import AlertBox from '../../components/common/AlertBox';
import useEduConnect from '../hooks/useEduConnect';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function NavBar({ toggleDrawer }) {
    const cookie = Cookies.get(import.meta.env.VITE_TOKEN_KEY)
    const { mode, toggleMode } = useEduConnect();
    const theme = useTheme();

    return (
        <Box>
            <AppBar position="sticky" sx={{ backgroundColor: "background.paper", color: 'text.primary', borderBottom: 1, borderColor: 'divider', padding: "0", zIndex: theme.zIndex.drawer + 1 }} elevation={0} >
                <Toolbar>
                    <Box sx={{ maxWidth: "1280px", width: "100%", marginLeft: "auto", marginRight: "auto" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {toggleDrawer && (
                                    <IconButton
                                        color="inherit"
                                        aria-label="open drawer"
                                        edge="start"
                                        onClick={toggleDrawer}
                                        sx={{ display: { md: 'none' } }}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                )}
                                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }} >
                                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: 'center' }}>
                                        <img src="./images/favicon.ico" width="45" alt="EduConnect" style={{ borderRadius: '50%' }} />
                                    <Typography
                                        sx={{
                                            fontWeight: 500,
                                            fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
                                            fontSize: '1.375rem',
                                            color: 'text.primary',
                                            letterSpacing: '0',
                                            display: { xs: 'none', sm: 'block' }
                                        }}
                                        variant="h5"
                                        component="h1"
                                    >EduConnect</Typography>
                                </Box>
                            </Link>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                                <IconButton onClick={toggleMode} color="inherit">
                                    {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                                </IconButton>
                                {
                                    cookie && (
                                        <IconButton component={Link} to="/profile" color="primary">
                                            <AccountCircleIcon fontSize="large" />
                                        </IconButton>
                                    )
                                }
                                {
                                    !cookie && (
                                        <ButtonGroup variant="contained">
                                            <Button component={Link} to="/registration" color="primary">Join</Button>
                                            <Button component={Link} to="/login" color="secondary">Login</Button>
                                        </ButtonGroup>
                                    )
                                }
                            </Box>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <AlertBox />
        </Box>
    );
}