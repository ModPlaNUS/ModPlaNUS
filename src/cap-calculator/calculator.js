import React, { useState } from "react";
import { Grid, Typography, CssBaseline, Paper, Button, Input, FormControl, Select, MenuItem } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import { db } from '../authentication/firebase-config';
import { onSnapshot, updateDoc, doc } from "firebase/firestore";
import './Calculator.css';

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
  const [userInfo, setUserInfo] = useState({});

  function getInfo() {
    if (firebase.auth().currentUser) {
      return onSnapshot(
        doc(db, "users", firebase.auth().currentUser.uid),
        (doc) => setUserInfo(doc.data())
      );
    }
  }

  React.useEffect(() => { getInfo(); }, []);

  React.useEffect(() => {
    setCMC(userInfo.currentCAPMC || 0);
    setCap(userInfo.currentCAP || 0);
  }, [userInfo]);

  function ComputeC(grade) {
    const map = {
      "A+": 5, "A": 5, "A-": 4.5,
      "B+": 4, "B": 3.5, "B-": 3,
      "C+": 2.5, "C": 2,
      "D+": 1.5, "D": 1,
      "F": 0, "S": 0, "U": 0
    };
    return map[grade] ?? 0;
  }

  function handleAddModule(e) {
    e.preventDefault();
    const newModule = [...Module, {
      description: addModuleText,
      desc: addGradeText,
      des: addMC
    }];
    if (addGradeText !== "S" && addGradeText !== "U") {
      setMC(mc + addMC);
      setCredits(credits + addMC * ComputeC(addGradeText));
    }
    setModule(newModule);
  }

  const updateUser = async (id) => {
    const userDoc = doc(db, "users", id);
    const newCAP = ((credits + (cap * cmc)) / (mc + cmc)).toFixed(2);
    await updateDoc(userDoc, {
      currentCAP: newCAP,
      currentCAPMC: mc + cmc
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="calculator-bg">
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8} component={Paper} className="calculator-card">
        <Typography variant="h3" className="calculator-title"><b>Calculator</b></Typography>

            <form onSubmit={handleAddModule} className="calculator-form">
              <Typography>Module Name</Typography>
              <Input fullWidth value={addModuleText} onChange={e => setAddModuleText(e.target.value)} />

              <Typography>Grade</Typography>
              <FormControl fullWidth>
                <Select value={addGradeText} onChange={e => setAddGradeText(e.target.value)}>
                  {["A+","A","A-","B+","B","B-","C+","C","D+","D","F","S","U"].map(g =>
                    <MenuItem key={g} value={g}>{g}</MenuItem>
                  )}
                </Select>
              </FormControl>

              <Typography>Module Credits (MC)</Typography>
              <Input
                fullWidth
                value={addMC}
                onChange={e => setAddMC(Number(e.target.value))}
              />

              <Button variant="contained" type="submit">
                Add Module
              </Button>
            </form>

            <table className="calculator-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Module</th>
                  <th>Grade</th>
                  <th>MC</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {Module.map((m, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{m.description}</td>
                    <td>{m.desc}</td>
                    <td>{m.des}</td>
                    <td>{m.des * ComputeC(m.desc)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          <Typography className="calculator-cap">
            NEW CAP:&nbsp;
            {mc + cmc > 0
              ? ((credits + cap * cmc) / (mc + cmc)).toFixed(2)
              : "—"}
          </Typography>

            <Button
              variant="contained"
              onClick={() => updateUser(firebase.auth().currentUser.uid)}
            >
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}
