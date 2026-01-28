import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from './firebase-config';
import { db } from "./firebase-config";
import {
  setDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import "./SignUp.css";

const theme = createTheme();

export default function SignUp() {
  const goTo = useNavigate();
  const routeHome = () =>{ 
    let path = `/home`; 
    goTo(path);
  }

  const routeChange = () =>{ 
    let path = `/signin`; 
    goTo(path);
  }

  const signup = async (em, ps, userProfile) => {
    try{
      await createUserWithEmailAndPassword(auth, em, ps).then(user=> {
      const userRef = doc(db, "users", user.user.uid);
      setDoc(userRef, userProfile);
    })
    .then(()=>alert("Thank you for joining us!"))
    .then(routeHome);
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    const confirmpassword = data.get('confirmpassword');
    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const major = data.get('major');
    const minor = data.get('minor');
    const year = data.get('year');
    const semester = data.get('semester');
    const otherProgrammes = data.get('otherProgrammes');
    const displayName = data.get('displayName');

    const user = {
      email: email,
      displayName: displayName,
      firstName: firstName,
      lastName: lastName,
      major: major,
      minor: minor,
      year: year,
      semester: semester,
      otherProgrammes: otherProgrammes,
      Y1S1Planned: [],
      Y1S1CAP: 0,
      Y1S1MC:0,

      Y1S2Planned: [],
      Y1S2CAP:0,
      Y1S2MC:0,

      Y2S1Planned: [],
      Y2S1CAP:0,
      Y2S1MC:0,

      Y2S2Planned: [],
      Y2S2CAP:0,
      Y2S2MC:0,

      Y3S1Planned: [],
      Y3S1CAP:0,
      Y3S1MC:0,

      Y3S2Planned: [],
      Y3S2CAP:0,
      Y3S2MC:0,

      Y4S1Planned: [],
      Y4S1CAP:0,
      Y4S1MC:0,

      Y4S2Planned: [],
      Y4S2CAP:0,
      Y4S2MC:0,

      eligibleMods: [''],
      currentCAP: 0,
      currentMC: 0,
      warnings: [''],
    }

    if(email && firstName && lastName && displayName && major && year && semester && password && confirmpassword){
      if(confirmpassword===password){
        signup(email, password, user);
      } else { 
        alert("Please make sure your passwords match!");
      }
    } else {
      alert("Please enter all mandatory fields!");
    }
  };

  return (
  <ThemeProvider theme={theme}>
    <CssBaseline />

    <Box className="signup-root">
      {/* Background illustration */}
      <Box className="signup-image" />

      {/* Centered overlay */}
        <Box className="signup-overlay">
          <Paper className="signup-paper">
            <Box className="signup-box">
            <Avatar className="signup-avatar">
              <LockOutlinedIcon />
            </Avatar>

            <Typography
              component="h1"
              variant="h5"
              className="signup-title"
            >
              Sign up
            </Typography>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              className="signup-form"
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoComplete="given-name"
                    autoFocus
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="displayName"
                    label="Display Name"
                    name="displayName"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmpassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmpassword"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="year"
                    label="Year"
                    name="year"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="semester"
                    label="Semester"
                    name="semester"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="major"
                    label="Major"
                    name="major"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="minor"
                    label="Minor"
                    name="minor"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="otherProgrammes"
                    label="Other Programmes"
                    name="otherProgrammes"
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="signup-button"
              >
                Sign Up
              </Button>

              <Box className="signup-links">
                <Link
                  className="signup-link"
                  onClick={routeChange}
                >
                  Have an account? Sign in
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