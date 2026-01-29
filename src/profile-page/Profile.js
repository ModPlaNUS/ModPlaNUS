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
import { db } from '../authentication/firebase-config';
import { onSnapshot, updateDoc, doc } from 'firebase/firestore';
import './Profile.css';

export default function Profile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [major, setMajor] = useState('');
  const [minor, setMinor] = useState('');
  const [otherProgrammes, setOtherProgrammes] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [userInfo, setUserInfo] = useState({});

  const user = firebase.auth().currentUser;
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(firebase.auth().currentUser.uid);
  };

  function getInfo() {
    if (firebase.auth().currentUser) {
      return onSnapshot(
        doc(db, 'users', firebase.auth().currentUser.uid),
        (doc) => setUserInfo(doc.data())
      );
    }
  }

  React.useEffect(() => {
    getInfo();
  }, []);

  React.useEffect(() => {
    setFirstName(userInfo.firstName || '');
    setLastName(userInfo.lastName || '');
    setDisplayName(userInfo.displayName || '');
    setYear(userInfo.year || '');
    setSemester(userInfo.semester || '');
    setMajor(userInfo.major || '');
    setMinor(userInfo.minor || '');
    setOtherProgrammes(userInfo.otherProgrammes || '');
  }, [userInfo]);

  const deleteUser = () => {
    user
      .delete()
      .then(() => navigate('/dashboard'))
      .then(() => alert('We are sad to see you go!'))
      .catch((error) => alert(error.message));
  };

  const updateUser = async (id) => {
    const userDoc = doc(db, 'users', id);
    await updateDoc(userDoc, {
      firstName,
      lastName,
      displayName,
      year,
      semester,
      major,
      minor,
      otherProgrammes,
    });
  };

  return (
    <div className="profile-root">
      <Typography variant="h3">Profile</Typography>

      <Grid container className="profile-grid">
        {/* EMAIL (full width) */}
        <Grid item xs={12} className="profile-field">
          <Typography className="profile-label">Email</Typography>
          <TextField
            fullWidth
            disabled
            value={userInfo.email || ''}
            helperText="You can not edit this field"
          />
        </Grid>

        {/* NAME */}
        <Grid item xs={12} className="profile-field">
          <Typography className="profile-label">First Name</Typography>
          <TextField fullWidth value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </Grid>

        <Grid item xs={12} className="profile-field">
          <Typography className="profile-label">Last Name</Typography>
          <TextField fullWidth value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </Grid>

        {/* IDENTITY */}
        <Grid item xs={12} className="profile-field">
          <Typography className="profile-label">Display Name</Typography>
          <TextField
            fullWidth
            value={displayName}
            helperText="Visible to other users"
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} className="profile-field">
          <Typography className="profile-label">Year</Typography>
          <TextField fullWidth value={year} onChange={(e) => setYear(e.target.value)} />
        </Grid>

        {/* ACADEMICS */}
        <Grid item xs={12} className="profile-field">
          <Typography className="profile-label">Semester</Typography>
          <TextField fullWidth value={semester} onChange={(e) => setSemester(e.target.value)} />
        </Grid>

        <Grid item xs={12} className="profile-field">
          <Typography className="profile-label">Major</Typography>
          <TextField fullWidth value={major} onChange={(e) => setMajor(e.target.value)} />
        </Grid>

        <Grid item xs={12} className="profile-field">
          <Typography className="profile-label">Minor</Typography>
          <TextField fullWidth value={minor} onChange={(e) => setMinor(e.target.value)} />
        </Grid>

        <Grid item xs={12} className="profile-field">
          <Typography className="profile-label">Other Programmes</Typography>
          <TextField
            fullWidth
            value={otherProgrammes}
            helperText="USP, Double Major, etc."
            onChange={(e) => setOtherProgrammes(e.target.value)}
          />
        </Grid>

        {/* ACTIONS */}
        <Grid item xs={12} className="profile-actions">
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSubmit}>
            Save Changes
          </Button>
          <Button variant="outlined" startIcon={<DeleteIcon />} onClick={deleteUser}>
            Delete Account
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
