import React, { useState } from "react";
import { Box, Button, TextField, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import useEduConnect from "../hooks/useEduConnect";
import axios from "axios";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const { setAlertBoxOpenStatus, setAlertSeverity, setAlertMessage, setLoadingStatus, loadingStatus } = useEduConnect();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoadingStatus(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/users/forgot-password`, { email });
      if (res.data.status) {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage(res.data.message);
        setStep(2);
      }
    } catch (error) {
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return;
    setLoadingStatus(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/users/verify-otp`, { email, otp });
      if (res.data.status) {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage(res.data.message);
        setStep(3);
      }
    } catch (error) {
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return;
    setLoadingStatus(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/users/reset-password`, { email, otp, newPassword });
      if (res.data.status) {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage(res.data.message);
        navigate('/login');
      }
    } catch (error) {
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      sx={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
    >
      <Grid container sx={{ height: '100%', minHeight: 600 }}>
        <Grid
          item
          xs={12}
          md={6}
          component={motion.div}
          layoutId="auth-form"
          transition={{ duration: 0.7, ease: "easeInOut" }}
          sx={{ 
            p: { xs: 4, md: 8 }, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            backgroundColor: 'background.paper',
            zIndex: 2,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1, letterSpacing: '-0.5px' }}>
              Reset Password
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {step === 1 && "Enter your email address to receive an OTP."}
              {step === 2 && "Enter the 6-digit OTP sent to your email."}
              {step === 3 && "Enter your new password."}
            </Typography>

            {step === 1 && (
              <Box component="form" onSubmit={handleSendOtp}>
                <TextField
                  fullWidth
                  label="Email"
                  placeholder="Enter Email"
                  variant="outlined"
                  sx={{ mb: 3 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loadingStatus}
                  sx={{ py: 1.5, fontSize: '1.05rem', borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  {loadingStatus ? "Sending..." : "Send OTP"}
                </Button>
              </Box>
            )}

            {step === 2 && (
              <Box component="form" onSubmit={handleVerifyOtp}>
                <TextField
                  fullWidth
                  label="OTP"
                  placeholder="Enter 6-digit OTP"
                  variant="outlined"
                  sx={{ mb: 3 }}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loadingStatus}
                  sx={{ py: 1.5, fontSize: '1.05rem', borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  {loadingStatus ? "Verifying..." : "Verify OTP"}
                </Button>
              </Box>
            )}

            {step === 3 && (
              <Box component="form" onSubmit={handleResetPassword}>
                <TextField
                  fullWidth
                  label="New Password"
                  placeholder="Enter New Password"
                  variant="outlined"
                  type="password"
                  sx={{ mb: 3 }}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loadingStatus}
                  sx={{ py: 1.5, fontSize: '1.05rem', borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  {loadingStatus ? "Resetting..." : "Reset Password"}
                </Button>
              </Box>
            )}

            <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 4 }}>
              Remember your password?{" "}
              <Link to="/login" style={{ color: "#4f46e5", textDecoration: "none", fontWeight: "600" }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          component={motion.div}
          layoutId="auth-branding"
          transition={{ duration: 0.7, ease: "easeInOut" }}
          sx={{
            background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 6,
            color: '#fff',
            position: 'relative',
            zIndex: 1,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <Box sx={{ position: 'absolute', bottom: -100, left: -50, width: 300, height: 300, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }} />
          <Box sx={{ zIndex: 2, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, letterSpacing: '-1px' }}>EduConnect</Typography>
            <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9, maxWidth: 400 }}>
              Secure password recovery to get you back to learning.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ForgotPassword;
