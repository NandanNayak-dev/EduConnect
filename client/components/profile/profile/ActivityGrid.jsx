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

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

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
        error.response?.data?.message
          ? setAlertMessage(error.response.data.message)
          : setAlertMessage(error.message);
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchData();
  }, []);

  const getLeetCodeColor = (activity, mode) => {
    if (activity === 0 || activity === null || activity === undefined) return mode === "dark" ? "#2c2c2c" : "#ebedf0";
    if (activity <= 1) return mode === "dark" ? "#0e4429" : "#9be9a8";
    if (activity <= 3) return mode === "dark" ? "#006d32" : "#40c463";
    if (activity <= 5) return mode === "dark" ? "#26a641" : "#30a14e";
    return mode === "dark" ? "#39d353" : "#216e39";
  };

  // Group data by month
  const monthsMap = new Map();

  activityData.forEach(day => {
    const year = day.date.getFullYear();
    const month = day.date.getMonth();
    const key = `${year}-${month}`;
    
    if (!monthsMap.has(key)) {
      monthsMap.set(key, { year, month, daysMap: new Map() });
    }
    monthsMap.get(key).daysMap.set(day.date.getDate(), day);
  });

  // Convert to array of month objects with structured weeks
  const structuredMonths = Array.from(monthsMap.values()).map(monthData => {
    const { year, month, daysMap } = monthData;
    const firstDayDate = new Date(year, month, 1);
    const lastDayDate = new Date(year, month + 1, 0);
    const daysInMonth = lastDayDate.getDate();
    
    // 0 = Sunday, 1 = Monday...
    const firstDayOfWeek = firstDayDate.getDay(); 
    
    const weeks = [];
    let currentWeek = [];
    
    // Pad the first week with empty slots
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }
    
    // Fill in the days
    for (let d = 1; d <= daysInMonth; d++) {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      const dayData = daysMap.get(d) || { 
        date: new Date(year, month, d), 
        activity: 0 
      };
      currentWeek.push(dayData);
    }
    
    // Pad the last week with empty slots
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return {
      year,
      month,
      weeks
    };
  });

  return (
    <Container maxWidth="lg" sx={{ margin: "30px auto", pb: 2 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "flex-start" }}>
        {structuredMonths.map((monthData, monthIndex) => (
          <Box key={monthIndex} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: "text.secondary",
                textAlign: "center"
              }}
            >
              {monthNames[monthData.month]} {monthData.year}
            </Typography>
            
            <Box sx={{ display: "flex", gap: "4px" }}>
              {monthData.weeks.map((week, weekIndex) => (
                <Box key={weekIndex} sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {week.map((day, dayIndex) => (
                    day ? (
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
                    ) : (
                      // Empty placeholder for padding days
                      <Box
                        key={dayIndex}
                        sx={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "3px",
                          backgroundColor: "transparent"
                        }}
                      />
                    )
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
      
      {/* Legend */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 4, gap: 1, color: 'text.secondary', fontSize: '12px' }}>
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
    </Container>
  );
};

export default ActivityGrid;
