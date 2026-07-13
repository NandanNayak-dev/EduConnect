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
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "student",
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
          path: "",
        });
        Cookies.set(import.meta.env.VITE_USER_ROLE, response.data.user.role, {
          expires: Number(import.meta.env.VITE_COOKIE_EXPIRES),
          path: "",
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
    <>
      <Box height="100vh" sx={{ display: "flex" }}>
        <Box
          sx={{
            flex: "1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <img src="/images/auth.jpg" alt="" />
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            backgroundColor: "background.paper",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <AlertBox />
          <Box width={1 / 2} mx="auto" my="auto">
            <Typography
              variant="h2"
              component="h2"
              sx={{ color: "text.primary", fontSize: "2.25rem", fontWeight: "bold" }}
            >
              Join Now
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 4 }}
            >
              <TextField
                fullWidth
                placeholder="Enter Full Name"
                sx={{
                  mb: 1,
                  color: "text.primary",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "divider",
                    },
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "divider",
                    },
                  },
                  "& .MuiInputLabel-outlined": {
                    color: "text.primary",
                  },
                  "& .MuiInputBase-input": {
                    "&::placeholder": {
                      color: "text.primary",
                    },
                  },
                }}
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
                placeholder="Enter Email"
                sx={{
                  mb: 1,
                  color: "text.primary",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "divider",
                    },
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "divider",
                    },
                  },
                  "& .MuiInputLabel-outlined": {
                    color: "text.primary",
                  },
                  "& .MuiInputBase-input": {
                    "&::placeholder": {
                      color: "text.primary",
                    },
                  },
                }}
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
                placeholder="Enter Password"
                type="password"
                sx={{
                  mb: 1,
                  color: "text.primary",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "divider",
                    },
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "divider",
                    },
                  },
                  "& .MuiInputLabel-outlined": {
                    color: "text.primary",
                  },
                  "& .MuiInputBase-input": {
                    "&::placeholder": {
                      color: "text.primary",
                    },
                  },
                }}
                {...register("password", { required: true })}
              />
              {errors.password && (
                <Typography variant="p" component="p" sx={{ color: "red", mb: 2 }}>
                  {errors.password.message}
                </Typography>
              )}
              <FormControl fullWidth sx={{ mb: 1 }}>
                <InputLabel sx={{ color: "text.primary" }}>Role</InputLabel>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Role"
                      sx={{
                        color: "text.primary",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "divider",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "divider",
                        },
                      }}
                    >
                      <MenuItem value="student">I am a Student</MenuItem>
                      <MenuItem value="teacher">I am a Teacher</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 4 }}
              >
                Join
              </Button>
            </Box>
            <Divider sx={{ my: 1, color: "text.primary" }}>OR</Divider>
            <Box>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                startIcon={<GoogleIcon />}
              >
                Continue With Google
              </Button>
            </Box>
            <Box>
              <Typography variant="body2" color="text.primary" sx={{ mt: 4 }}>
                Already Have an Account?
                <Link to="/login" style={{ color: "text.primary", marginLeft: "5px" }}>
                  Log In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Registration;
