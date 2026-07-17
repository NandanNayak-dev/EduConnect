import { Container, Box, Typography, Tooltip, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import useEduConnect from "../../../src/hooks/useEduConnect";

const ActivityGrid = () => {
  const theme = useTheme();
  const [activityData, setActivityData] = useState([]);
  const {
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
    setLoadingStatus,
  } = useEduConnect();
  const weeks = [];
  let week = [];

  activityData.forEach((day) => {
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
    week.push(day);
  });

  if (week.length > 0) weeks.push(week);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];


  let lastMonth = -1;

  useEffect(() => {
    const fetchData = async () => {
      setLoadingStatus(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_ENDPOINT}/users/activity`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get(
                import.meta.env.VITE_TOKEN_KEY
              )}`,
            },
          }
        );
        if (response.data.status) {
          const formattedData = response.data.userActivity.map((entry) => ({
            date: new Date(entry.date),
            activity: entry.activity,
          })).sort((a, b) => a.date - b.date);
          setActivityData(formattedData);
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
        error.response.data.message
          ? setAlertMessage(error.response.data.message)
          : setAlertMessage(error.message);
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchData();
    console.log(activityData);
  }, []);

  const getLeetCodeColor = (activity, mode) => {
    if (activity === 0) return mode === "dark" ? "#2c2c2c" : "#ebedf0";
    if (activity <= 1) return mode === "dark" ? "#0e4429" : "#9be9a8";
    if (activity <= 3) return mode === "dark" ? "#006d32" : "#40c463";
    if (activity <= 5) return mode === "dark" ? "#26a641" : "#30a14e";
    return mode === "dark" ? "#39d353" : "#216e39";
  };

  return (
    <Container maxWidth="lg" sx={{ margin: "30px auto", overflowX: "auto", pb: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: "max-content" }}>
        <Box sx={{ display: "flex", gap: "4px" }}>
          {weeks.map((week, weekIndex) => {
            const firstDayOfWeek = week[0];
            const currentMonth = firstDayOfWeek.date.getMonth();
            const isNewMonth = lastMonth !== currentMonth;
            lastMonth = currentMonth;

            return (
              <Box
                key={weekIndex}
                sx={{ display: "flex", flexDirection: "column", width: "14px" }}
              >
                {isNewMonth ? (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "10px",
                      color: "text.secondary",
                      mb: 1,
                      height: "15px",
                      lineHeight: "15px",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {monthNames[currentMonth]}
                  </Typography>
                ) : (
                  <Box sx={{ height: "15px", mb: 1 }} />
                )}
                <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {week.map((day, dayIndex) => (
                    <Tooltip
                      key={dayIndex}
                      title={`${day.activity} submissions on ${day.date.toDateString()}`}
                      arrow
                      placement="top"
                    >
                      <Box
                        sx={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "3px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          backgroundColor: getLeetCodeColor(day.activity, theme.palette.mode),
                          '&:hover': {
                            transform: "scale(1.15)",
                            boxShadow: "0 0 4px rgba(0,0,0,0.3)"
                          }
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
        
        {/* Legend */}
        <Box sx={{ display: 'flex', alignItems: 'center', alignSelf: 'flex-end', mt: 2, gap: 1, color: 'text.secondary', fontSize: '12px' }}>
          <Typography variant="caption">Less</Typography>
          {[0, 1, 3, 5, 7].map((val, idx) => (
            <Box
              key={idx}
              sx={{
                width: "14px",
                height: "14px",
                borderRadius: "3px",
                backgroundColor: getLeetCodeColor(val, theme.palette.mode),
              }}
            />
          ))}
          <Typography variant="caption">More</Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ActivityGrid;
