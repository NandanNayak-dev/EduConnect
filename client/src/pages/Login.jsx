import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useEffect } from "react";
import axios from "axios";
import useEduConnect from "../hooks/useEduConnect";
import AlertBox from "../../components/common/AlertBox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  // alert message
  const { setAlertBoxOpenStatus, setAlertMessage, setAlertSeverity, setLoadingStatus } =
    useEduConnect();
  // form validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  // form submit
  const onSubmit = async (data) => {
    setLoadingStatus(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/users/login`,
        data
      );
      if (response.data.status) {
        Cookies.set(import.meta.env.VITE_TOKEN_KEY, response.data.token, {
          expires: Number(import.meta.env.VITE_COOKIE_EXPIRES),
          path: "/",
        });
        Cookies.set(import.meta.env.VITE_USER_ROLE, response.data.user.role, {
          expires: Number(import.meta.env.VITE_COOKIE_EXPIRES),
          path: "/",
        });
        if (response.data.user.role === "student" || response.data.user.role === "teacher") {
          navigate("/classes");
        } else if (response.data.user.role === "admin") {
          navigate("/dashboard");
        } else {
          setAlertBoxOpenStatus(true);
          setAlertSeverity("error");
          setAlertMessage("Something Went Wrong");
        }
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage("Something Went Wrong");
      // server error message with status code
      error.response?.data?.message
        ? setAlertMessage(error.response.data.message)
        : setAlertMessage(error.message);
    } finally {
      setLoadingStatus(false);
    }
  };

  // check if user is already logged in
  useEffect(() => {
    const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
    const role = Cookies.get(import.meta.env.VITE_USER_ROLE);
    if (token && role) {
      if (role === "student" || role === "teacher") {
        navigate("/classes");
      } else if (role === "admin") {
        navigate("/dashboard");
      }
    } else {
      Cookies.remove(import.meta.env.VITE_TOKEN_KEY, { path: "" });
      Cookies.remove(import.meta.env.VITE_USER_ROLE, { path: "" });
    }
  }, []);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      sx={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
    >
      <AlertBox />
      <Grid container sx={{ height: '100%', minHeight: 600 }}>
        {/* Left Side: Login Form */}
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
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Please enter your details to sign in.
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Email"
                placeholder="Enter Email"
                variant="outlined"
                sx={{ mb: 2 }}
                {...register("email", { required: true })}
              />
              {errors.email && (
                <Typography variant="body2" sx={{ color: "error.main", mb: 2, mt: -1.5 }}>
                  {errors.email.message}
                </Typography>
              )}
              <TextField
                fullWidth
                label="Password"
                placeholder="Enter Password"
                type="password"
                variant="outlined"
                sx={{ mb: 2 }}
                {...register("password", { required: true })}
              />
              {errors.password && (
                <Typography variant="body2" sx={{ color: "error.main", mb: 2, mt: -1.5 }}>
                  {errors.password.message}
                </Typography>
              )}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  label="Remember me"
                  sx={{ color: "text.secondary" }}
                />
                <Link style={{ color: "#4f46e5", textDecoration: "none", fontWeight: "500" }} to="/forgot-password">
                  Forgot Password?
                </Link>
              </Box>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ py: 1.5, fontSize: '1.05rem', borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                Sign in
              </Button>
            </Box>

            <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 4 }}>
              Don't have an account?{" "}
              <Link to="/registration" style={{ color: "#4f46e5", textDecoration: "none", fontWeight: "600" }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Grid>

        {/* Right Side: Branding */}
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
          {/* Decorative shapes */}
          <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <Box sx={{ position: 'absolute', bottom: -100, left: -50, width: 300, height: 300, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }} />
          
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, zIndex: 1, textAlign: 'center', letterSpacing: '-1px' }}>
            EduConnect
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9, textAlign: 'center', zIndex: 1, maxWidth: '80%' }}>
            Empowering education through seamless digital connection.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
