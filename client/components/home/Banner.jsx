import { Box, Grid, TextField, Typography, Stack, Chip } from '@mui/material';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';

const Banner = () => {
    return (
        <>
            <Grid minHeight="92vh" maxWidth="1280px" mx="auto" container spacing={4} justifyContent="center" alignItems="center" sx={{ p: { xs: 3, md: 0 }, py: { xs: 8, md: 0 } }}>
                <Grid item xs={12} md={6} >
                    <Box sx={{ display: "flex", gap: "5px", color: "#797979" }}  >
                        <ConnectWithoutContactIcon />
                        <Typography variant="body1" >Empowering Educators, Inspiring Students</Typography>
                    </Box>
                    <Typography
                        sx={{
                            fontFamily: "Platypi",
                            color: "text.primary",
                            margin: "5px 0 30px 0",
                            fontSize: { xs: '2.5rem', md: '4rem' }
                        }}
                        variant="h1"
                        component="h1"
                    >EduConnect</Typography>
                    <Typography sx={{ color: "#797979" }} variant="body1">At EduConnect, our mission is to provide a dynamic and intuitive digital classroom that empowers teachers and students to learn, collaborate, and succeed together.</Typography>
                    <Box sx={{ margin: "30px 0 35px 0" }} />
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ rowGap: 1 }}>
                        <Chip label="online-learning" sx={{ backgroundColor: "secondary.main", color: "text.primary", cursor: "pointer" }} />
                        <Chip label="assignments" sx={{ backgroundColor: "secondary.main", color: "text.primary", cursor: "pointer" }} />
                        <Chip label="grading" sx={{ backgroundColor: "secondary.main", color: "text.primary", cursor: "pointer" }} />
                        <Chip label="collaboration" sx={{ backgroundColor: "secondary.main", color: "text.primary", cursor: "pointer" }} />
                        <Chip label="course-materials" sx={{ backgroundColor: "secondary.main", color: "text.primary", cursor: "pointer" }} />
                    </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                    <img style={{ width: "100%", maxWidth: "500px", display: "block", margin: "0 auto" }} src="/images/banner.png" alt="EduConnect" />
                </Grid>
            </Grid>
        </>
    )
}

export default Banner