import * as React from 'react';
import { Box } from '@mui/material';
import { IconButton } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ExitToApp from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import firebase from 'firebase/compat/app';

export default function RightButtons(){
    const goTo = useNavigate();
    const user = firebase.auth().currentUser;
    
  const goToSignUp = () =>{ 
    let path = `/signup`; 
    if(user===null){
      goTo(path);
    }else{
      goTo('/signout');
    }
  };

  const goToSignOut = () =>{ 
    let path = `/signout`; 
    if(user!==null){
    goTo(path);
    }else{
    goTo('/dashboard');
  }
};

const goToSignIn = () =>{ 
  let path = `/signin`; 
  if(user===null){
  goTo(path);
  }else{
  goTo('/signout');
}
};

  return(
      <Box>
      <IconButton size='large' 
      onClick={goToSignUp}>
            <PersonAddIcon/>
          </IconButton>
          <IconButton size='large' 
          onClick={goToSignIn}>
            <ExitToApp/>
          </IconButton>
          <IconButton size='large' 
          onClick={goToSignOut}>
            <LogoutIcon/>
          </IconButton>
          </Box>
          );
        }