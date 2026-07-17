import { useState } from "react";
import { Box, Typography, Grid, Paper, IconButton, useTheme } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import dayjs from "dayjs";
import { motion } from "framer-motion";

const CalendarPage = () => {
  const theme = useTheme();
  const [currentYear, setCurrentYear] = useState(dayjs().year());

  const months = Array.from({ length: 12 }, (_, i) => i);
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getDaysInMonth = (month) => {
    const date = dayjs().year(currentYear).month(month);
    const daysInMonth = date.daysInMonth();
    const firstDay = date.startOf("month").day();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null); // Empty slots before the first day
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: "100%", maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "text.primary" }}>
          Academic Calendar
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={() => setCurrentYear((y) => y - 1)} sx={{ bgcolor: "background.paper", boxShadow: 1 }}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: "600", minWidth: "80px", textAlign: "center" }}>
            {currentYear}
          </Typography>
          <IconButton onClick={() => setCurrentYear((y) => y + 1)} sx={{ bgcolor: "background.paper", boxShadow: 1 }}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {months.map((month) => {
          const days = getDaysInMonth(month);
          const monthName = dayjs().month(month).format("MMMM");

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={month}>
              <Paper
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: month * 0.05 }}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: 1,
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  height: "100%",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "primary.main", textAlign: "center" }}>
                  {monthName}
                </Typography>
                
                <Grid container spacing={0.5}>
                  {weekDays.map((day) => (
                    <Grid item xs={12 / 7} key={day}>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          textAlign: "center",
                          fontWeight: 600,
                          color: "text.secondary",
                          mb: 1,
                        }}
                      >
                        {day}
                      </Typography>
                    </Grid>
                  ))}
                  
                  {days.map((day, idx) => {
                    const isToday = day && currentYear === dayjs().year() && month === dayjs().month() && day === dayjs().date();
                    return (
                      <Grid item xs={12 / 7} key={idx}>
                        <Box
                          sx={{
                            aspectRatio: "1/1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            bgcolor: isToday ? "primary.main" : "transparent",
                            color: isToday ? "white" : "text.primary",
                            fontSize: "0.875rem",
                            fontWeight: isToday ? "bold" : "regular",
                            "&:hover": {
                              bgcolor: day && !isToday ? "action.hover" : (isToday ? "primary.dark" : "transparent"),
                              cursor: day ? "pointer" : "default",
                            },
                          }}
                        >
                          {day || ""}
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CalendarPage;
