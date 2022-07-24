import * as React from 'react';
import { Button, Card, Typography } from "@mui/material";
import TextField from '@mui/material/TextField';
import { getAuth, updatePassword } from "firebase/auth";
import firebase from 'firebase/compat/app';
import {signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import { auth } from './firebase-config';
export default function ForgotPassword(){
   
    //const auth = getAuth();
    const [email, setEmail] = React.useState('');
    
    const forgotPassword = (Email) => {

      if(Email){
      console.log("reset email sent to " + Email);
      sendPasswordResetEmail(auth, Email, null)
          .then(() => {
              alert("reset email sent to " + Email);
          })
          .catch(function (e) {
              console.log(e);
              alert(e.message);
          });
        }
  };

const handleSubmit = (email) => {
    forgotPassword(email) 
  };


return (
    <div>
        <Card>
        <Typography variant="h3">
            Email
            </Typography>
           <p></p>
           <TextField           
            id="email"
            name="email"
            placeholder="Enter Your Email"
            fullWidth
            autoComplete="email"
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
          />
          <p></p>
          <Button onClick = {handleSubmit(email)}>
          SUBMIT
          </Button>

        </Card>


    </div>
);
}