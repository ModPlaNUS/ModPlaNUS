import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import { db } from '../authentication/firebase-config';
import {
  onSnapshot,
  updateDoc,
  doc,
  update,
} from "firebase/firestore";
import '@firebase/firestore'

export default function Profile() { 



  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [major, setMajor] = useState('');
  const [minor, setMinor] = useState('');
  const [otherProgrammes, setOtherProgrammes] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [info, setInfo] = useState([]);


  const [userInfo, setUserInfo] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(firebase.auth().currentUser.uid);  
  };

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
    setOtherProgrammes(userInfo.otherProgrammes);
    setMinor(userInfo.minor);
    setMajor(userInfo.major);
    setSemester(userInfo.semester);
    setYear(userInfo.year);
    setDisplayName(userInfo.displayName);
    setLastName(userInfo.lastName);
    setFirstName(userInfo.firstName);
  }, [userInfo])
  const user = firebase.auth().currentUser;

  const deleteUser = () => {
    user.delete()
    .then(()=>goToDashBoard())
    .then(() => alert("We are sad to see you go!"))
    .catch((error) => alert(error.message))
};
  

  const updateUser = async (id) => {
    const userDoc = doc(db, "users", id);
    const userNew = {
      firstName: firstName,
      lastName: lastName,
      displayName: displayName,
      year: year,
      semester: semester,
      major: major,
      minor: minor,
      otherProgrammes: otherProgrammes,
    }
    await updateDoc(userDoc, userNew);
    // const res = await userDoc.update({firstName: firstName});
  };

  const goTo = useNavigate();
  
  const goToDashBoard = () =>{
        goTo('/dashboard');
  };

  const auth = getAuth();

  const emailStr = userInfo.email;
  

  return (
    <React.Fragment>
      <Typography variant="h3" gutterBottom>
        My Profile 
      </Typography>

<p></p>

      <Typography variant="p" gutterBottom>
      Your Display Name is how you shall appear to others. Please enter your year of study for the current/upcoming academic year in the format 'YEAR X'
        (e.g. YEAR 1, YEAR 2, etc.). Similarly, enter your Semester of study as 'SEMESTER 1' or 'SEMESTER 2'.
      </Typography>
      <Typography>{userInfo.email}</Typography>

<p></p>

<Grid item xs={12} sm={6} m={5}>
          <Typography variant='h6'>
     Email
      </Typography>
      <p></p>
          <TextField
          disabled
            
            id="email"
            name="email"
            value={userInfo.email}
            fullWidth
            autoComplete="email"
            variant="outlined"
          />
        </Grid>
      <Grid item xs={12} sm={6} m={5}>
      <Typography variant='h6'>
      First Name
      </Typography>
      <p></p>
      
          <TextField
            required
            id="firstName"
            name="firstName"
            fullWidth
            value={firstName}
            autoComplete="given-name"
            variant="outlined"
            onChange={(e) => {setFirstName(e.target.value)}}
          />
        </Grid>

        <Grid item xs={12} sm={6} m={5}>
        <Typography variant='h6'>
      Last Name
      </Typography>
      <p></p>
          <TextField
            required
            id="lastName"
            name="lastName"
            value={lastName}
            fullWidth
            autoComplete="family-name"
            variant="outlined"
            onChange={(e) => setLastName(e.target.value)}
          />
          </Grid>

          <Grid item xs={12} sm={6} m={5}>
          <Typography variant='h6'>
     Display Name
      </Typography>
      <p></p>
          <TextField
            required
            id="displayName"
            name="displayName"
            value={displayName}
            fullWidth
            autoComplete="display-name"
            variant="outlined"
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} m={5}>
        <Typography variant='h6'>
      Year
      </Typography>
      <p></p>
          <TextField
            required
            id="year"
            name="year"
            value={year}
            fullWidth
            autoComplete="year"
            variant="outlined"
            onChange={(e) => setYear(e.target.value)}
          />
          </Grid>
        <Grid item xs={12} sm={6} m={5}>
        <Typography variant='h6'>
      Semester
      </Typography>
      <p></p>
          <TextField
            required
            id="semester"
            name="semester"
            value={semester}
            fullWidth
            variant="outlined"
            onChange={(e) => setSemester(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} m={5}>
        <Typography variant='h6'>
      Major
      </Typography>
      <p></p>
          <TextField
            required
            id="major"
            name="major"
            value={major}
            fullWidth
            autoComplete="major"
            variant="outlined"
            onChange={(e) => setMajor(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} m={5}>
        <Typography variant='h6'>
      Minor
      </Typography>
      <p></p>
          <TextField
            id="minor"
            name="minor"
            value={minor}
            fullWidth
            autoComplete="minor"
            variant="outlined"
            onChange={(e) => setMinor(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} m={5}>
        <Typography variant='h6'>
      Other Programmes
      </Typography>
      <p></p>
          <TextField
            id="other programmes"
            name="other programmes"
            value= {otherProgrammes}
            fullWidth
            autoComplete="other programmes"
            variant="outlined"
            onChange={(e) => setOtherProgrammes(e.target.value)}
          />
        </Grid>
        <p></p>
        <Grid item xs={12} m={5}>
        <Button variant="contained" 
        startIcon={<SaveIcon />} 
        sx ={{m: 4}}
        onClick={handleSubmit}
        >
        Save Changes
        </Button>
        <Button variant="outlined" 
        startIcon={<DeleteIcon />}
        sx ={{m: 4}}
        onClick={deleteUser}
        >
        Delete Account
        </Button>
        </Grid>
    </React.Fragment>
  );
}