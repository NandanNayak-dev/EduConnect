import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme
} from "@mui/material";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";

import NavBar from "./NavBar";
import useEduConnect from "../hooks/useEduConnect";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import AlertBox from "../../components/common/AlertBox";

const AdminSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { setAlertBoxOpenStatus, setAlertMessage, setAlertSeverity } =
    useEduConnect();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const listData = [
    {
      label: "My Profile",
      url: "/dashboard",
      icon: <DashboardIcon />,
    },
    {
      label: "Users",
      url: "/dashboard/users",
      icon: <GroupIcon />,
    }
  ];
  const handleLogOut = async () => {
    setAlertBoxOpenStatus(true);
    setAlertSeverity("success");
    setAlertMessage("Logged Out Successfully");
    Cookies.remove(import.meta.env.VITE_TOKEN_KEY, { path: "/" });
    Cookies.remove(import.meta.env.VITE_USER_ROLE, { path: "/" });
    navigate("/login");
  };



  useEffect(() => {
    const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
    const role = Cookies.get(import.meta.env.VITE_USER_ROLE);
    if (token && role) {
      if (role === "user") {
        navigate("/profile");
      } else if (role === "admin") {
        navigate("/dashboard");
      }
    } else {
      Cookies.remove(import.meta.env.VITE_TOKEN_KEY, { path: "/" });
      Cookies.remove(import.meta.env.VITE_USER_ROLE, { path: "/" });
      navigate("/login");
    }
  }, []);

  const drawerContent = (
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
            onClick={() => setMobileOpen(false)}
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
          <ListItemText primary={"Sign Out"} sx={{ color: 'text.primary' }} />
        </NavLink>
      </ListItem>
    </List>
  );

  return (
    <div>
      <NavBar toggleDrawer={handleDrawerToggle} />
      <Box sx={{ display: "flex", minHeight: "620px" }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Better open performance on mobile.
          sx={{
            display: { xs: 'block', md: 'none' },
            "& .MuiDrawer-paper": { boxSizing: 'border-box', width: 240, backgroundColor: 'background.paper' },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="persistent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            width: "240px",
            "& .MuiDrawer-paper": {
              position: "static",
              backgroundColor: 'background.paper',
              borderRight: 1,
              borderColor: 'divider',
              width: "240px"
            },
          }}
        >
          {drawerContent}
        </Drawer>
        <Box sx={{ width: "100%", padding: "10px 10px 5px 0px", backgroundColor: 'background.default' }}>
          <Outlet />
        </Box>
      </Box>
    </div>
  );
};

export default AdminSideBar;
