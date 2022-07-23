import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CalculateIcon from '@mui/icons-material/Calculate';
import HomeIcon from '@mui/icons-material/Home';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import BookIcon from '@mui/icons-material/Book';
import MessageIcon from '@mui/icons-material/Message';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import { List } from '@mui/material';

export default function ListItems(){
  
  const user = firebase.auth().currentUser;

  const goTo = useNavigate();
  
  const goToHome = () =>{
      if(user!==null){
        console.log(user);
        goTo('/home');
      }else{
        goTo('/signin');
      }
  };

  const goToProfile = () =>{ 
    let path = `/profile`; 
    if(user!==null){
    goTo(path);
  }else{
    goTo('/signin');
  }
  };

  const goToCalculator = () =>{ 
    let path = `/calculator`; 
    if(user!==null){
      goTo(path);
    }else{
      goTo('/signin');
    }
  };

  const goToPlanner = () =>{ 
    let path = `/planner`; 
    if(user!==null){
      goTo(path);
    }else{
      goTo('/signin');
    }
  };

  const goToChatroom = () =>{ 
    let path = `/Chatroom`; 
    if(user!==null){
      goTo(path);
    }else{
      goTo('/signin');
    }
  };
  
  return (
  <List>
    <ListItemButton onClick={goToHome} >
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard"/>
    </ListItemButton>
    <ListItemButton onClick={goToPlanner}>
      <ListItemIcon>
        <DesignServicesIcon />
      </ListItemIcon>
      <ListItemText primary="Module Planner"/>
    </ListItemButton>
    <ListItemButton onClick={goToCalculator}>
      <ListItemIcon>
        <CalculateIcon />
      </ListItemIcon>
      <ListItemText primary="CAP Calculator" />
    </ListItemButton>
    {/* <ListItemButton>
      <ListItemIcon>
        <BookIcon />
      </ListItemIcon>
      <ListItemText primary="Module Information" />
    </ListItemButton> */}
    {/* <ListItemButton onClick={goToChatroom}>
      <ListItemIcon>
        <MessageIcon />
      </ListItemIcon>
      <ListItemText primary="ChatRoom" />
    </ListItemButton> */}
    <ListItemButton onClick={goToProfile}>
      <ListItemIcon>
        <ManageAccountsIcon />
      </ListItemIcon>
      <ListItemText primary="Account Settings" />
    </ListItemButton>
    </List>
  );
  
}