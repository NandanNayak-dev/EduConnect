import { Box } from "@mui/material";
import NavBar from "../layouts/NavBar";

const NotFound = () => {
  return (
    <>
      <NavBar />
      <Box maxWidth="1280px" mx="auto">
        <img src="/images/error.jpg" alt="NOTFOUND" style={{ width: "100%" }} />
      </Box>
    </>
  );
};

export default NotFound;
