import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
  alpha,
  useTheme
} from "@mui/material";
import { useEffect, useState } from "react";
import useEduConnect from "../hooks/useEduConnect";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";

const MyProduct = () => {
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
          `${import.meta.env.VITE_SERVER_ENDPOINT}/products`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get(
                import.meta.env.VITE_TOKEN_KEY
              )}`,
            },
          }
        );
        if (response.data.status) {
          setData(response.data.products);
        } else {
          setAlertBoxOpenStatus(true);
          setAlertSeverity("error");
          setAlertMessage(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(
          error.response?.data?.message || "Something Went Wrong"
        );
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
          No Products Available
        </Typography>
      </Box>
    );
  }

  const handleRemove = async (productId) => {
    try {
      setLoadingStatus(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );
      if (response.data.status) {
        setData(data.filter((item) => item._id !== productId));
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

  const handleEdit = (productId) => {
    console.log(`Edit button clicked for ${productId}`);
  };

  return (
    <Box
      sx={{
        pb: 4,
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Typography variant="h4" fontWeight={600} mb={3} color="text.primary">
        My Products
      </Typography>
      <Grid container spacing={3} paddingBottom={5}>
        {data.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={4}>
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                  borderColor: alpha(theme.palette.primary.main, 0.5)
                }
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  cursor: "pointer",
                  overflow: "hidden",
                  '&:hover img': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={`${
                    import.meta.env.VITE_SERVER_ENDPOINT
                  }/productimage/${product.image}`}
                  alt={product.title}
                  sx={{ transition: 'transform 0.5s ease' }}
                />
                
                {/* Gradient overlay for buttons to contrast against */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 50%)',
                    pointerEvents: 'none'
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    bottom: 12,
                    right: 12,
                    display: "flex",
                    gap: 1,
                    pointerEvents: 'auto'
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{
                      color: "primary.main",
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(4px)',
                      "&:hover": { backgroundColor: "#fff", transform: 'scale(1.1)' },
                      transition: 'all 0.2s'
                    }}
                    onClick={(e) => { e.preventDefault(); handleEdit(product._id); }}
                  >
                    <EditOutlined fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{
                      color: "error.main",
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(4px)',
                      "&:hover": { backgroundColor: "#fff", transform: 'scale(1.1)' },
                      transition: 'all 0.2s'
                    }}
                    onClick={(e) => { e.preventDefault(); handleRemove(product._id); }}
                  >
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Link
                to={`/products/${product._id}`}
                style={{ textDecoration: "none" }}
              >
                <CardContent
                  sx={{
                    padding: 2.5,
                    "&:last-child": { paddingBottom: 2.5 }
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap={2}
                  >
                    <Typography 
                      variant="h6" 
                      fontWeight={700}
                      color="text.primary"
                      sx={{ 
                        lineHeight: 1.2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {product.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      color="primary.main"
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      ${product.price}
                    </Typography>
                  </Box>
                </CardContent>
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MyProduct;
