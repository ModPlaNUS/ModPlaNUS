import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CalculateIcon from "@mui/icons-material/Calculate";
import HomeIcon from "@mui/icons-material/Home";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { List } from "@mui/material";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";

import "./NavListItems.css";

export default function NavListItems() {
  const user = firebase.auth().currentUser;
  const navigate = useNavigate();

  const guard = (path) => {
    user ? navigate(path) : navigate("/signin");
  };

  return (
    <List className="nav-list">
      <ListItemButton className="nav-item" onClick={() => guard("/home")}>
        <ListItemIcon className="nav-icon">
          <HomeIcon />
        </ListItemIcon>
        <ListItemText className="nav-text" primary="Dashboard" />
      </ListItemButton>

      <ListItemButton className="nav-item" onClick={() => guard("/planner")}>
        <ListItemIcon className="nav-icon">
          <DesignServicesIcon />
        </ListItemIcon>
        <ListItemText className="nav-text" primary="Module Planner" />
      </ListItemButton>

      <ListItemButton className="nav-item" onClick={() => guard("/calculator")}>
        <ListItemIcon className="nav-icon">
          <CalculateIcon />
        </ListItemIcon>
        <ListItemText className="nav-text" primary="CAP Calculator" />
      </ListItemButton>

      <ListItemButton className="nav-item" onClick={() => guard("/profile")}>
        <ListItemIcon className="nav-icon">
          <ManageAccountsIcon />
        </ListItemIcon>
        <ListItemText className="nav-text" primary="Account Settings" />
      </ListItemButton>
    </List>
  );
}
