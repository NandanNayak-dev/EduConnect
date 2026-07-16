import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  useTheme,
  alpha
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArticleIcon from "@mui/icons-material/Article";
import TaskIcon from "@mui/icons-material/Task";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import ProfileCardDetails from "../../components/profile/profile/ProfileCardDetails";
import ActivityGrid from "../../components/profile/profile/ActivityGrid";
import useEduConnect from "../hooks/useEduConnect";
import RecentPost from "../../components/profile/profile/RecentPost";
import LatestProduct from "../../components/profile/profile/LatestProduct";
import OngoingTask from "../../components/profile/profile/OngoingTask";

const StatCard = ({ title, value, icon, color }) => {
  const theme = useTheme();
  return (
    <Card 
      elevation={0} 
      sx={{ 
        flex: 1, 
        backgroundColor: '#fff',
        border: '1px solid #dadce0',
        borderRadius: 2,
        transition: 'none',
        '&:hover': {
          boxShadow: 'none'
        }
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={1}>
            {title}
          </Typography>
          <Box 
            sx={{ 
              p: 1, 
              borderRadius: 2, 
              backgroundColor: 'transparent', 
              display: 'flex', 
              color: color 
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="h3" fontWeight={700} color="text.primary">
          {value !== undefined ? value : '-'}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Profile = () => {
  const [data, setData] = useState(null);
  const theme = useTheme();
  const {
    setAlertBoxOpenStatus,
    setLoadingStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useEduConnect();

  useEffect(() => {
    const fetchData = async () => {
      setLoadingStatus(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_ENDPOINT}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get(
                import.meta.env.VITE_TOKEN_KEY
              )}`,
            },
          }
        );
        if (response.data.status) {
          setData(response.data.user);
        } else {
          setLoadingStatus(false);
          setAlertBoxOpenStatus(true);
          setAlertSeverity(response.data.status ? "success" : "error");
          setAlertMessage(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingStatus(false);
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage("Something Went Wrong");
        error.response?.data?.message
          ? setAlertMessage(error.response.data.message)
          : setAlertMessage(error.message);
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ pb: 4 }}>
      <Typography variant="h4" fontWeight={600} mb={3} color="text.primary">
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={7} lg={8}>
          <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }} height="100%">
            <StatCard 
              title="Total Posts" 
              value={data?.totalPosts} 
              icon={<ArticleIcon />} 
              color={theme.palette.primary.main} 
            />
            <StatCard 
              title="Ongoing Tasks" 
              value={data?.ongoingTasks} 
              icon={<TaskIcon />} 
              color={theme.palette.secondary.main} 
            />
            <StatCard 
              title="Total Products" 
              value={data?.totalProducts} 
              icon={<ShoppingCartIcon />} 
              color={theme.palette.success.main || '#10b981'} 
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={5} lg={4}>
          <ProfileCardDetails data={data} />
        </Grid>
      </Grid>

      <Typography variant="h5" fontWeight={700} mb={2} mt={4} color="text.primary">
        Recent Activity
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <OngoingTask />
        </Grid>
        <Grid item xs={12} md={4}>
          <LatestProduct />
        </Grid>
        <Grid item xs={12} md={4}>
          <RecentPost />
        </Grid>
      </Grid>
      
      <Typography variant="h5" fontWeight={700} mb={2} mt={4} color="text.primary">
        Activity Grid
      </Typography>
      <ActivityGrid />
    </Box>
  );
};

export default Profile;
