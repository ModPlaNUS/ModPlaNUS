import React from "react";
import { useState } from "react";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import SaveIcon from '@mui/icons-material/Save';
import { db } from '../authentication/firebase-config';
import {
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import '@firebase/firestore'
var temp;



const theme = createTheme();

export default function Calculator() {
  const [addGradeText, setAddGradeText] = useState("");
  const [Module, setModule] = useState([]);
  const [addMC, setAddMC] = useState(0);
  const [credits, setCredits] = useState(0);
  const [mc, setMC] = useState(0);
  const [addModuleText, setAddModuleText] = useState("");
  const [cmc, setCMC] = useState(0);
  const [cap, setCap] = useState(0);
  const [userInfo, setUserInfo] = useState([]);

  function getInfo(){
    if(firebase.auth().currentUser){

      const user = onSnapshot(doc(db, "users", firebase.auth().currentUser.uid), 
       (doc) => {
         setUserInfo(doc.data());
        });
        return user;
      } else {
      }
  }

  React.useEffect(()=>{getInfo()}, []);
  React.useEffect(()=>{
    if(userInfo.currentCAPMC){
    setCMC(userInfo.currentCAPMC);
    setCap(userInfo.currentCAP);
    } else {
      setCMC(0);
    setCap(userInfo.currentCAP);
    }
  }, [userInfo]);

  function handleAddModule(event) {
    event.preventDefault();
    addModule(addModuleText, addGradeText, addMC);
    console.log('hiii');
    console.log(cap);
    console.log(cmc);
    console.log(mc);
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
    console.log(newNew);
  }

  const updateUser = async (id) => {
    const userDoc = doc(db, "users", id);
    const newCAP = ((credits + (cap*cmc)) / (mc + cmc)).toFixed(2);
    const userNew = {
      currentCAP: newCAP,
      currentCAPMC: mc + cmc
    }
    await updateDoc(userDoc, userNew);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(firebase.auth().currentUser.uid){
    updateUser(firebase.auth().currentUser.uid);  
    } else {
      alert("Please Log In!");
    }


  }


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
              CAP Calculator
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}
>
            <h2>Add Data</h2>
            <form onSubmit={handleAddModule}>
              <Typography>
              Module Name
              </Typography>
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
            <Typography>
             Grade
            </Typography>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                type="text"
                value={addGradeText}
                onChange={(event) => {
                  temp = event.target.value; 
                  setAddGradeText(event.target.value);
                }}
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
            <Typography>
              Module Credits (MC)
            </Typography>
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
            <h2>Calculate Here!</h2>
            <table style={{ margin: "0 auto", width: "100%" }}>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Modules</th>
                  <th>Grade</th>
                  <th>MC</th>
                  <th>Score</th>
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
            <h4>New CAP is: {((credits + (cap*cmc)) / (mc + cmc)).toFixed(2)}</h4>
            <h4>Current CAP is: {cap}</h4>

            <Grid item xs={12} m={5}>
            <Button variant="contained" 
            startIcon={<SaveIcon />} 
            sx ={{m: 4}}
            onClick={handleSubmit}
            >
            Save Changes
            </Button>
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