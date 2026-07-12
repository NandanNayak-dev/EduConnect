import { Box, Button, TextField, IconButton, Typography, Card, CardContent, useTheme, alpha } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useFormContext } from "react-hook-form";
import axios from "axios";
import useEduConnect from "../../../src/hooks/useEduConnect";
import Cookies from 'js-cookie'

const AddProductForm = () => {
  const theme = useTheme();
  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useEduConnect();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useFormContext();

  const onSubmit = async (data) => {
    const formPayload = new FormData();
    if (data.productimage && data.productimage[0] instanceof File) {
      formPayload.append("productimage", data.productimage[0]);
    }
    formPayload.append("title", data.title);
    formPayload.append("price", data.price);
    formPayload.append("description", data.description);

    try{
      setLoadingStatus(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/products`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
          },
        }
      );
      if (response.data.status) {
        reset();
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
      setAlertMessage("Something Went Wrong")
      error.response?.data?.message
        ? setAlertMessage(error.response.data.message)
        : setAlertMessage(error.message);
    } finally {
      setLoadingStatus(false);
    }
  };

  const productImage = watch("productimage");

  let productImageUrl = null;
  if (productImage && productImage[0] && productImage[0] instanceof File) {
    try {
      productImageUrl = URL.createObjectURL(productImage[0]);
    } catch (error) {
      console.error("Error creating object URL:", error);
    }
  }

  return (
    <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3, mb: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={600} mb={4} color="text.primary">
          Add New Product
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" flexDirection="column" gap={3}>
            
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1} color="text.secondary">
                Product Title
              </Typography>
              <TextField
                placeholder="Enter an attractive product title"
                fullWidth
                variant="outlined"
                {...register("title", {
                  required: "Product title is required",
                })}
                error={!!errors.title}
                helperText={errors.title ? errors.title.message : ""}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>

            <Box>
               <Typography variant="subtitle2" fontWeight={600} mb={1} color="text.secondary">
                Product Image
              </Typography>
              {!productImageUrl ? (
                <Box 
                  onClick={() => document.getElementById("productimage").click()}
                  sx={{
                    border: `2px dashed ${theme.palette.divider}`,
                    borderRadius: 3,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backgroundColor: alpha(theme.palette.primary.main, 0.02),
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      borderColor: theme.palette.primary.main
                    }
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" fontWeight={600} color="text.primary">
                    Click to upload product image
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    PNG or JPG (max. 800x400px)
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ position: "relative", display: "inline-block", borderRadius: 3, overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
                  <img
                    src={productImageUrl}
                    alt="Product preview"
                    style={{ display: 'block', maxWidth: '300px', maxHeight: '200px', objectFit: 'cover' }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: 'error.main',
                      boxShadow: 1,
                      '&:hover': { backgroundColor: '#fff' }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setValue("productimage", null);
                      document.getElementById("productimage").value = "";
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
              
              <input
                id="productimage"
                style={{ display: "none" }}
                type="file"
                {...register("productimage", {
                  required: "Image file is required",
                  validate: {
                    validFileType: (value) =>
                      (value &&
                        value.length > 0 &&
                        ["image/jpeg", "image/png"].includes(value[0].type)) ||
                      "Only JPEG and PNG files are allowed",
                  },
                })}
              />
              {errors.productimage && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                  {errors.productimage.message}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1} color="text.secondary">
                Price (USD)
              </Typography>
              <TextField
                placeholder="0.00"
                fullWidth
                variant="outlined"
                {...register("price", {
                  required: "Product price is required",
                })}
                error={!!errors.price}
                helperText={errors.price ? errors.price.message : ""}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1} color="text.secondary">
                Description
              </Typography>
              <TextField
                placeholder="Describe your product in detail..."
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                {...register("description", {
                  required: "Description is required",
                })}
                error={!!errors.description}
                helperText={errors.description ? errors.description.message : ""}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="contained"
                size="large"
                type="submit"
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1
                }}
              >
                Add Product
              </Button>
            </Box>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddProductForm;
