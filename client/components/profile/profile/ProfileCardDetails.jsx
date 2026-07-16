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
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        borderRadius: 3,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
      }}
    >
      {/* Decorative background shape */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: -50, 
          right: -50, 
          width: 200, 
          height: 200, 
          borderRadius: '50%', 
          backgroundColor: 'rgba(255,255,255,0.1)' 
        }} 
      />
      
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
                opacity: 0.9,
                fontWeight: 500
              }}
            >
              {data?.email || 'Loading...'}
            </Typography>
            {data?.role && (
              <Box sx={{ mt: 2, display: 'inline-block', backgroundColor: data.role === 'teacher' ? 'rgba(6, 182, 212, 0.4)' : 'rgba(255, 255, 255, 0.2)', px: 3, py: 1, borderRadius: 4, border: '1px solid rgba(255,255,255,0.3)' }}>
                <Typography variant="subtitle1" sx={{ textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>
                  {data.role === 'teacher' ? '👨‍🏫 Teacher' : '🎓 Student'}
                  {data.role === 'student' && data.usn ? ` - ${data.usn}` : ''}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{ 
              width: 90, 
              height: 90, 
              border: "4px solid rgba(255,255,255,0.3)",
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
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
