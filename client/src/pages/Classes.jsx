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
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h3" className="text-gradient" sx={{ mb: 4, fontWeight: 'bold' }}>My Classes</Typography>

      {role === 'teacher' ? (
        <Box className="glass-panel" sx={{ mb: 6, p: 4, borderRadius: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Create a New Class</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={5}>
              <TextField variant="outlined" fullWidth label="Class Name" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField variant="outlined" fullWidth label="Description" value={newClassDescription} onChange={(e) => setNewClassDescription(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'stretch' }}>
              <Button size="large" variant="contained" fullWidth onClick={handleCreateClass} sx={{ height: '100%' }}>Create</Button>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box className="glass-panel" sx={{ mb: 6, p: 4, borderRadius: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Join a Class</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={9} md={10}>
              <TextField variant="outlined" fullWidth label="Enter 6-Character Join Code" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={3} md={2} sx={{ display: 'flex', alignItems: 'stretch' }}>
              <Button size="large" variant="contained" fullWidth onClick={handleJoinClass} sx={{ height: '100%' }}>Join</Button>
            </Grid>
          </Grid>
        </Box>
      )}

      <Grid container spacing={3}>
        {classes.map((cls) => (
          <Grid item xs={12} sm={6} md={4} key={cls._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ height: '80px', background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)', borderRadius: '16px 16px 0 0' }} />
              <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>{cls.name}</Typography>
                <Typography color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                  Teacher: {cls.teacherId.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">{cls.description}</Typography>
                {role === 'teacher' && (
                  <Box sx={{ mt: 3, p: 1.5, backgroundColor: 'rgba(6, 182, 212, 0.1)', borderRadius: 2, display: 'inline-block' }}>
                    <Typography variant="body2" sx={{ color: '#0891b2', fontWeight: 'bold' }}>
                      Join Code: {cls.joinCode}
                    </Typography>
                  </Box>
                )}
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button fullWidth variant="outlined" onClick={() => navigate(`/classes/${cls._id}`)}>
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
