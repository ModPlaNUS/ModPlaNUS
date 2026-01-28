import * as React from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { auth } from "./firebase-config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import "./SignOut.css";

const theme = createTheme();

export default function SignOut() {
  const navigate = useNavigate();

  const signout = async () => {
    await signOut(auth);
    alert("Signed Out!");
    navigate("/dashboard");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box className="signout-root">
        {/* Background */}
        <Box className="signout-image" />

        {/* Overlay */}
        <Box className="signout-overlay">
          <Paper className="signout-paper">
            <Box className="signout-box">
              <Avatar className="signout-avatar">
                <LockOutlinedIcon />
              </Avatar>

              <Typography
                component="h1"
                variant="h5"
                className="signout-title"
              >
                Do you want to sign out?
              </Typography>

              <Button
                fullWidth
                variant="contained"
                className="signout-button"
                onClick={signout}
              >
                Sign Out
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
