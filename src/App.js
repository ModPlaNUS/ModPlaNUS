import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

import NavListItems from './dashboard/NavListItems';
import ButtonPanel from './dashboard/ButtonPanel';

import Home from './homepage/Home';
import Planner from './module-planner/PlannerMain';
import Calculator from './cap-calculator/Calculator';
import Dashboard from './dashboard/Dashboard';
import Profile from './profile-page/Profile';
import FeedbackForm from './feedback-form/FeedbackForm';
import NotFoundPage from './error-pages/NotFoundPage';

import SignIn from './authentication/SignIn';
import SignUp from './authentication/SignUp';
import SignOut from './authentication/SignOut';
import ForgotPassword from './authentication/ForgotPassword';

import './App.css';

/* ================= Theme Colors ================= */

const colors = {
  bgMain: '#fbf6ed',      // parchment
  bgDrawer: '#f3ecd9',    // warm beige
  primary: '#8b6b3f',     // coffee brown
  accent: '#e3b23c',      // golden yellow
  textMain: '#3b2f1c',    // espresso
  textMuted: '#6f5a3a',
  borderSoft: 'rgba(139,107,63,0.18)',
};

const drawerWidth = 240;

/* ================= Drawer Helpers ================= */

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
  ...theme.mixins.toolbar,
}));

/* ================= AppBar ================= */

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: colors.bgMain,
  color: colors.textMain,
  borderBottom: `1px solid ${colors.borderSoft}`,
  boxShadow: '0 6px 24px rgba(139,107,63,0.18)',
  backdropFilter: 'blur(10px)',
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

/* ================= Drawer ================= */

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',

  '& .MuiDrawer-paper': {
    backgroundColor: colors.bgDrawer,
    borderRight: `1px solid ${colors.borderSoft}`,
    boxShadow: '4px 0 20px rgba(139,107,63,0.12)',
    color: colors.textMain,
  },

  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

/* ================= App ================= */

export default function App() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  return (
    <Router>
      <Box
        className="App"
        sx={{
          display: 'flex',
          backgroundColor: colors.bgMain,
        }}
      >
        <CssBaseline />

        {/* ---------- Top AppBar ---------- */}
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <IconButton
                onClick={() => setOpen(true)}
                sx={{
                  marginRight: 3,
                  color: colors.primary,
                  '&:hover': {
                    backgroundColor: 'rgba(227,178,60,0.18)',
                  },
                  ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>

              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: colors.primary,
                }}
              >
                ModPlaNUS
              </Typography>
            </Box>

            <ButtonPanel />
          </Toolbar>
        </AppBar>

        {/* ---------- Side Drawer ---------- */}
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton
              onClick={() => setOpen(false)}
              sx={{
                color: colors.primary,
                '&:hover': {
                  backgroundColor: 'rgba(227,178,60,0.18)',
                },
              }}
            >
              {theme.direction === 'rtl'
                ? <ChevronRightIcon />
                : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>

          <Divider />
          <NavListItems />
        </Drawer>

        {/* ---------- Main Content ---------- */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: '100vh',
            backgroundColor: colors.bgMain,
          }}
        >
          <DrawerHeader />

          <div className="page">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/home" element={<Home />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/feedbackform" element={<FeedbackForm />} />

              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signout" element={<SignOut />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </Box>
      </Box>
    </Router>
  );
}
