import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// eslint-disable-next-line no-unused-vars
import ListItems from './dashboard/listItems';
import firebase from 'firebase/compat/app';
import './App.css';
import SignUp from './authentication/SignUp';
import SignIn from './authentication/SignIn';
import SignOut from './authentication/SignOut';
import {BrowserRouter as Router, Routes, Route, useLocation, BrowserRouter} from 'react-router-dom';
import Home from './homepage/Home';
import Planner from './module-planner/planner-main';
import Calculator from './cap-calculator/calculator';
import Dashboard from './dashboard/Dashboard';
import NotFoundPage from './error-pages/NotFoundPage';
import Profile from './profile-page/Profile';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import RightButtons from './dashboard/RightButtons';
import FeedbackForm from './feedback-form/FeedbackForm';
import ForgotPassword from './authentication/ForgotPassword';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);


export default function App() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const user = firebase.auth().currentUser;
  const name = user?.email;

  //const email = firebase.auth().currentUser.email;

  return (
    <Router>
    <div className='App'>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
        <Box display='flex' flexGrow={1}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            WELCOME TO MODPLANUS...
          </Typography>
          </Box>
          <RightButtons/>
           </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <ListItems/>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Routes>
        <Route path='/home' element={<Home/>}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/signout' element={<SignOut/>}/>
        <Route path='/planner' element={<Planner/>}/>
        <Route path='/calculator' element={<Calculator/>}/>
        <Route path='/dashboard' element = {<Dashboard/>}/>
        <Route path='/feedbackform' element = {<FeedbackForm/>}/>
        <Route path='/profile' element = {<Profile/>}/>
        <Route path='/forgotpassword' element = {<ForgotPassword/>}/>
        <Route path='/' element = {<Dashboard/>}/>
        <Route path='/account' element = {<Profile/>}/>
        <Route path="*" element={<NotFoundPage/>} />
      </Routes>
      </Box> 
    </Box>
    </div>
    </Router>
  );
}