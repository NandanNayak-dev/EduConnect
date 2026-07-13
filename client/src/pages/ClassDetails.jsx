import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Button, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ClassDetails = () => {
  const { classId } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [role, setRole] = useState('student');

  const [materials, setMaterials] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [polls, setPolls] = useState([]);

  // New item states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    setRole(Cookies.get(import.meta.env.VITE_USER_ROLE));
    fetchClassData();
  }, [classId]);

  const fetchClassData = async () => {
    try {
      const headers = { Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}` };
      const [matRes, annRes, pollRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/materials?classId=${classId}`, { headers }),
        axios.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/announcements?classId=${classId}`, { headers }),
        axios.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/polls?classId=${classId}`, { headers })
      ]);
      setMaterials(matRes.data.materials || []);
      setAnnouncements(annRes.data.announcements || []);
      setPolls(pollRes.data.polls || []);
    } catch (error) {
      console.error("Error fetching class data", error);
    }
  };

  const handlePostMaterial = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/materials`, {
        title: newTitle, description: newDesc, link: newLink, classId
      }, { headers: { Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}` } });
      setNewTitle(''); setNewDesc(''); setNewLink('');
      fetchClassData();
    } catch (error) { alert("Error posting material"); }
  };

  const handlePostAnnouncement = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/announcements`, {
        title: newTitle, content: newDesc, classId
      }, { headers: { Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}` } });
      setNewTitle(''); setNewDesc('');
      fetchClassData();
    } catch (error) { alert("Error posting announcement"); }
  };

  const handlePostPoll = async () => {
    // Basic poll options parse from newDesc, splitting by newline
    const options = newDesc.split('\n').filter(o => o.trim() !== '');
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/polls`, {
        question: newTitle, options, classId
      }, { headers: { Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}` } });
      setNewTitle(''); setNewDesc('');
      fetchClassData();
    } catch (error) { alert("Error posting poll. Need question and at least 2 options (newline separated)."); }
  };

  const handleVote = async (pollId, optionId) => {
    try {
      await axios.patch(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/polls/vote`, {
        pollId, optionId
      }, { headers: { Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}` } });
      fetchClassData();
    } catch (error) { alert("Error or already voted."); }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)}>
          <Tab label="Materials" />
          <Tab label="Announcements" />
          <Tab label="Polls" />
        </Tabs>
      </Box>

      {/* MATERIALS */}
      <TabPanel value={tabValue} index={0}>
        {role === 'teacher' && (
          <Box sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="h6">Post New Material</Typography>
            <TextField fullWidth label="Title" margin="normal" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <TextField fullWidth label="Description" margin="normal" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
            <TextField fullWidth label="Link (optional)" margin="normal" value={newLink} onChange={e => setNewLink(e.target.value)} />
            <Button variant="contained" sx={{ mt: 1 }} onClick={handlePostMaterial}>Post Material</Button>
          </Box>
        )}
        {materials.map(m => (
          <Box key={m._id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
            <Typography variant="h6">{m.title}</Typography>
            <Typography variant="body2" color="text.secondary">By {m.teacherId?.fullName}</Typography>
            <Typography sx={{ mt: 1 }}>{m.description}</Typography>
            {m.link && <a href={m.link} target="_blank" rel="noreferrer">View Link</a>}
          </Box>
        ))}
      </TabPanel>

      {/* ANNOUNCEMENTS */}
      <TabPanel value={tabValue} index={1}>
        {role === 'teacher' && (
          <Box sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="h6">Post Announcement</Typography>
            <TextField fullWidth label="Title" margin="normal" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <TextField fullWidth multiline rows={3} label="Content" margin="normal" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
            <Button variant="contained" sx={{ mt: 1 }} onClick={handlePostAnnouncement}>Post</Button>
          </Box>
        )}
        {announcements.map(a => (
          <Box key={a._id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
            <Typography variant="h6">{a.title}</Typography>
            <Typography variant="body2" color="text.secondary">By {a.teacherId?.fullName}</Typography>
            <Typography sx={{ mt: 1 }}>{a.content}</Typography>
          </Box>
        ))}
      </TabPanel>

      {/* POLLS */}
      <TabPanel value={tabValue} index={2}>
        {role === 'teacher' && (
          <Box sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="h6">Create Poll</Typography>
            <TextField fullWidth label="Question" margin="normal" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <TextField fullWidth multiline rows={3} label="Options (one per line)" margin="normal" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
            <Button variant="contained" sx={{ mt: 1 }} onClick={handlePostPoll}>Create Poll</Button>
          </Box>
        )}
        {polls.map(p => (
          <Box key={p._id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
            <Typography variant="h6">{p.question}</Typography>
            <Typography variant="body2" color="text.secondary">By {p.teacherId?.fullName}</Typography>
            <Box sx={{ mt: 2 }}>
              {p.options.map(opt => (
                <Box key={opt._id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Button variant="outlined" sx={{ mr: 2 }} onClick={() => handleVote(p._id, opt._id)}>
                    Vote {opt.text}
                  </Button>
                  <Typography>Votes: {opt.votes}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </TabPanel>
    </Box>
  );
};

export default ClassDetails;
