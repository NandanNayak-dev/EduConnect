import { Box, Typography, TextField, Button, Divider, FormControl, InputLabel, Select, MenuItem, Grid } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import useEduConnect from "../hooks/useEduConnect";
import AlertBox from "../../components/common/AlertBox";

const schema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  role: yup.string().oneOf(["student", "teacher"]).required("Role is required"),
  usn: yup.string().when('role', {
    is: 'student',
    then: (schema) => schema.required('USN is required for students'),
    otherwise: (schema) => schema.notRequired(),
  })
});

const Registration = () => {
  // alert message
  const navigate = useNavigate();
  const { setAlertBoxOpenStatus, setAlertMessage, setAlertSeverity } =
    useEduConnect();
  // form validation
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "student",
      usn: "",
    },
    resolver: yupResolver(schema),
  });
  // form submit
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/users/registration`,
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
        {/* Left Side: Branding */}
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
            Start your journey with us today.
          </Typography>
        </Grid>

        {/* Right Side: Registration Form */}
        <Grid
          item
          xs={12}
          md={6}
          component={motion.div}
          layoutId="auth-form"
          transition={{ duration: 0.7, ease: "easeInOut" }}
          sx={{ 
            p: { xs: 4, md: 6 }, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            backgroundColor: 'background.paper',
            zIndex: 2,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1, letterSpacing: '-0.5px' }}>
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Join EduConnect to start your journey.
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Full Name"
                placeholder="Enter Full Name"
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                {...register("fullName", { required: true })}
              />
              {errors.fullName && (
                <Typography variant="body2" sx={{ color: "error.main", mb: 2, mt: -1.5 }}>
                  {errors.fullName.message}
                </Typography>
              )}
              <TextField
                fullWidth
                label="Email"
                placeholder="Enter Email"
                variant="outlined"
                size="small"
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
                size="small"
                sx={{ mb: 2 }}
                {...register("password", { required: true })}
              />
              {errors.password && (
                <Typography variant="body2" sx={{ color: "error.main", mb: 2, mt: -1.5 }}>
                  {errors.password.message}
                </Typography>
              )}
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Role</InputLabel>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Role" sx={{ borderRadius: 2 }}>
                      <MenuItem value="student">I am a Student</MenuItem>
                      <MenuItem value="teacher">I am a Teacher</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
              {watch("role") === "student" && (
                <>
                  <TextField
                    fullWidth
                    label="USN"
                    placeholder="Enter USN"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                    {...register("usn")}
                  />
                  {errors.usn && (
                    <Typography variant="body2" sx={{ color: "error.main", mb: 2, mt: -1.5 }}>
                      {errors.usn.message}
                    </Typography>
                  )}
                </>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ py: 1.2, fontSize: '1.05rem', borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                Join Now
              </Button>
            </Box>

            <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 3 }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#4f46e5", textDecoration: "none", fontWeight: "600" }}>
                Log In
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Registration;
