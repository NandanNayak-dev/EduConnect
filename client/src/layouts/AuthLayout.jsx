import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { AnimatePresence } from "framer-motion";

const AuthLayout = () => {
  const location = useLocation();

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorations */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "40%",
          height: "40%",
          borderRadius: "50%",
          background: "linear-gradient(to right, rgba(99,102,241,0.2), rgba(168,85,247,0.2))",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-10%",
          right: "-10%",
          width: "40%",
          height: "40%",
          borderRadius: "50%",
          background: "linear-gradient(to right, rgba(236,72,153,0.2), rgba(244,63,94,0.2))",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />
      
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
          borderRadius: 4,
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
