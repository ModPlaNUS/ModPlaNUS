import * as React from "react";
import {
  Button,
  Paper,
  Typography,
  Box,
  CssBaseline,
  TextField,
} from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase-config";

import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = React.useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <>
      <CssBaseline />

      <Box className="forgot-root">
        {/* Background illustration */}
        <Box className="forgot-image" />

        {/* Centered overlay */}
        <Box className="forgot-overlay">
          <Paper className="forgot-paper">
            <Box className="forgot-box">
              <Typography
                component="h1"
                variant="h5"
                className="forgot-title"
              >
                Reset your password
              </Typography>

              <Typography className="forgot-subtitle">
                Enter your email and we’ll send you a reset link.
              </Typography>

              {/* FORM = spacing + keyboard + accessibility */}
              <Box className="forgot-form" component="form" onSubmit={handleSubmit}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="forgot-input"
                  margin="none"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="forgot-button"
                >
                  Send reset link
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
