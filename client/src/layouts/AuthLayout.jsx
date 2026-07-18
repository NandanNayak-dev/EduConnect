import { Outlet, useLocation } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import useEduConnect from '../hooks/useEduConnect';

const AuthLayout = () => {
  const location = useLocation();
  const { mode, toggleMode } = useEduConnect();

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <IconButton 
        onClick={toggleMode} 
        sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16, 
          zIndex: 10, 
          color: 'text.primary' 
        }}
      >
        {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
      {/* 
        We use mode="popLayout" so both components exist for a moment while one exits and one enters,
        allowing layoutId to smoothly interpolate!
      */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 1000,
          height: { xs: 'auto', md: 700 },
          minHeight: 700,
          m: 2,
          backgroundColor: 'background.paper',
          borderRadius: 0,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <AnimatePresence mode="popLayout">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default AuthLayout;
