import React from "react";
import { useState } from "react";
import Box from "../module-planner/Components/Box/Box";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import { InputAdornment } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
var temp;



const theme = createTheme();

export default function Calculator() {
  const [addGradeText, setAddGradeText] = useState("");
  const [Module, setModule] = useState([]);
  const [addMC, setAddMC] = useState(0);
  const [credits, setCredits] = useState(0);
  const [mc, setMC] = useState(0);
  const [addModuleText, setAddModuleText] = useState("");
  const [cmc, setCMC] = useState(20);
  const [cap, setCap] = useState(5);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  function handleAddModule(event) {
    // React honours default browser behavior and the
    // default behaviour for a form submission is to
    // submit AND refresh the page. So we override the
    // default behaviour here as we don't want to refresh
    event.preventDefault();
    addModule(addModuleText, addGradeText, addMC);
    console.log(addModuleText);
  }

  function addModule(description, desc, des) {
    const newModule = [
      ...Module,
      {
        des: des,
        desc: desc,
        description: description,
        isComplete: false
      }
    ];
    console.log(desc !== "S");
    if (desc !== "S" && desc !== "U") {
      setMC(mc + des * 1);
    }
    else {
      setMC(mc);
    }
    setCredits(credits + (des * ComputeC(desc)));
    const newNew = newModule.map((m) => m.description);
    setModule(newModule);
    //console.log(newModule);
    console.log(newNew);
    //setS(newNew);
  }

  const database = firebase.database();

  const handleSubmit = (e) => {
    //console.log(user?.email);
    e.preventDefault();
    // const users = firebase.database().ref('User');
   // const currUserEmail = firebase.auth().currentUser.email;
    
   const currUser = firebase.auth().currentUser;
   //console.log('HIII' + currUser.name);
   database.ref('/cap/'+ firstName + lastName).set(
    {
      firstName : firstName,
      lastName : lastName,
      Module : Module,
      Grade : addGradeText,
      cap: (credits + (cap*cmc)) / (mc + cmc)
    }).then(() => {
      window.alert('user cap information added to database!');
    })
    .catch(error => {
      console.error(error);
    });

    //users.push(user);
  };

  // const deleteProfile = () => {
  //   database.ref('/cap/').child(firstName + lastName).remove()
  //   .then(() => {
  //     window.alert('user cap information removed from database!');
  //   })
  //   .catch(error => {
  //     console.error(error);
  //   });
  // };

  function ComputeC(grade) {
    if (grade === "A+" || grade === "A") {
      return 5;
    }
    if (grade === "A-") {
      return 4.5;
    }
    if (grade === "B+") {
      return 4;
    }
    if (grade === "B") {
      return 3.5;
    }
    if (grade === "B-") {
      return 3;
    }
    if (grade === "C+") {
      return 2.5;
    }
    if (grade === "C") {
      return 2;
    }
    if (grade === "D+") {
      return 1.5;
    }
    if (grade === "D") {
      return 1;
    }
    if (grade === "F") {
      return 0;
    }
    if (grade === "S") {
      return 0;
    }
    if (grade === "U") {
      return 0;
    }
  }

  function CAP(cred, mcs) {
    setCredits(credits + cred);
    setMC(mc + mcs);
  }

  return (
    <>
      <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1656660364352-3a504c39bde2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1NzEyNTEzOA&ixlib=rb-1.2.1&q=80&w=1080)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              CAP Calculator!
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}
>
            <h2>Add Data</h2>
            <form onSubmit={handleAddModule}>
              Module Name
              <label>
                <Input
                  style={{ margin: "0 1rem" }}
                  type="text"
                  value={addModuleText}
                  onChange={(event) => {

                        setAddModuleText(event.target.value);

                  }
                  }
                />
              </label>
            </form>
            <p> </p>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 275 }} onSubmit={handleAddModule}>
              <InputLabel id="demo-simple-select-standard-label"> Grade </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                type="text"
                value={addGradeText}
                onChange={(event) => {
                  temp = event.target.value; 
                  setAddGradeText(event.target.value);
                }}
                label="Grade"
              >
                <MenuItem value="">
                </MenuItem>
                <MenuItem value = {"A+"}>A+</MenuItem>
                <MenuItem value = {"A"}>A</MenuItem>
                <MenuItem value = {"A-"}>A-</MenuItem>
                <MenuItem value = {"B+"}>B+</MenuItem>
                <MenuItem value = {"B"}>B</MenuItem>
                <MenuItem value = {"B-"}>B-</MenuItem>
                <MenuItem value = {"C+"}>C+</MenuItem>
                <MenuItem value = {"C"}>C</MenuItem>
                <MenuItem value = {"D+"}>D+</MenuItem>
                <MenuItem value = {"D"}>D</MenuItem>
                <MenuItem value = {"F"}>F</MenuItem>
                <MenuItem value = {"S"}>S</MenuItem>
                <MenuItem value = {"U"}>U</MenuItem>
              </Select>
            </FormControl>
            <p> </p>
            <form onSubmit={handleAddModule}>
              Input MC
              <label>
                <Input
                  style={{ margin: "0 1rem" }}
                  type="text"
                  value={addMC}
                  onChange={(event) => {
                    if (temp === "S" || temp === "U") {
                      setAddMC(0);
                    }
                    else {
                      setAddMC(event.target.value);
                    }
                  }}
                />
              </label>
              <p> </p>
              <Button variant="contained">
                <Input type="submit" value="Add" />
              </Button>
            </form>
            <p> </p>
          </Box>

          <Box>
            <h2>Data of all modules</h2>
            <table style={{ margin: "0 auto", width: "100%" }}>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Modules</th>
                  <th>Grade</th>
                  <th>MC</th>
                  <th>MC*GP</th>
                </tr>
              </thead>
              <tbody>
                {Module.map((Mod, idx) => (
                  <tr key={Mod.description}>
                    <td>{idx + 1}</td>
                    <td>{Mod.description}</td>
                    <td>{Mod.desc}</td>
                    <td>{Mod.des}</td>
                    <td>{Mod.des * ComputeC(Mod.desc)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4>Cummulative CAP is: {cap}</h4>
            <h4>CAP is: {((credits + (cap*cmc)) / (mc + cmc)).toFixed(2)}</h4>

            <Grid item xs={12} m={5}>
            <Button variant="contained" 
            startIcon={<SaveIcon />} 
            sx ={{m: 4}}
            onClick={handleSubmit}
            >
            Save Changes
            </Button>
            {/* <Button variant="outlined" 
            startIcon={<DeleteIcon />}
            sx ={{m: 4}} 
            onClick={ deleteProfile }
            >
            Delete Account
            </Button> */}
            </Grid>
          </Box>
          <p> </p>
        </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
    </>
  );
}