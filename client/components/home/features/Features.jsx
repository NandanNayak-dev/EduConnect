import { Box, Grid, Typography, Card, CardContent, CardHeader, Avatar } from "@mui/material";
import ForumIcon from '@mui/icons-material/Forum';
import QuizIcon from '@mui/icons-material/Quiz';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TaskIcon from '@mui/icons-material/Task';

const featuresList = [
  {
    title: "Insight Exchange",
    subtitle: "Share your ideas and gain new perspectives.",
    description: "Engage with a community of learners by sharing your insights and reading others’ thoughts. Our platform facilitates rich discussions and collaborative learning, helping you develop and refine your ideas through feedback and interaction.",
    icon: <ForumIcon />,
    color: "#ff5f56"
  },
  {
    title: "Practice Exams",
    subtitle: "Test your knowledge anytime, anywhere.",
    description: "Take advantage of our comprehensive online test system to assess your knowledge and track your progress. With a variety of practice exams and quizzes tailored to your curriculum, you can improve your skills and boost your confidence before the big test.",
    icon: <QuizIcon />,
    color: "#ffbd2e"
  },
  {
    title: "Time Master",
    subtitle: "Optimize your study schedule and maximize productivity.",
    description: "Enhance your productivity with our time management tools designed specifically for students. Create personalized study plans, set time blocks for different tasks, and monitor your time usage to ensure you're making the most out of every study session.",
    icon: <ScheduleIcon />,
    color: "#27c93f"
  },
  {
    title: "Smart Task Organizer",
    subtitle: "Stay on top of your assignments and deadlines.",
    description: "Efficiently manage your workload with our task management tool. Set deadlines, create to-do lists, and get reminders to ensure you never miss a due date. Stay organized and keep track of your progress to achieve your academic goals with ease.",
    icon: <TaskIcon />,
    color: "#50cb95"
  }
];

const Features = () => {
  return (
    <Box sx={{ maxWidth: "1280px", mx: "auto", py: { xs: 6, md: 10 }, px: { xs: 3, md: 0 } }}>
      <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
        Platform Features
      </Typography>
      <Grid container spacing={4}>
        {featuresList.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease', '&:hover': { transform: 'translateY(-5px)' } }}>
              <CardHeader 
                avatar={
                  <Avatar sx={{ bgcolor: feature.color, width: 56, height: 56 }}>
                    {feature.icon}
                  </Avatar>
                }
                title={
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                }
              />
              <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  {feature.subtitle}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Features;
