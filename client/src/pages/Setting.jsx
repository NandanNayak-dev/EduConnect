import { Box, Grid, Typography, Card, CardContent, Divider, useTheme } from "@mui/material";
import ChangePassword from "../../components/setting/ChangePassword";
import SecurityIcon from '@mui/icons-material/Security';

const Setting = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ pb: 4 }}>
      <Typography variant="h4" fontWeight={600} mb={3} color="text.primary">
        Settings
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    display: 'flex'
                  }}
                >
                  <SecurityIcon color="primary" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Security
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Update your password and secure your account
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 4 }} />
              
              <ChangePassword />
            </CardContent>
          </Card>
        </Grid>
        
        {/* Placeholder for future settings like Notifications, Preferences, etc. */}
        <Grid item xs={12} md={6}>
          {/* Add more setting cards here in the future */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Setting;
