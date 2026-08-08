import {
  Box,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import ProfileCardDetails from "../../components/profile/profile/ProfileCardDetails";
import ActivityGrid from "../../components/profile/profile/ActivityGrid";
import useEduConnect from "../hooks/useEduConnect";

const Profile = () => {
  const [data, setData] = useState(null);
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
      
      <ProfileCardDetails data={data} />

      <Typography variant="h5" fontWeight={700} mb={2} mt={4} color="text.primary">
        Activity Grid
      </Typography>
      <ActivityGrid />
    </Box>
  );
};

export default Profile;
