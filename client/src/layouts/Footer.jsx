import {
  Grid,
  Typography,
  Box,
  Divider,
  Button,
  ListItemButton,
  ListItemText,
  List,
} from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "background.paper",
        color: "text.primary",
        paddingTop: "4rem",
        paddingBottom: "2rem",
        borderTop: 1,
        borderColor: "divider",
        mt: 'auto'
      }}
    >
      <Box maxWidth="1280px" mx="auto" px={3}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", gap: "10px", alignItems: "center", mb: 2 }}>
              <img src="/images/favicon.ico" width="40" alt="EduConnect" />
              <Typography
                sx={{
                  fontFamily: "'Outfit', sans-serif",
                  color: "text.primary",
                  fontWeight: 700
                }}
                variant="h5"
                component="h2"
              >
                EduConnect
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '300px' }}>
              Empowering Educators, Inspiring Students. Join our digital classroom to learn, collaborate, and succeed together.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Solutions
            </Typography>
            <List disablePadding>
              <ListItemButton sx={{ padding: "4px 0", "&:hover": { backgroundColor: "transparent", color: "primary.main" } }} component={Link} to="/case-studies">
                <ListItemText primary="Facebook" sx={{ margin: 0, '& .MuiListItemText-primary': { color: 'text.secondary', fontSize: '0.875rem' } }} />
              </ListItemButton>
              <ListItemButton sx={{ padding: "4px 0", "&:hover": { backgroundColor: "transparent", color: "primary.main" } }} component={Link} to="/blogs">
                <ListItemText primary="Linkedin" sx={{ margin: 0, '& .MuiListItemText-primary': { color: 'text.secondary', fontSize: '0.875rem' } }} />
              </ListItemButton>
              <ListItemButton sx={{ padding: "4px 0", "&:hover": { backgroundColor: "transparent", color: "primary.main" } }} component={Link} to="/blogs">
                <ListItemText primary="YouTube" sx={{ margin: 0, '& .MuiListItemText-primary': { color: 'text.secondary', fontSize: '0.875rem' } }} />
              </ListItemButton>
            </List>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Products
            </Typography>
            <List disablePadding>
              <ListItemButton sx={{ padding: "4px 0", "&:hover": { backgroundColor: "transparent", color: "primary.main" } }} component={Link} to="/community">
                <ListItemText primary="Community" sx={{ margin: 0, '& .MuiListItemText-primary': { color: 'text.secondary', fontSize: '0.875rem' } }} />
              </ListItemButton>
              <ListItemButton sx={{ padding: "4px 0", "&:hover": { backgroundColor: "transparent", color: "primary.main" } }} component={Link} to="/forums">
                <ListItemText primary="Forums" sx={{ margin: 0, '& .MuiListItemText-primary': { color: 'text.secondary', fontSize: '0.875rem' } }} />
              </ListItemButton>
            </List>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Company
            </Typography>
            <List disablePadding>
              <ListItemButton sx={{ padding: "4px 0", "&:hover": { backgroundColor: "transparent", color: "primary.main" } }} component={Link} to="/about">
                <ListItemText primary="About Us" sx={{ margin: 0, '& .MuiListItemText-primary': { color: 'text.secondary', fontSize: '0.875rem' } }} />
              </ListItemButton>
              <ListItemButton sx={{ padding: "4px 0", "&:hover": { backgroundColor: "transparent", color: "primary.main" } }} component={Link} to="/career">
                <ListItemText primary="Careers" sx={{ margin: 0, '& .MuiListItemText-primary': { color: 'text.secondary', fontSize: '0.875rem' } }} />
              </ListItemButton>
              <ListItemButton sx={{ padding: "4px 0", "&:hover": { backgroundColor: "transparent", color: "primary.main" } }} component={Link} to="/contact">
                <ListItemText primary="Contact Us" sx={{ margin: 0, '& .MuiListItemText-primary': { color: 'text.secondary', fontSize: '0.875rem' } }} />
              </ListItemButton>
            </List>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Contact
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">1-800-600-0464</Typography>
              <Typography variant="body2" color="text.secondary">support@educonnect.com</Typography>
              <Typography variant="body2" color="text.secondary">900-140 10th Avenue SE</Typography>
              <Typography variant="body2" color="text.secondary">Calgary, AB TG 0R1</Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" gap={2}>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} EduConnect. All rights reserved.
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": { backgroundColor: "transparent", color: "primary.main" },
              }}
            >
              Privacy Policy
            </Button>
            <Button
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": { backgroundColor: "transparent", color: "primary.main" },
              }}
            >
              Terms of Service
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
