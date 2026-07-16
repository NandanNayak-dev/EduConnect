import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
} from "@mui/material";
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
  const { setAlertBoxOpenStatus, setAlertMessage, setAlertSeverity } =
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
      error.response.data.message
        ? setAlertMessage(error.response.data.message)
        : setAlertMessage(error.message);
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
    <Box height="100vh" sx={{ display: "flex", backgroundColor: "background.default" }}>
      <AlertBox />
      {/* Left Side Illustration */}
      <Box
        sx={{
          flex: "1",
          display: { xs: 'none', md: 'flex' },
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "primary.main",
          backgroundImage: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Circles */}
        <Box sx={{ position: 'absolute', top: '-10%', left: '-10%', width: '300px', height: '300px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }} />
        <Box sx={{ position: 'absolute', bottom: '-15%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)' }} />
        <Box sx={{ p: 6, zIndex: 1, color: 'white', textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>EduConnect</Typography>
          <Typography variant="h5" sx={{ fontWeight: '300', opacity: 0.9 }}>Inspiring Perspectives, Connecting Ideas.</Typography>
        </Box>
      </Box>

      {/* Right Side Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, md: 4 }
        }}
      >
        <Box className="glass-panel" sx={{ width: '100%', maxWidth: '450px', p: { xs: 4, md: 6 }, borderRadius: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            className="text-gradient"
            sx={{ fontSize: "2.5rem", fontWeight: "bold", mb: 1 }}
          >
            Welcome Back
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            Please log in to continue your journey.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextField
              fullWidth
              label="Email"
              placeholder="Enter Email"
              variant="outlined"
              sx={{ mb: 2 }}
              {...register("email", { required: true })}
            />
              {errors.email && (
                <Typography
                  variant="p"
                  component="p"
                  sx={{ color: "red", mb: 2 }}
                >
                  {errors.email.message}
                </Typography>
              )}
            <TextField
              fullWidth
              label="Password"
              placeholder="Enter Password"
              type="password"
              variant="outlined"
              sx={{ mb: 1 }}
              {...register("password", { required: true })}
            />
              {errors.password && (
                <Typography variant="p" component="p" sx={{ color: "red" }}>
                  {errors.password.message}
                </Typography>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  label="Remember me"
                  sx={{ mt: 1, color: "gray" }}
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
                sx={{ mt: 4, py: 1.5, fontSize: '1.1rem' }}
              >
                Log In
              </Button>
          </Box>
          
          <Divider sx={{ my: 4, color: "text.secondary" }}>OR</Divider>
          
          <Button
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<GoogleIcon />}
            sx={{ py: 1.5, borderColor: '#e2e8f0', color: 'text.primary', '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' } }}
          >
            Continue With Google
          </Button>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mt: 4 }}>
            Don't have an account?
            <Link
              to="/registration"
              style={{ color: "#06b6d4", marginLeft: "8px", textDecoration: "none", fontWeight: "600" }}
            >
              Join Now
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
