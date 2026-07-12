import { Box, Typography, Card, IconButton, Chip, useTheme, alpha } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

import useEduConnect from "../hooks/useEduConnect";

const MyPost = () => {
  const [data, setData] = useState([]);
  const theme = useTheme();
  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useEduConnect();

  useEffect(() => {
    const fetchData = async () => {
      setLoadingStatus(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_ENDPOINT}/posts`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get(
                import.meta.env.VITE_TOKEN_KEY
              )}`,
            },
          }
        );
        if (response.data.status) {
          setData(response.data.posts);
        } else {
          setLoadingStatus(false);
          setAlertBoxOpenStatus(true);
          setAlertSeverity(response.data.status ? "success" : "error");
          setAlertMessage(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingStatus(false);
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage("Something Went Wrong");
        error.response?.data?.message
          ? setAlertMessage(error.response.data.message)
          : setAlertMessage(error.message);
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchData();
  }, []);

  if (data.length === 0) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h5" color="text.secondary" fontWeight={600}>
          No Posts Available
        </Typography>
      </Box>
    );
  }

  const handleDelete = async (postId) => {
    try {
      setLoadingStatus(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );
      if (response.data.status) {
        setData(data.filter((item) => item._id !== postId));
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage(response.data.message);
      } else {
        setLoadingStatus(false);
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setLoadingStatus(false);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage("Something Went Wrong");
      error.response?.data?.message
        ? setAlertMessage(error.response.data.message)
        : setAlertMessage(error.message);
    }
  };

  const handleVisibility = async (postId) => {
    try {
      setLoadingStatus(true);
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/posts/change-visibility/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );
      if (response.data.status) {
        setData((prevData) =>
          prevData.map((post) =>
            post._id === postId
              ? { ...post, visibility: post.visibility === "public" ? "private" : "public" }
              : post
          )
        );
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage(response.data.message);
      } else {
        setLoadingStatus(false);
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setLoadingStatus(false);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage("Something Went Wrong");
      error.response?.data?.message
        ? setAlertMessage(error.response.data.message)
        : setAlertMessage(error.message);
    }
  };

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <Typography variant="h4" fontWeight={600} mb={3} color="text.primary">
        My Posts
      </Typography>
      <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer sx={{ width: "100%", maxHeight: "600px", "&::-webkit-scrollbar": { display: "none" } }}>
          <Table stickyHeader aria-label="posts table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, backgroundColor: alpha(theme.palette.primary.main, 0.05), color: "text.primary" }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: alpha(theme.palette.primary.main, 0.05), color: "text.primary" }}>Title</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, backgroundColor: alpha(theme.palette.primary.main, 0.05), color: "text.primary" }}>Reactions</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, backgroundColor: alpha(theme.palette.primary.main, 0.05), color: "text.primary" }}>Comments</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, backgroundColor: alpha(theme.palette.primary.main, 0.05), color: "text.primary" }}>Visibility</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, backgroundColor: alpha(theme.palette.primary.main, 0.05), color: "text.primary" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  key={item._id}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Link style={{ textDecoration: 'none', color: theme.palette.primary.main, fontWeight: 600 }} to={`/posts/${item._id}`}>
                      {item.title}
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    <Chip size="small" label={item.reactions?.length || "0"} sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1), fontWeight: 600 }} />
                  </TableCell>
                  <TableCell align="center">
                    <Chip size="small" label={item.comments?.length || "0"} sx={{ backgroundColor: alpha(theme.palette.secondary.main, 0.1), fontWeight: 600 }} />
                  </TableCell>
                  <TableCell align="center">
                    {item.visibility === "private" ? (
                      <Chip 
                        size="small" 
                        icon={<VisibilityOffIcon fontSize="small" />} 
                        label="Private" 
                        variant="outlined" 
                        onClick={() => handleVisibility(item._id)} 
                        sx={{ cursor: "pointer" }}
                      />
                    ) : (
                      <Chip 
                        size="small" 
                        icon={<VisibilityIcon fontSize="small" />} 
                        label="Public" 
                        color="success" 
                        variant="outlined"
                        onClick={() => handleVisibility(item._id)} 
                        sx={{ cursor: "pointer" }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                      <IconButton size="small" color="primary">
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(item._id)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default MyPost;
