import * as React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";

import "./ButtonPanel.css";

export default function ButtonPanel() {
  const navigate = useNavigate();
  const user = firebase.auth().currentUser;

  return (
    <Box className="right-buttons">
      {user === null ? (
        <>
          {/* Sign Up */}
          <Tooltip title="Create an account" arrow>
            <IconButton
              size="large"
              className="right-icon-btn"
              onClick={() => navigate("/signup")}
            >
              <PersonAddIcon />
            </IconButton>
          </Tooltip>

          {/* Sign In */}
          <Tooltip title="Sign in" arrow>
            <IconButton
              size="large"
              className="right-icon-btn"
              onClick={() => navigate("/signin")}
            >
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        /* Sign Out */
        <Tooltip title="Sign out" arrow>
          <IconButton
            size="large"
            className="right-icon-btn"
            onClick={() => navigate("/signout")}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}
