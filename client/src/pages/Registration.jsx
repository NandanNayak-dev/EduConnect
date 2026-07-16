import { Box, Typography, TextField, Button, Divider, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useEffect } from "react";
import Cookies from "js-cookie";
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
    <Box height="100vh" sx={{ display: "flex", alignItems: 'center', justifyContent: 'center', backgroundColor: "#f0f2f5" }}>
      <AlertBox />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, md: 4 },
          width: '100%',
          maxWidth: '450px'
        }}
      >
        <Box sx={{ width: '100%', backgroundColor: '#fff', p: { xs: 4, md: 5 }, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', border: '1px solid #dadce0', textAlign: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 400, color: '#202124', mb: 1 }}>
            Create Account
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
            to continue to EduConnect
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextField
              fullWidth
              label="Full Name"
              placeholder="Enter Full Name"
              variant="outlined"
              sx={{ mb: 2 }}
              {...register("fullName", { required: true })}
            />
              {errors.fullName && (
                <Typography
                  variant="p"
                  component="p"
                  sx={{ color: "red", mb: 2 }}
                >
                  {errors.fullName.message}
                </Typography>
              )}
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
              sx={{ mb: 2 }}
              {...register("password", { required: true })}
            />
              {errors.password && (
                <Typography variant="p" component="p" sx={{ color: "red", mb: 2 }}>
                  {errors.password.message}
                </Typography>
              )}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Role</InputLabel>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Role"
                      sx={{ borderRadius: 2 }}
                    >
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
                    sx={{ mb: 2 }}
                    {...register("usn")}
                  />
                  {errors.usn && (
                    <Typography variant="p" component="p" sx={{ color: "red", mb: 2 }}>
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
                sx={{ mt: 2, py: 1.5, fontSize: '1.1rem' }}
              >
                Join
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
            Already have an account?
            <Link to="/login" style={{ color: "#06b6d4", marginLeft: "8px", textDecoration: "none", fontWeight: "600" }}>
              Log In
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Registration;
