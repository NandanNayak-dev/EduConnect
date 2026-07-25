import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  Badge,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import ClassIcon from '@mui/icons-material/Class';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import CodeIcon from "@mui/icons-material/Code";

import NavBar from "./NavBar";
import Footer from "./Footer";
import Cookies from "js-cookie";
import useEduConnect from "../hooks/useEduConnect";
import AlertBox from "../../components/common/AlertBox";
import { useEffect, useState } from "react";
import ChatbotWidget from "../components/chat/ChatbotWidget";
import axios from "axios";
import dayjs from "dayjs";


const UserSideBar = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { setAlertBoxOpenStatus, setAlertMessage, setAlertSeverity } =
    useEduConnect();
  const [hasTodayNote, setHasTodayNote] = useState(false);

  const listData = [
    {
      label: "My Profile",
      url: "/profile",
      icon: <DashboardIcon />,
    },
    {
      label: "My Classes",
      url: "/classes",
      icon: <ClassIcon />,
    },
    {
      label: "Task Manager",
      url: "/task-management",
      icon: <PlaylistAddCheckIcon />,
    },
    {
      label: "Calendar",
      url: "/calendar",
      icon: (
        <Badge color="error" variant="dot" invisible={!hasTodayNote}>
          <CalendarMonthIcon />
        </Badge>
      ),
    },
    {
      label: "Settings",
      url: "/setting",
      icon: <SettingsIcon />,
    },
  ];

  const handleLogOut = async () => {
    setAlertBoxOpenStatus(true);
    setAlertSeverity("success");
    setAlertMessage("Logged Out Successfully");
    Cookies.remove(import.meta.env.VITE_TOKEN_KEY, { path: "/" });
    Cookies.remove(import.meta.env.VITE_USER_ROLE, { path: "/" });
    navigate("/login");
  };

  const role = Cookies.get(import.meta.env.VITE_USER_ROLE);

  useEffect(() => {
    const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
    if (token && role) {
      if (role === "student" || role === "teacher") {
        // Allow them to stay in the UserSideBar Layout
      } else if (role === "admin") {
        navigate("/dashboard");
      }
    } else {
      Cookies.remove(import.meta.env.VITE_TOKEN_KEY, { path: "/" });
      Cookies.remove(import.meta.env.VITE_USER_ROLE, { path: "/" });
      navigate("/login");
    }

    const fetchTodayNote = async () => {
      try {
        if (token) {
          const response = await axios.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/calendar-notes`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.status) {
            const todayStr = dayjs().format("YYYY-MM-DD");
            const noteForToday = response.data.notes.find(n => n.date === todayStr);
            const lastVisited = localStorage.getItem('calendar_last_visited_date');
            if (noteForToday && lastVisited !== todayStr) {
              setHasTodayNote(true);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchTodayNote();
  }, []);

  useEffect(() => {
    if (location.pathname === '/calendar') {
      const todayStr = dayjs().format("YYYY-MM-DD");
      localStorage.setItem('calendar_last_visited_date', todayStr);
      setHasTodayNote(false);
    }
  }, [location.pathname]);

  return (
    <div>
      <NavBar />
      <Box sx={{ display: "flex", minHeight: "620px" }}>
        <Drawer
          variant="persistent"
          open
          sx={{
            width: "240px",
            "& .MuiDrawer-paper": {
              position: "static",
              backgroundColor: 'background.paper',
              borderRight: 1,
              borderColor: 'divider'
            },
          }}
        >
          <List sx={{ p: "0" }}>
            {listData.map(({ label, url, icon }, index) => (
              <ListItem
                key={label + "_" + index}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
                component="div"
              >
                <NavLink
                  to={url}
                  style={{
                    width: "100%",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    color: location.pathname === url ? theme.palette.primary.main : "inherit",
                  }}
                  activestyle={{ color: theme.palette.primary.main }}
                >
                  <ListItemIcon
                    sx={{
                      color: location.pathname === url ? theme.palette.primary.main : "inherit",
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    sx={{
                      color: location.pathname === url ? theme.palette.primary.main : "inherit",
                    }}
                  />
                </NavLink>
              </ListItem>
            ))}
            
            {role === 'student' && (
              <ListItem
                sx={{ borderBottom: 1, borderColor: 'divider' }}
                component="div"
              >
                <NavLink
                  to="/playground"
                  style={{
                    width: "100%",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    color: location.pathname === "/playground" ? theme.palette.primary.main : "inherit",
                  }}
                  activestyle={{ color: theme.palette.primary.main }}
                >
                  <ListItemIcon
                    sx={{
                      color: location.pathname === "/playground" ? theme.palette.primary.main : "inherit",
                    }}
                  >
                    <CodeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Playground"
                    sx={{
                      color: location.pathname === "/playground" ? theme.palette.primary.main : "inherit",
                    }}
                  />
                </NavLink>
              </ListItem>
            )}

            <ListItem
              sx={{ borderBottom: 1, borderColor: 'divider' }}
              component="div"
            >
              <NavLink
                onClick={handleLogOut}
                component="button"
                style={{
                  width: "100%",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  color: "inherit",
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary={"Sign Out"} sx={{ color: 'text.primary' }}/>
              </NavLink>
            </ListItem>
          </List>
        </Drawer>
        <Box sx={{ width: "100%", margin: "10px", backgroundColor: 'background.default' }}>{children}</Box>
      </Box>
      <Footer />
      <ChatbotWidget />
    </div>
  );
};

UserSideBar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserSideBar;
