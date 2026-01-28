import * as React from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-config";

import "./SignIn.css";

const theme = createTheme();

export default function SignIn() {
  const [signInEmail, setSignInEmail] = React.useState("");
  const [signInPassword, setSignInPassword] = React.useState("");
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login(signInEmail, signInPassword);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Root wrapper */}
      <Box className="signin-root">
        
        {/* Background image layer */}
        <Box className="signin-image" />

        {/* Overlay content */}
        <Box className="signin-overlay">
          <Paper className="signin-paper">
            <Box className="signin-box">

              <Avatar className="signin-avatar">
                <LockOutlinedIcon />
              </Avatar>

              <Typography component="h1" variant="h5" className="signin-title">
                Sign in
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                className="signin-form"
                data-testid="formSignIn"
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  inputProps={{ "data-testid": "email-input" }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="signin-button"
                data-testid="buttonSignIn"

              >
                Sign In
              </Button>

                <Box className="signin-links">
                  <Link
                    className="signin-link"
                    onClick={() => navigate("/forgotpassword")}
                  >
                    Forgot password
                  </Link>

                  <Link
                    className="signin-link"
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </Link>
                </Box>
              </Box>

            </Box>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
