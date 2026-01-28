import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";

import "./Buttons.css";

export default function Buttons() {
  const navigate = useNavigate();

  const routes = [
    { label: "PLANNER", path: "/planner" },
    { label: "CALCULATE CAP", path: "/calculator" },
  ];

  return (
    <Stack
      direction="row"
      spacing={2}
      className="nav-buttons"
    >
      {routes.map(({ label, path }) => (
        <Button
          key={label}
          fullWidth
          variant="contained"
          className="nav-button"
          onClick={() => navigate(path)}
        >
          {label}
        </Button>
      ))}
    </Stack>
  );
}
