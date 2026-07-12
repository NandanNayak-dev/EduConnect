import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useEduConnect from "../../src/hooks/useEduConnect";
import axios from "axios";
import Cookies from "js-cookie";

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useEduConnect();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const handleMouseDownPassword = (event) => event.preventDefault();

  const onSubmit = async (data) => {
    try {
      setLoadingStatus(true);
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/users/change-password`,
        data,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );
      if (response.data.status) {
        reset();
      }
      setLoadingStatus(false);
      setAlertBoxOpenStatus(true);
      setAlertSeverity(response.data.status ? "success" : "error");
      setAlertMessage(response.data.message);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoadingStatus(false);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage("Something Went Wrong");
      error.response.data.message
        ? setAlertMessage(error.response.data.message)
        : setAlertMessage(error.message);
    } finally {
      setLoadingStatus(false);
    }
  };

  const validateNewPassword = (value) => {
    if (!value || value.length < 8) return "Password must be at least 8 characters long";
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    return regex.test(value) || "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
  };

  const validateRetypePassword = (value) => {
    return value === watch("newPassword") || "Passwords do not match";
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box mb={1}>
        <TextField
          label="Current Password"
          fullWidth
          variant="outlined"
          type={showOldPassword ? "text" : "password"}
          {...register("oldPassword", { required: "Current password is required" })}
          error={!!errors.oldPassword}
          helperText={errors.oldPassword ? errors.oldPassword.message : ""}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showOldPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box mb={1}>
        <TextField
          label="New Password"
          fullWidth
          variant="outlined"
          type={showNewPassword ? "text" : "password"}
          {...register("newPassword", {
            required: "New password is required",
            validate: validateNewPassword,
          })}
          error={!!errors.newPassword}
          helperText={errors.newPassword ? errors.newPassword.message : ""}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showNewPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box mb={3}>
        <TextField
          label="Confirm New Password"
          fullWidth
          variant="outlined"
          type={showRetypePassword ? "text" : "password"}
          {...register("retypePassword", {
            required: "Please confirm your new password",
            validate: validateRetypePassword,
          })}
          error={!!errors.retypePassword}
          helperText={errors.retypePassword ? errors.retypePassword.message : ""}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowRetypePassword(!showRetypePassword)}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showRetypePassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Button
        variant="contained"
        type="submit"
        size="large"
        sx={{
          py: 1.5,
          borderRadius: 2,
          fontWeight: 700,
          textTransform: 'none',
          letterSpacing: 0.5,
          boxShadow: 'none',
          "&:hover": { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
        }}
      >
        Update Password
      </Button>
    </Box>
  );
};

export default ChangePassword;
