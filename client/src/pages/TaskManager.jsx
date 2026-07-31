import { Grid, Box, List, Fab, Modal, Typography, useTheme, alpha } from "@mui/material";
import TaskStatus from "../../components/profile/task-management/TaskStatus";
import Task from "../../components/profile/task-management/Task";

import AddIcon from "@mui/icons-material/Add";
import AddTask from "../../components/profile/task-management/AddTask";
import { useEffect, useState } from "react";
import axios from "axios";
import useEduConnect from "../hooks/useEduConnect";
import dayjs from "dayjs";
import { useForm, FormProvider } from "react-hook-form";
import Cookies from "js-cookie";
import { useDrop } from 'react-dnd';

const DroppableColumn = ({ status, onDrop, children, sx }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK_ITEM',
    drop: (item) => onDrop(item.taskId, status),
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });
  
  return (
    <Box ref={drop} sx={{ ...sx, backgroundColor: isOver ? 'rgba(0,0,0,0.1)' : sx.backgroundColor }}>
      {children}
    </Box>
  );
};

const TaskManager = () => {
  const [allTask, setAllTask] = useState([]);
  const [todo, setTodo] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [completed, setCompleted] = useState([]);
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

  useEffect(() => {
    setTodo(allTask.filter((task) => task.taskStatus === "todo"));
    setOngoing(allTask.filter((task) => task.taskStatus === "ongoing"));
    setCompleted(allTask.filter((task) => task.taskStatus === "completed"));
  }, [allTask]);

  const onSubmit = async (data) => {
    try {
      setLoadingStatus(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tasks`,
        { ...data, selectedDate },
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

  const handleDrop = async (taskId, status) => {
    try {
      setLoadingStatus(true);
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tasks/${taskId}/${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );
      const updatedTasks = allTask.map((task) =>
        task._id === taskId ? { ...task, taskStatus: status } : task
      );
      setAllTask(updatedTasks);
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
        setLoadingStatus(false);
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setLoadingStatus(false);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage("Something Went Wrong");
      error.response?.data?.message
        ? setAlertMessage(error.response.data.message)
        : setAlertMessage(error.message);
    }
  };

  return (
    <Box sx={{ width: "100%", position: "relative", pb: 4, height: { xs: 'auto', md: "calc(100vh - 100px)" }, minHeight: "calc(100vh - 100px)", overflow: { xs: 'visible', md: "hidden" }, display: "flex", flexDirection: "column" }}>
      <Typography variant="h4" fontWeight={600} mb={3} color="text.primary">
        Task Manager
      </Typography>
      
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        {/* Kanban Board (Stacked on Mobile, Horizontal on Desktop) */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, overflowX: { xs: 'visible', md: 'auto' }, overflowY: { xs: 'visible', md: 'hidden' }, minHeight: 0, pb: 1, '&::-webkit-scrollbar': { height: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px' } }}>
          {/* TODO Column */}
          <Box sx={{ width: '100%', flexShrink: 0, flex: { xs: 'none', md: 1 }, display: 'flex', flexDirection: 'column', height: { xs: '450px', md: '100%' } }}>
            <Box sx={{ borderRadius: 2, p: 2, mb: 2, backgroundColor: alpha(theme.palette.info.main, 0.1), border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TaskStatus status="todo" onDrop={handleDrop} />
            </Box>
            <DroppableColumn status="todo" onDrop={handleDrop} sx={{ flex: 1, overflowY: 'auto', backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)', borderRadius: 3, p: 2, '&::-webkit-scrollbar': { display: 'none' }, transition: 'background-color 0.2s ease' }}>
              <List sx={{ pt: 0 }}>
                {todo.map((item) => (
                  <Task key={item._id} text={item.title} taskId={item._id} handleDelete={handleDelete} />
                ))}
              </List>
            </DroppableColumn>
          </Box>

          {/* ONGOING Column */}
          <Box sx={{ width: '100%', flexShrink: 0, flex: { xs: 'none', md: 1 }, display: 'flex', flexDirection: 'column', height: { xs: '450px', md: '100%' } }}>
            <Box sx={{ borderRadius: 2, p: 2, mb: 2, backgroundColor: alpha(theme.palette.warning.main, 0.1), border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TaskStatus status="ongoing" onDrop={handleDrop} />
            </Box>
            <DroppableColumn status="ongoing" onDrop={handleDrop} sx={{ flex: 1, overflowY: 'auto', backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)', borderRadius: 3, p: 2, '&::-webkit-scrollbar': { display: 'none' }, transition: 'background-color 0.2s ease' }}>
              <List sx={{ pt: 0 }}>
                {ongoing.map((item) => (
                  <Task key={item._id} text={item.title} taskId={item._id} handleDelete={handleDelete} />
                ))}
              </List>
            </DroppableColumn>
          </Box>

          {/* COMPLETED Column */}
          <Box sx={{ width: '100%', flexShrink: 0, flex: { xs: 'none', md: 1 }, display: 'flex', flexDirection: 'column', height: { xs: '450px', md: '100%' } }}>
            <Box sx={{ borderRadius: 2, p: 2, mb: 2, backgroundColor: alpha(theme.palette.success.main, 0.1), border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TaskStatus status="completed" onDrop={handleDrop} />
            </Box>
            <DroppableColumn status="completed" onDrop={handleDrop} sx={{ flex: 1, overflowY: 'auto', backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)', borderRadius: 3, p: 2, '&::-webkit-scrollbar': { display: 'none' }, transition: 'background-color 0.2s ease' }}>
              <List sx={{ pt: 0 }}>
                {completed.map((item) => (
                  <Task key={item._id} text={item.title} taskId={item._id} handleDelete={handleDelete} />
                ))}
              </List>
            </DroppableColumn>
          </Box>
        </Box>
      </Box>

      <Fab
        aria-label="add"
        size="large"
        sx={{
          position: "absolute",
          bottom: 24,
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
