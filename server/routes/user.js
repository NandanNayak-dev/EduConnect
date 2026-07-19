import express from 'express';
import { getUserData, login, registration, changePassword, getUsers, removeUser, getUserActivity, forgotPassword, verifyOtp, resetPassword } from '../controller/user.js';
import userAuthentication from '../middleware/userAuthentication.js';
import adminAuthentication from '../middleware/adminAuthentication.js';

const user = express.Router();

user.post("/registration", registration);
user.post("/login", login);
user.post("/forgot-password", forgotPassword);
user.post("/verify-otp", verifyOtp);
user.post("/reset-password", resetPassword);
user.get("/profile", userAuthentication, getUserData);
user.get("/activity", userAuthentication, getUserActivity);
user.put("/change-password", userAuthentication, changePassword);
user.get("", adminAuthentication, getUsers);
user.delete("/:userId", adminAuthentication, removeUser);
// user.get("/log-out", logOut);

export default user;