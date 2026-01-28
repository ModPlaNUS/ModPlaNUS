import * as React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./NotFoundPage.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box className="notfound">
      <Box className="notfound-overlay">
        <Typography variant="h2" className="notfound-code">
          404
        </Typography>

        <Typography variant="h5" className="notfound-title">
          Page Not Found
        </Typography>

        <Typography className="notfound-text">
          Looks like you’ve wandered off the academic path.
          This page doesn’t exist (yet 👀).
        </Typography>

        <Button
          variant="contained"
          className="notfound-btn"
          onClick={() => navigate("/")}
        >
          Go Home
        </Button>
      </Box>
    </Box>
  );
}
