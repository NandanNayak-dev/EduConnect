import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Button, TextField, Checkbox, FormControlLabel, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
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
  const [students, setStudents] = useState([]);
  const [videos, setVideos] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissionsData, setSubmissionsData] = useState({}); // { assignmentId: [submissions] }
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messageContent, setMessageContent] = useState('');

  // New item states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newFile, setNewFile] = useState(null);
  const [isUrgent, setIsUrgent] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);

  useEffect(() => {
    setRole(Cookies.get(import.meta.env.VITE_USER_ROLE));
    fetchClassData();
  }, [classId]);

  const fetchClassData = async () => {
    try {
      const headers = { Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}` };
      const [matRes, annRes, pollRes, studentRes, videoRes, assignRes, msgRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/materials?classId=${classId}`, { headers }),
        axios.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/announcements?classId=${classId}`, { headers }),
        axios.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/polls?classId=${classId}`, { headers }),
        axios.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/classes/${classId}/students`, { headers }),
        axios.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/videos?classId=${classId}`, { headers }),
        axios.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/assignments?classId=${classId}`, { headers }),
        axios.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/messages?classId=${classId}`, { headers })
      ]);
      setMaterials(matRes.data.materials || []);
      setAnnouncements(annRes.data.announcements || []);
      setPolls(pollRes.data.polls || []);
      setStudents(studentRes.data.students || []);
      setVideos(videoRes.data.videos || []);
      setAssignments(assignRes.data.assignments || []);
      setMessages(msgRes.data.messages || []);
    } catch (error) {
      console.error("Error fetching class data", error);
    }
  };

  const handlePostMaterial = async () => {
    try {
      const formData = new FormData();
      formData.append('title', newTitle);
      formData.append('description', newDesc);
      formData.append('classId', classId);
      if (newLink) formData.append('link', newLink);
      if (newFile) formData.append('materials', newFile);

      await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/materials`, formData, { headers: { Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`, 'Content-Type': 'multipart/form-data' } });
      setNewTitle(''); setNewDesc(''); setNewLink(''); setNewFile(null);
      fetchClassData();
    } catch (error) { alert("Error posting material"); }
  };

  const handlePostAnnouncement = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/announcements`, {
        title: newTitle, content: newDesc, classId, urgent: isUrgent
      }, { headers: { Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}` } });
      setNewTitle(''); setNewDesc(''); setIsUrgent(false);
      fetchClassData();
    } catch (error) { alert("Error posting announcement"); }
  };

  const handlePostPoll = async () => {
    const options = pollOptions.filter(o => o.trim() !== '');
    if (options.length < 2) {
      alert("Please provide at least 2 options.");
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/polls`, {
        question: newTitle, options, classId
      }, { headers: { Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}` } });
      setNewTitle(''); setPollOptions(['', '']);
      fetchClassData();
    } catch (error) { alert("Error posting poll."); }
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;
    try {
      const headers = { Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}` };
      await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/messages`, {
        classId, receiverId: selectedStudent._id, content: messageContent
      }, { headers });
      setMessageDialogOpen(false);
      setMessageContent('');
      setSelectedStudent(null);
      fetchClassData();
    } catch (error) { alert("Error sending message."); }
  };

  const handleVote = async (pollId, optionId) => {
    try {
      await axios.patch(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/polls/vote`, {
        pollId, optionId
      }, { headers: { Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}` } });
      fetchClassData();
    } catch (error) { alert("Error or already voted."); }
  };

  const handlePostVideo = async () => {
    if (!newTitle || !newDesc || !newFile) return alert("Please fill all fields and select a video.");
    try {
      const formData = new FormData();
      formData.append('title', newTitle);
      formData.append('description', newDesc);
      formData.append('classId', classId);
      formData.append('videos', newFile);
      await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/videos`, formData, {
        headers: { 
          Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setNewTitle(''); setNewDesc(''); setNewFile(null);
      fetchClassData();
    } catch (error) { alert("Error posting video."); }
  };

  const handlePostAssignment = async () => {
    if (!newTitle || !newDesc) return alert("Title and Description required.");
    try {
      const formData = new FormData();
      formData.append('title', newTitle);
      formData.append('description', newDesc);
      formData.append('classId', classId);
      if (newFile) formData.append('assignments', newFile);

      await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/assignments`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setNewTitle(''); setNewDesc(''); setNewFile(null);
      fetchClassData();
    } catch (error) { alert("Error posting assignment."); }
  };

  const handleUploadSubmission = async (assignmentId, file) => {
    if (!file) return alert("Please select a file.");
    try {
      const formData = new FormData();
      formData.append('assignmentId', assignmentId);
      formData.append('submissions', file);
      await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/assignments/submit`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Assignment submitted successfully!");
      fetchClassData();
    } catch (error) { alert(error.response?.data?.message || "Error submitting assignment."); }
  };

  const fetchSubmissions = async (assignmentId) => {
    if (expandedAssignment === assignmentId) {
      setExpandedAssignment(null);
      return;
    }
    try {
      const headers = { Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}` };
      const res = await axios.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/assignments/submissions?assignmentId=${assignmentId}`, { headers });
      setSubmissionsData(prev => ({ ...prev, [assignmentId]: res.data.submissions }));
      setExpandedAssignment(assignmentId);
    } catch (error) { alert("Error fetching submissions."); }
  };

  const handleEvaluate = async (submissionId, currentStatus, assignmentId) => {
    try {
      const headers = { Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}` };
      await axios.patch(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/assignments/submissions/${submissionId}/evaluate`, { evaluated: !currentStatus }, { headers });
      
      // Refresh submissions for this assignment
      const res = await axios.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/assignments/submissions?assignmentId=${assignmentId}`, { headers });
      setSubmissionsData(prev => ({ ...prev, [assignmentId]: res.data.submissions }));
    } catch (error) { alert("Error evaluating submission."); }
  };

  const handleDeleteItem = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const headers = { Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}` };
      await axios.delete(`${import.meta.env.VITE_SERVER_ENDPOINT}/lms/${type}/${id}`, { headers });
      fetchClassData();
    } catch (error) { alert(`Error deleting ${type}.`); }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)}>
          <Tab label="Materials" />
          <Tab label="Announcements" />
          <Tab label="Polls" />
          <Tab label="Videos" />
          {role === 'teacher' && <Tab label="Students" />}
          <Tab label="Assignments" />
          <Tab label="Messages" />
        </Tabs>
      </Box>

      {/* MATERIALS */}
      <TabPanel value={tabValue} index={0}>
        {role === 'teacher' && (
          <Box className="glass-panel" sx={{ mb: 4, p: 3, borderRadius: 3 }}>
            <Typography variant="h6">Post New Material</Typography>
            <TextField fullWidth label="Title" margin="normal" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <TextField fullWidth label="Description" margin="normal" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
            <TextField fullWidth label="Link (optional)" margin="normal" value={newLink} onChange={e => setNewLink(e.target.value)} />
            <Box sx={{ mt: 2, mb: 1 }}>
              <Button variant="outlined" component="label">
                Upload PDF (Optional)
                <input type="file" hidden accept="application/pdf" onChange={e => setNewFile(e.target.files[0])} />
              </Button>
              {newFile && <Typography variant="body2" sx={{ display: 'inline', ml: 2 }}>{newFile.name}</Typography>}
            </Box>
            <Button variant="contained" sx={{ mt: 1 }} onClick={handlePostMaterial}>Post Material</Button>
          </Box>
        )}
        {materials.map(m => (
          <Box key={m._id} className="glass-panel" sx={{ mb: 3, p: 3, borderRadius: 3 }}>
            <Typography variant="h6">{m.title}</Typography>
            <Typography variant="body2" color="text.secondary">By {m.teacherId?.fullName}</Typography>
            <Typography sx={{ mt: 1 }}>{m.description}</Typography>
            {m.link && <Box><a href={m.link} target="_blank" rel="noreferrer">View Link</a></Box>}
            {m.fileUrl && (
              <Box sx={{ mt: 1 }}>
                <Button variant="outlined" href={`${import.meta.env.VITE_SERVER_ENDPOINT}/materials/${m.fileUrl}`} target="_blank">
                  Download PDF
                </Button>
              </Box>
            )}
            {role === 'teacher' && (
              <Button variant="text" color="error" onClick={() => handleDeleteItem('materials', m._id)} sx={{ mt: 1, p: 0 }}>
                Delete Material
              </Button>
            )}
          </Box>
        ))}
      </TabPanel>

      {/* ANNOUNCEMENTS */}
      <TabPanel value={tabValue} index={1}>
        {role === 'teacher' && (
          <Box className="glass-panel" sx={{ mb: 4, p: 3, borderRadius: 3 }}>
            <Typography variant="h6">Post Announcement</Typography>
            <TextField fullWidth label="Title" margin="normal" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <TextField fullWidth multiline rows={3} label="Content" margin="normal" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
            <FormControlLabel 
              control={<Checkbox checked={isUrgent} onChange={e => setIsUrgent(e.target.checked)} color="error" />}
              label="Mark as Urgent"
            />
            <Box>
              <Button variant="contained" sx={{ mt: 1 }} onClick={handlePostAnnouncement}>Post</Button>
            </Box>
          </Box>
        )}
        {announcements.map(a => (
          <Box key={a._id} className="glass-panel" sx={{ mb: 3, p: 3, borderRadius: 3, border: a.urgent ? '2px solid red' : 'inherit', backgroundColor: a.urgent ? '#fff5f5' : 'transparent' }}>
            <Typography variant="h6" color={a.urgent ? 'error' : 'inherit'}>
              {a.urgent && '⚠️ '} {a.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">By {a.teacherId?.fullName}</Typography>
            <Typography sx={{ mt: 1 }}>{a.content}</Typography>
            {role === 'teacher' && (
              <Button variant="text" color="error" onClick={() => handleDeleteItem('announcements', a._id)} sx={{ mt: 1, p: 0 }}>
                Delete Announcement
              </Button>
            )}
          </Box>
        ))}
      </TabPanel>

      {/* POLLS */}
      <TabPanel value={tabValue} index={2}>
        {role === 'teacher' && (
          <Box className="glass-panel" sx={{ mb: 4, p: 3, borderRadius: 3 }}>
            <Typography variant="h6">Create Poll</Typography>
            <TextField fullWidth label="Question" margin="normal" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            {pollOptions.map((opt, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TextField 
                  fullWidth 
                  size="small"
                  label={`Option ${index + 1}`} 
                  value={opt} 
                  onChange={e => {
                    const newOpts = [...pollOptions];
                    newOpts[index] = e.target.value;
                    setPollOptions(newOpts);
                  }} 
                />
                {pollOptions.length > 2 && (
                  <Button color="error" sx={{ ml: 1 }} onClick={() => {
                    const newOpts = pollOptions.filter((_, i) => i !== index);
                    setPollOptions(newOpts);
                  }}>Remove</Button>
                )}
              </Box>
            ))}
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" sx={{ mr: 2 }} onClick={() => setPollOptions([...pollOptions, ''])}>+ Add Option</Button>
              <Button variant="contained" onClick={handlePostPoll}>Create Poll</Button>
            </Box>
          </Box>
        )}
        {polls.map(p => {
          const totalVotes = p.options.reduce((sum, opt) => sum + opt.votes, 0);
          return (
            <Box key={p._id} sx={{ mb: 3, p: 3, border: '1px solid #e0e0e0', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>{p.question}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Posted by {p.teacherId?.fullName}</Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {p.options.map(opt => {
                  const percentage = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
                  return (
                    <Box 
                      key={opt._id} 
                      onClick={() => handleVote(p._id, opt._id)}
                      sx={{ 
                        position: 'relative', 
                        cursor: 'pointer',
                        border: '1px solid #ccc',
                        borderRadius: 2,
                        overflow: 'hidden',
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: '#1976d2', backgroundColor: 'rgba(25, 118, 210, 0.04)' }
                      }}
                    >
                      <Box sx={{ 
                        position: 'absolute', 
                        left: 0, 
                        top: 0, 
                        bottom: 0, 
                        width: `${percentage}%`, 
                        backgroundColor: 'rgba(25, 118, 210, 0.15)',
                        zIndex: 0,
                        transition: 'width 0.5s ease-out'
                      }} />
                      <Box sx={{ position: 'relative', zIndex: 1, p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 500 }}>{opt.text}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{percentage}% ({opt.votes})</Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'right' }}>
                {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} total
              </Typography>
              {role === 'teacher' && (
                <Button variant="text" color="error" onClick={() => handleDeleteItem('polls', p._id)} sx={{ mt: 1, p: 0 }}>
                  Delete Poll
                </Button>
              )}
            </Box>
          );
        })}
      </TabPanel>

      {/* VIDEOS */}
      <TabPanel value={tabValue} index={3}>
        {role === 'teacher' && (
          <Box sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="h6">Upload Video Class</Typography>
            <TextField fullWidth label="Video Title" margin="normal" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <TextField fullWidth label="Video Description" margin="normal" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
            <Box sx={{ mt: 2, mb: 1 }}>
              <Button variant="outlined" component="label">
                Select Video File
                <input type="file" hidden accept="video/mp4,video/x-m4v,video/*" onChange={e => setNewFile(e.target.files[0])} />
              </Button>
              {newFile && <Typography variant="body2" sx={{ display: 'inline', ml: 2 }}>{newFile.name}</Typography>}
            </Box>
            <Button variant="contained" sx={{ mt: 1 }} onClick={handlePostVideo}>Upload Video</Button>
          </Box>
        )}
        {videos.map(v => (
          <Box key={v._id} className="glass-panel" sx={{ mb: 3, p: 3, borderRadius: 3 }}>
            <Typography variant="h6">{v.title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>By {v.teacherId?.fullName}</Typography>
            <Typography sx={{ mb: 2 }}>{v.description}</Typography>
            <Box sx={{ width: '100%', maxWidth: '800px', margin: '0 auto', borderRadius: 2, overflow: 'hidden' }}>
              <video controls style={{ width: '100%' }}>
                <source src={`${import.meta.env.VITE_SERVER_ENDPOINT}/videos/${v.fileUrl}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
            {role === 'teacher' && (
              <Button variant="text" color="error" onClick={() => handleDeleteItem('videos', v._id)} sx={{ mt: 2, p: 0 }}>
                Delete Video
              </Button>
            )}
          </Box>
        ))}
      </TabPanel>

      {/* STUDENTS TAB */}
      {role === 'teacher' && (
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h5" sx={{ mb: 2 }}>Enrolled Students ({students.length})</Typography>
          {students.length === 0 ? (
            <Typography>No students have joined this class yet.</Typography>
          ) : (
            <List>
              {students.map(s => (
                <ListItem key={s._id} sx={{ borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                  <ListItemText primary={s.fullName} secondary={s.email} />
                  <Button variant="outlined" size="small" onClick={() => { setSelectedStudent(s); setMessageDialogOpen(true); }}>
                    Message
                  </Button>
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>
      )}

      {/* ASSIGNMENTS TAB */}
      <TabPanel value={tabValue} index={role === 'teacher' ? 5 : 4}>
        {role === 'teacher' && (
          <Box className="glass-panel" sx={{ mb: 4, p: 3, borderRadius: 3 }}>
            <Typography variant="h6">Post New Assignment</Typography>
            <TextField fullWidth label="Title" margin="normal" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <TextField fullWidth label="Description" margin="normal" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
            <Box sx={{ mt: 2, mb: 1 }}>
              <Button variant="outlined" component="label">
                Attach File (Optional)
                <input type="file" hidden onChange={e => setNewFile(e.target.files[0])} />
              </Button>
              {newFile && <Typography variant="body2" sx={{ display: 'inline', ml: 2 }}>{newFile.name}</Typography>}
            </Box>
            <Button variant="contained" sx={{ mt: 1 }} onClick={handlePostAssignment}>Post Assignment</Button>
          </Box>
        )}

        {assignments.map(a => (
          <Box key={a._id} className="glass-panel" sx={{ mb: 3, p: 3, borderRadius: 3 }}>
            <Typography variant="h6">{a.title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>By {a.teacherId?.fullName}</Typography>
            <Typography sx={{ mb: 2 }}>{a.description}</Typography>
            {a.fileUrl && (
              <Button variant="outlined" size="small" href={`${import.meta.env.VITE_SERVER_ENDPOINT}/assignments/${a.fileUrl}`} target="_blank" sx={{ mb: 2 }}>
                Download Attachment
              </Button>
            )}
            
            {role === 'teacher' ? (
              <Box sx={{ mt: 2, borderTop: '1px solid #eee', pt: 2 }}>
                <Button variant="text" onClick={() => fetchSubmissions(a._id)}>
                  {expandedAssignment === a._id ? 'Hide Submissions' : 'View Submissions'}
                </Button>
                {expandedAssignment === a._id && (
                  <Box sx={{ mt: 2, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Student Submissions</Typography>
                    {(!submissionsData[a._id] || submissionsData[a._id].length === 0) ? (
                      <Typography variant="body2">No submissions yet.</Typography>
                    ) : (
                      <List>
                        {submissionsData[a._id].map(sub => (
                          <ListItem key={sub._id} sx={{ borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
                            <FormControlLabel
                              control={<Checkbox checked={sub.evaluated} onChange={() => handleEvaluate(sub._id, sub.evaluated, a._id)} />}
                              label="Evaluated"
                            />
                            <ListItemText 
                              primary={`${sub.studentId?.fullName} (USN: ${sub.studentId?.usn || 'N/A'})`} 
                              secondary={`Submitted: ${new Date(sub.submittedAt).toLocaleString()}`} 
                              sx={{ ml: 2 }}
                            />
                            <Button variant="outlined" size="small" href={`${import.meta.env.VITE_SERVER_ENDPOINT}/submissions/${sub.fileUrl}`} target="_blank">
                              Download
                            </Button>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ mt: 2, borderTop: '1px solid #eee', pt: 2 }}>
                {a.submissionStatus === 'evaluated' ? (
                  <Typography color="success.main" sx={{ fontWeight: 'bold' }}>Assignment Evaluated</Typography>
                ) : a.submissionStatus === 'submitted' ? (
                  <Typography color="primary.main">Assignment Submitted (Pending Evaluation)</Typography>
                ) : (
                  <Button variant="contained" component="label">
                    Submit Assignment
                    <input type="file" hidden onChange={e => handleUploadSubmission(a._id, e.target.files[0])} />
                  </Button>
                )}
              </Box>
            )}
          </Box>
        ))}
      </TabPanel>

      {/* MESSAGES TAB */}
      <TabPanel value={tabValue} index={role === 'teacher' ? 6 : 5}>
        <Typography variant="h5" sx={{ mb: 2 }}>{role === 'teacher' ? 'Sent Messages' : 'Received Messages'}</Typography>
        {messages.length === 0 ? (
          <Typography>No messages found.</Typography>
        ) : (
          <List>
            {messages.map(m => (
              <Box key={m._id} className="glass-panel" sx={{ mb: 3, p: 3, borderRadius: 3, borderLeft: m.isUrgent ? '4px solid red' : 'none' }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  {role === 'teacher' ? `To: ${m.receiverId?.fullName} (${m.receiverId?.email})` : `From: ${m.senderId?.fullName} (${m.senderId?.email})`} - {new Date(m.createdAt).toLocaleString()}
                </Typography>
                <Typography>{m.content}</Typography>
              </Box>
            ))}
          </List>
        )}
      </TabPanel>

      {/* MESSAGE DIALOG */}
      <Dialog open={messageDialogOpen} onClose={() => setMessageDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Message to {selectedStudent?.fullName}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Message"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSendMessage} variant="contained">Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClassDetails;
