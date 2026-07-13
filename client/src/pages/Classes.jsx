import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Grid, Card, CardContent, CardActions } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [role, setRole] = useState('student');
  const [newClassName, setNewClassName] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = Cookies.get(import.meta.env.VITE_USER_ROLE);
    setRole(userRole);
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/classes`, {
        headers: { Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}` }
      });
      if (response.data.status) {
        setClasses(response.data.classes);
      }
    } catch (error) {
      console.error("Error fetching classes", error);
    }
  };

  const handleCreateClass = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/classes`, {
        name: newClassName,
        description: newClassDescription
      }, { headers: { Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}` } });
      if (response.data.status) {
        fetchClasses();
        setNewClassName('');
        setNewClassDescription('');
        alert(`Class Created! Share this Join Code with your students: ${response.data.class.joinCode}`);
      }
    } catch (error) {
      alert("Error creating class: " + (error.response?.data?.message || error.message));
    }
  };

  const handleJoinClass = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/classes/join`, {
        joinCode
      }, { headers: { Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}` } });
      if (response.data.status) {
        fetchClasses();
        setJoinCode('');
        alert("Successfully joined class!");
      }
    } catch (error) {
      alert("Error joining class: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Box sx={{ p: 4, width: '100%' }}>
      <Typography variant="h4" sx={{ mb: 4, color: 'text.primary' }}>My Classes</Typography>

      {role === 'teacher' ? (
        <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Create a New Class</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <TextField fullWidth label="Class Name" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField fullWidth label="Description" value={newClassDescription} onChange={(e) => setNewClassDescription(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button variant="contained" fullWidth onClick={handleCreateClass}>Create</Button>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Join a Class</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={10}>
              <TextField fullWidth label="Enter 6-Character Join Code" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button variant="contained" fullWidth onClick={handleJoinClass}>Join</Button>
            </Grid>
          </Grid>
        </Box>
      )}

      <Grid container spacing={3}>
        {classes.map((cls) => (
          <Grid item xs={12} sm={6} md={4} key={cls._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2">{cls.name}</Typography>
                <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                  Teacher: {cls.teacherId.fullName}
                </Typography>
                <Typography variant="body2">{cls.description}</Typography>
                {role === 'teacher' && (
                  <Typography variant="body2" color="primary" sx={{ mt: 2, fontWeight: 'bold' }}>
                    Join Code: {cls.joinCode}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button size="small" variant="outlined" onClick={() => navigate(`/classes/${cls._id}`)}>
                  Enter Class
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Classes;
