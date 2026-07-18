import { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, IconButton, useTheme, Modal, TextField, Button } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";
import useEduConnect from "../hooks/useEduConnect";

const CalendarPage = () => {
  const theme = useTheme();
  const [currentYear, setCurrentYear] = useState(dayjs().year());
  const [notes, setNotes] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  
  const { setAlertBoxOpenStatus, setAlertSeverity, setAlertMessage, setLoadingStatus } = useEduConnect();

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/calendar-notes`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
        },
      });
      if (response.data.status) {
        const notesObj = {};
        response.data.notes.forEach(note => {
          notesObj[note.date] = note.note;
        });
        setNotes(notesObj);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

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

  const handleDayClick = (day, month) => {
    if (!day) return;
    const dateStr = dayjs().year(currentYear).month(month).date(day).format("YYYY-MM-DD");
    setSelectedDate(dateStr);
    setNoteText(notes[dateStr] || "");
    setIsModalOpen(true);
  };

  const handleSaveNote = async () => {
    try {
      setLoadingStatus(true);
      if (!noteText.trim()) {
        // if empty, we could delete it, but let's just use delete route if needed, or delete if empty
        await axios.delete(`${import.meta.env.VITE_SERVER_ENDPOINT}/calendar-notes/${selectedDate}`, {
          headers: { Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}` },
        });
        setNotes(prev => {
          const updated = { ...prev };
          delete updated[selectedDate];
          return updated;
        });
      } else {
        await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/calendar-notes`, 
          { date: selectedDate, note: noteText },
          { headers: { Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}` } }
        );
        setNotes(prev => ({ ...prev, [selectedDate]: noteText }));
      }
      setAlertSeverity("success");
      setAlertMessage("Note saved successfully!");
      setAlertBoxOpenStatus(true);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      setAlertSeverity("error");
      setAlertMessage("Failed to save note");
      setAlertBoxOpenStatus(true);
    } finally {
      setLoadingStatus(false);
    }
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
                    const dateStr = day ? dayjs().year(currentYear).month(month).date(day).format("YYYY-MM-DD") : null;
                    const hasNote = dateStr && notes[dateStr];
                    
                    return (
                      <Grid item xs={12 / 7} key={idx}>
                        <Box
                          onClick={() => handleDayClick(day, month)}
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
                            position: "relative",
                            "&:hover": {
                              bgcolor: day && !isToday ? "action.hover" : (isToday ? "primary.dark" : "transparent"),
                              cursor: day ? "pointer" : "default",
                            },
                          }}
                        >
                          {day || ""}
                          {hasNote && (
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: 2,
                                width: 4,
                                height: 4,
                                borderRadius: "50%",
                                bgcolor: isToday ? "white" : "error.main",
                              }}
                            />
                          )}
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

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 3,
            outline: "none",
          }}
        >
          <Typography variant="h6" mb={2}>
            Note for {selectedDate ? dayjs(selectedDate).format("MMMM D, YYYY") : ""}
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            placeholder="Add a reminder or note..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={() => setIsModalOpen(false)} color="inherit">Cancel</Button>
            <Button onClick={handleSaveNote} variant="contained" color="primary">Save Note</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CalendarPage;
