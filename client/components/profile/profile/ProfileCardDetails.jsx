import { Box, Card, CardContent, Typography, Avatar, useTheme, alpha, IconButton, CircularProgress, Divider, Grid } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ClassIcon from "@mui/icons-material/Class";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ProfileCardDetails = ({ data }) => {
  const theme = useTheme();
  const [uploading, setUploading] = useState(false);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER_ENDPOINT}/users/upload-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`
        }
      });
      if (response.data.status) {
        window.location.reload();
      } else {
        alert(response.data.message || 'Error uploading image');
      }
    } catch (error) {
      console.error('Error uploading image', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        mb: 4,
        borderRadius: 4,
        color: '#fff',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative circles */}
      <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }} />
      <Box sx={{ position: 'absolute', bottom: -100, left: 150, width: 300, height: 300, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }} />
      
      <CardContent sx={{ position: 'relative', zIndex: 1, p: { xs: 3, md: 5 } }}>
        <Grid container spacing={4} alignItems="center" justifyContent="space-between">
          
          {/* Left Side: Avatar and Details */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
              <Box sx={{ position: 'relative' }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-upload-input"
                  type="file"
                  onChange={handleAvatarChange}
                />
                <label htmlFor="avatar-upload-input">
                  <IconButton component="span" disabled={uploading} sx={{ p: 0, '&:hover': { opacity: 0.8 } }}>
                    <Avatar
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        border: `4px solid rgba(255,255,255,0.2)`,
                        bgcolor: data?.image ? 'transparent' : 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        opacity: uploading ? 0.5 : 1,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                      alt={data?.fullName}
                      src={data?.image}
                    >
                      {!data?.image && getInitials(data?.fullName)}
                    </Avatar>
                    {uploading && (
                      <CircularProgress size={40} sx={{ color: '#fff', position: 'absolute', top: '50%', left: '50%', mt: '-20px', ml: '-20px' }} />
                    )}
                  </IconButton>
                </label>
              </Box>

              <Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.5px' }}>
                  {data?.fullName || 'Loading...'}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, fontWeight: 400, mb: 2 }}>
                  {data?.email || 'Loading...'}
                </Typography>
                {data?.role && (
                  <Box sx={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', px: 2, py: 0.5, borderRadius: 16 }}>
                    <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, textTransform: 'capitalize' }}>
                      {data.role === 'teacher' ? 'Teacher' : 'Student'}
                      {data.role === 'student' && data.usn ? ` - ${data.usn}` : ''}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Right Side: Stats */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: { xs: 'center', md: 'space-around' }, backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 3, p: 3 }}>
              
              {data?.role === 'teacher' ? (
                <>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ color: '#fff', mb: 1, opacity: 0.9 }}>
                      <ClassIcon fontSize="large" />
                    </Box>
                    <Typography variant="h4" fontWeight={700}>{data?.totalClassesCreated ?? '-'}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>Classes Created</Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ color: '#fff', mb: 1, opacity: 0.9 }}>
                      <AssignmentIcon fontSize="large" />
                    </Box>
                    <Typography variant="h4" fontWeight={700}>{data?.totalAssignmentsPosted ?? '-'}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>Assignments Posted</Typography>
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ color: '#fff', mb: 1, opacity: 0.9 }}>
                      <ClassIcon fontSize="large" />
                    </Box>
                    <Typography variant="h4" fontWeight={700}>{data?.totalClassesJoined ?? '-'}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>Classes Joined</Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ color: '#fff', mb: 1, opacity: 0.9 }}>
                      <AssignmentTurnedInIcon fontSize="large" />
                    </Box>
                    <Typography variant="h4" fontWeight={700}>{data?.totalSubmissions ?? '-'}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>Submissions</Typography>
                  </Box>
                </>
              )}
              
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

ProfileCardDetails.propTypes = {
  data: PropTypes.object
}

export default ProfileCardDetails;
