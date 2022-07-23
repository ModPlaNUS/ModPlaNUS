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
  React.useEffect(()=>{
    setModsY1S1(userInfo.Y1S1Planned);
    setModsY1S2(userInfo.Y1S2Planned);
    setModsY2S1(userInfo.Y2S1Planned);
    setModsY2S2(userInfo.Y2S2Planned);
    setModsY3S1(userInfo.Y3S1Planned);
    setModsY3S2(userInfo.Y3S2Planned);
    setModsY4S1(userInfo.Y4S1Planned);
    setModsY4S1(userInfo.Y4S2Planned);
  }, [userInfo]);


    const currUser = () => {
      if(auth.currentUser){
            let user = auth.currentUser;
            // console.log(mods);
               return (
                   <p> Hello {user.email} </p>
               );

      } else {
        return (
          <p> There seems to be an error in fetching your data (PLEASE LOG IN AGAIN...) </p>
      );
      }

    }

  return (
    <>
    <Card sx={{ maxWidth: 3450,  margin: 2 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
         You are logged in as: {currUser()}
        </Typography>
      </CardContent>
    </Card>
      <p></p>
      <Card sx={{ p: 2 }}>
      <Buttons/>
      </Card>
      <p></p>

        <Card sx={{ p: 2 }}>
          <Typography variant='h6'>
          YEAR 1 SEM 1
          </Typography>
          {modsY1S1 ? (
                <ModuleList modules={modsY1S1} setModules={setModsY1S1} />
            ) : (
                <p>No Plan</p>
            )}
        </Card>
        <p></p>
        <Card sx={{ p: 2 }}>
          <Typography variant='h6'>
          YEAR 1 SEM 2
          </Typography>
          {modsY1S2 ? (
                <ModuleList modules={modsY1S2} setModules={setModsY1S2} />
            ) : (
                <p>No Plan</p>
            )}
        </Card>
        <p></p>
        <Card sx={{ p: 2 }}>
          <Typography variant='h6'>
          YEAR 2 SEM 1
          </Typography>
          {modsY2S1 ? (
                <ModuleList modules={modsY2S1} setModules={setModsY2S1} />
            ) : (
                <p>No Plan</p>
            )}
        </Card>
        <p></p>
        <Card sx={{ p: 2 }}>
          <Typography variant='h6'>
          YEAR 2 SEM 2
          </Typography>
          {modsY2S1 ? (
                <ModuleList modules={modsY2S2} setModules={setModsY2S2} />
            ) : (
                <p>No Plan</p>
            )}
        </Card>
        <p></p>
        <Card sx={{ p: 2 }}>
          <Typography variant='h6'>
          YEAR 3 SEM 1
          </Typography>
          {modsY2S1 ? (
                <ModuleList modules={modsY3S1} setModules={setModsY3S1} />
            ) : (
                <p>No Plan</p>
            )}
        </Card>
        <p></p>
        <Card sx={{ p: 2 }}>
          <Typography variant='h6'>
          YEAR 3 SEM 2
          </Typography>
          {modsY2S1 ? (
                <ModuleList modules={modsY3S2} setModules={setModsY3S2} />
            ) : (
                <p>No Plan</p>
            )}
        </Card>
        <p></p>
        <Card sx={{ p: 2 }}>
          <Typography variant='h6'>
          YEAR 4 SEM 1
          </Typography>
          {modsY2S1 ? (
                <ModuleList modules={modsY4S1} setModules={setModsY4S1} />
            ) : (
                <p>No Plan</p>
            )}
        </Card>
        <p></p>
        <Card sx={{ p: 2 }}>
          <Typography variant='h6'>
          YEAR 4 SEM 2
          </Typography>
          {modsY2S1 ? (
                <ModuleList modules={modsY4S2} setModules={setModsY4S2} />
            ) : (
                <p>No Plan</p>
            )}
        </Card>
    <>
    </>
    </>
  );
}