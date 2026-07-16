import { Box, Card, CardContent, Typography, Avatar, useTheme, alpha } from "@mui/material";
import PropTypes from 'prop-types';

const ProfileCardDetails = ({ data }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 2,
        color: '#202124',
        border: '1px solid #dadce0',
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
                color: '#5f6368',
                fontWeight: 400
              }}
            >
              {data?.email || 'Loading...'}
            </Typography>
            {data?.role && (
              <Box sx={{ mt: 2, display: 'inline-block', backgroundColor: data.role === 'teacher' ? '#e8f0fe' : '#f1f3f4', px: 2, py: 0.5, borderRadius: 16 }}>
                <Typography variant="body2" sx={{ color: data.role === 'teacher' ? '#1a73e8' : '#5f6368', fontWeight: 500 }}>
                  {data.role === 'teacher' ? 'Teacher' : 'Student'}
                  {data.role === 'student' && data.usn ? ` - ${data.usn}` : ''}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{ 
              width: 90, 
              height: 90, 
              border: "1px solid #dadce0",
            }}
            alt={data?.fullName}
            src={data?.image || "https://cdn-icons-png.flaticon.com/512/5556/5556468.png"}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

ProfileCardDetails.propTypes = {
  data: PropTypes.object
}

export default ProfileCardDetails;
