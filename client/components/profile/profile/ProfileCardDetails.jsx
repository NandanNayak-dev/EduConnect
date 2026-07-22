import { Box, Card, CardContent, Typography, Avatar, useTheme, alpha, IconButton, CircularProgress } from "@mui/material";
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
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 2,
        color: 'text.primary',
        boxShadow: 'none',
      }}
    >
      
      <CardContent sx={{ position: 'relative', zIndex: 1, p: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 1,
                letterSpacing: '-0.5px'
              }}
            >
              {data?.fullName || 'Loading...'}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontWeight: 400
              }}
            >
              {data?.email || 'Loading...'}
            </Typography>
            {data?.role && (
              <Box sx={{ mt: 2, display: 'inline-block', backgroundColor: data.role === 'teacher' ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.text.secondary, 0.1), px: 2, py: 0.5, borderRadius: 16 }}>
                <Typography variant="body2" sx={{ color: data.role === 'teacher' ? theme.palette.primary.main : 'text.secondary', fontWeight: 500 }}>
                  {data.role === 'teacher' ? 'Teacher' : 'Student'}
                  {data.role === 'student' && data.usn ? ` - ${data.usn}` : ''}
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ position: 'relative' }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-upload-input"
              type="file"
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload-input">
              <IconButton component="span" disabled={uploading} sx={{ p: 0 }}>
                <Avatar
                  sx={{ 
                    width: 90, 
                    height: 90, 
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: data?.image ? 'transparent' : theme.palette.primary.main,
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    opacity: uploading ? 0.5 : 1
                  }}
                  alt={data?.fullName}
                  src={data?.image}
                >
                  {!data?.image && getInitials(data?.fullName)}
                </Avatar>
                {uploading && (
                  <CircularProgress
                    size={40}
                    sx={{
                      color: theme.palette.primary.main,
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-20px',
                      marginLeft: '-20px',
                    }}
                  />
                )}
              </IconButton>
            </label>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

ProfileCardDetails.propTypes = {
  data: PropTypes.object
}

export default ProfileCardDetails;
