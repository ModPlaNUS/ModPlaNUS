import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { auth } from '../authentication/firebase-config';
import Buttons from './Buttons';
import { useState } from 'react';
import firebase from 'firebase/compat/app';
import { db } from '../authentication/firebase-config';
import {
  onSnapshot,
  updateDoc,
  doc,
  update,
} from "firebase/firestore";
import '@firebase/firestore'
import { Box } from '@mui/system';

export function ModuleList(props) {
  
  const { modules, setModules } = props;

  function handleModuleCompletionToggled(toToggleModule, toToggleModuleIndex) {
    // console.log(toToggleModule);
    let newModules = [
      ...modules.slice(0, toToggleModuleIndex),
      {
        code: toToggleModule.code,
        grade: toToggleModule.grade,
        mc: toToggleModule.mc,
        workLoad: toToggleModule.workLoad,
        isComplete: !toToggleModule.isComplete,
      },
      ...modules.slice(toToggleModuleIndex + 1)
    ];

    // newModules = newModules.filter((w, i)=> !w.isComplete);
    setModules(newModules);

  }

  return (
    <table style={{ margin: "0 auto", width: "100%" }}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Module</th>
              <th>Grade</th>
              <th>MC</th>
              <th>Workload (hrs/week)</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((mods, index) => (
              <tr key={mods.code}>
                <td>{index + 1}</td>
                <td>{mods.code}</td>
                <td>{mods.grade}</td>
                <td>{mods.mc}</td>
                <td>{mods.workLoad}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={mods.isComplete}
                    onChange={() => handleModuleCompletionToggled(mods, index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  );
}

export default function Home() {

  const [userInfo, setUserInfo] = useState([]);

  const [modsY1S1, setModsY1S1] = useState([]);
  const [modsY1S2, setModsY1S2] = useState([]);

  const [modsY2S1, setModsY2S1] = useState([]);
  const [modsY2S2, setModsY2S2] = useState([]);

  const [modsY3S1, setModsY3S1] = useState([]);
  const [modsY3S2, setModsY3S2] = useState([]);

  const [modsY4S1, setModsY4S1] = useState([]);
  const [modsY4S2, setModsY4S2] = useState([]);

  function getInfo(){
    if(firebase.auth().currentUser){

      const user = onSnapshot(doc(db, "users", firebase.auth().currentUser.uid), 
       (doc) => {
        //console.log(doc.data());
         setUserInfo(doc.data());
        });
        return user;
      } else {
      //  console.log("no info");
      }
  }

  React.useEffect(()=>{getInfo()}, []);
  React.useEffect(()=>{setModsY1S1(userInfo.newMods)}, [userInfo]);


    const currUser = () => {
            let user = auth.currentUser;
            // console.log(mods);
               return (
                   <p> Hello {user.email} </p>
               );

    }

  return (
    <>
    <Card sx={{ maxWidth: 3450,  margin: 25 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
         You are logged in as: {currUser()}
        </Typography>
      </CardContent>
    </Card>
      <p></p>
      <Card>
        <Box>
          <Typography variant='h6'>
            <ModuleList modules={modsY1S1} setModules = {setModsY1S1} />
          </Typography>
        </Box>
      </Card>
    <>
    <Buttons/>
    </>
    </>
  );
}