import {
  Box,
  TextField,
  Button,
  InputBase,
  Chip,
  Typography,
  Card,
  CardContent,
  useTheme,
  alpha
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";

import SimpleMdeReact from "react-simplemde-editor";
import { marked } from "marked";
import DOMPurify from "dompurify";
import "easymde/dist/easymde.min.css";
import useEduConnect from "../hooks/useEduConnect";
import axios from "axios";
import Cookies from "js-cookie";

const AddPost = () => {
  const theme = useTheme();
  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useEduConnect();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm();
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && tag.trim() !== "") {
      event.preventDefault();
      if (!tags.includes(tag.trim())) {
        setTags([...tags, tag.trim()]);
      }
      setTag("");
      clearErrors("tags");
    }
  };

  const renderMarkdown = () => {
    const html = marked(description);
    return { __html: DOMPurify.sanitize(html) };
  };

  const handleRemoveTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
  };

  const onSubmit = async (data) => {
    if (tags.length === 0) {
      setError("tags", {
        type: "manual",
        message: "At least one tag is required",
      });
      return;
    }
    const trimmedDescription = description.trim();
    if (trimmedDescription.length === 0) {
      setError("description", {
        type: "manual",
        message: "Description is required",
      });
      return;
    }

    try {
      setLoadingStatus(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/posts`,
        {
          title: data.title,
          tags,
          description: trimmedDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
          },
        }
      );
      
      if (response.data.status) {
        reset();
        setTags([]);
        setDescription("");
      }
      setLoadingStatus(false);
      setAlertBoxOpenStatus(true);
      setAlertSeverity(response.data.status ? "success" : "error");
      setAlertMessage(response.data.message);
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

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <Typography variant="h4" fontWeight={600} mb={3} color="text.primary">
        Create New Post
      </Typography>

      <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3, overflow: 'visible' }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
              
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={1} color="text.primary">
                    Post Title
                  </Typography>
                  <TextField
                    placeholder="Enter an engaging title..."
                    fullWidth
                    variant="outlined"
                    {...register("title", { required: "Title is required" })}
                    error={!!errors.title}
                    helperText={errors.title ? errors.title.message : ""}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 2 }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={1} color="text.primary">
                    Tags
                  </Typography>
                  <Box
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      padding: "8px 12px",
                      borderRadius: 2,
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      flexWrap: "wrap",
                      minHeight: "56px",
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'
                    }}
                  >
                    {tags.map((item, index) => (
                      <Chip
                        key={index}
                        label={item}
                        size="small"
                        onDelete={() => handleRemoveTag(index)}
                        sx={{
                          backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                          color: theme.palette.secondary.main,
                          fontWeight: 600,
                          borderRadius: 1,
                          '& .MuiChip-deleteIcon': {
                            color: alpha(theme.palette.secondary.main, 0.7),
                            '&:hover': { color: theme.palette.secondary.main }
                          }
                        }}
                      />
                    ))}

                    <InputBase
                      sx={{
                        flex: 1,
                        minWidth: 120,
                        ml: 1,
                        outline: "none",
                        fontSize: "0.95rem"
                      }}
                      placeholder={tags.length === 0 ? "Type and press Enter to add tags..." : "Add tag..."}
                      value={tag}
                      onChange={(event) => setTag(event.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  </Box>
                  {errors.tags && (
                    <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block', ml: 2 }}>
                      {errors.tags.message}
                    </Typography>
                  )}
                </Box>

                {description && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600} mb={1} color="text.primary">
                      Preview
                    </Typography>
                    <Box 
                      sx={{ 
                        p: 3, 
                        border: `1px dashed ${theme.palette.divider}`, 
                        borderRadius: 2,
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : '#fafafa',
                        color: 'text.primary',
                        overflowX: 'auto'
                      }}
                      dangerouslySetInnerHTML={renderMarkdown()} 
                    />
                  </Box>
                )}
              </Box>

              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" fontWeight={600} mb={1} color="text.primary">
                  Description Details
                </Typography>
                <Box sx={{ flex: 1, '& .editor-toolbar': { borderColor: theme.palette.divider, opacity: theme.palette.mode === 'dark' ? 0.8 : 1 }, '& .CodeMirror': { borderColor: theme.palette.divider, borderRadius: '0 0 8px 8px', minHeight: '350px' } }}>
                  <SimpleMdeReact
                    id="description"
                    value={description}
                    onChange={setDescription}
                    options={{
                      spellChecker: false,
                      placeholder: "Write your detailed post content here in Markdown format..."
                    }}
                  />
                </Box>
                {errors.description && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block', ml: 2 }}>
                    {errors.description.message}
                  </Typography>
                )}
              </Box>

            </Box>

            <Box mt={4} display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1
                }}
              >
                Publish Post
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddPost;
