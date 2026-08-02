import { Box, List, Fab, Modal, Typography, useTheme, alpha } from "@mui/material";
import Task from "../../components/profile/task-management/Task";
import AddIcon from "@mui/icons-material/Add";
import AddTask from "../../components/profile/task-management/AddTask";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import useEduConnect from "../hooks/useEduConnect";
import dayjs from "dayjs";
import { useForm, FormProvider } from "react-hook-form";
import Cookies from "js-cookie";

const TaskManager = () => {
  const [allTask, setAllTask] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();
  
  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useEduConnect();
  
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_ENDPOINT}/tasks`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get(
                import.meta.env.VITE_TOKEN_KEY
              )}`,
            },
          }
        );
        if (response.data.status) {
          setAllTask(response.data.tasks);
        } else {
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const activeTasks = useMemo(() => allTask.filter(task => task.taskStatus !== "completed"), [allTask]);
  const completedTasks = useMemo(() => allTask.filter(task => task.taskStatus === "completed"), [allTask]);

  const onSubmit = async (data) => {
    try {
      setLoadingStatus(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tasks`,
        { ...data, selectedDate, taskStatus: "todo" },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );

      setAllTask((prevTasks) => [
        ...prevTasks,
        { ...data, selectedDate, taskStatus: "todo", _id: response.data?.task?._id || Date.now().toString() },
      ]);
      if (response.data.status) {
        setOpenModal(false);
        methods.reset();
        setSelectedDate(dayjs());
      }
      setLoadingStatus(false);
      setAlertBoxOpenStatus(true);
      setAlertSeverity(response.data.status ? "success" : "error");
      setAlertMessage(response.data.message);
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

  const handleToggle = async (taskId, isCompleted) => {
    const newStatus = isCompleted ? "todo" : "completed";
    try {
      setLoadingStatus(true);
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tasks/${taskId}/${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );
      
      if (response.data.status) {
        setAllTask((prev) => 
          prev.map((task) =>
            task._id === taskId ? { ...task, taskStatus: newStatus } : task
          )
        );
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage(response.data.message);
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || error.message);
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      setLoadingStatus(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );
      if (response.data.status) {
        setAllTask(allTask.filter((item) => item._id !== taskId));
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage(response.data.message);
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || "Something Went Wrong");
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <Box sx={{ width: "100%", position: "relative", pb: 4, height: { xs: 'auto', md: "calc(100vh - 100px)" }, minHeight: "calc(100vh - 100px)", display: "flex", flexDirection: "column", alignItems: "center" }}>

      
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", width: "100%", maxWidth: "800px", gap: 3 }}>
        
        {/* Active Tasks Section */}
        <Box sx={{ width: '100%', backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)', borderRadius: 3, p: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" fontWeight={600} mb={2} color="text.primary">
            Active Tasks
          </Typography>
          <List sx={{ pt: 0, maxHeight: '400px', overflowY: 'auto' }}>
            {activeTasks.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ my: 2 }}>
                No active tasks.
              </Typography>
            ) : (
              activeTasks.map((item) => (
                <Task 
                  key={item._id} 
                  text={item.title} 
                  taskId={item._id} 
                  isCompleted={false}
                  handleToggle={handleToggle}
                  handleDelete={handleDelete} 
                />
              ))
            )}
          </List>
        </Box>

        {/* Completed Tasks Section */}
        {completedTasks.length > 0 && (
          <Box sx={{ width: '100%', backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)', borderRadius: 3, p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight={600} mb={2} color="text.primary">
              Completed Tasks
            </Typography>
            <List sx={{ pt: 0, maxHeight: '300px', overflowY: 'auto' }}>
              {completedTasks.map((item) => (
                <Task 
                  key={item._id} 
                  text={item.title} 
                  taskId={item._id} 
                  isCompleted={true}
                  handleToggle={handleToggle}
                  handleDelete={handleDelete} 
                />
              ))}
            </List>
          </Box>
        )}
      </Box>

      <Fab
        aria-label="add"
        size="large"
        sx={{
          position: "absolute",
          bottom: 80,
          right: 24,
          boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
          backgroundColor: "primary.main",
          color: "#ffffff",
          "&:hover": { backgroundColor: "primary.dark", transform: 'scale(1.05)' },
          transition: 'all 0.2s'
        }}
        onClick={() => setOpenModal(true)}
      >
        <AddIcon />
      </Fab>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 3,
          p: 0,
          outline: 'none'
        }}>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <AddTask
                setSelectedDate={setSelectedDate}
                selectedDate={selectedDate}
              />
            </form>
          </FormProvider>
        </Box>
      </Modal>
    </Box>
  );
};

export default TaskManager;
