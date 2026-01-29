import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./PlannerMain.css";

export default function GradeSelect() {
  const [grade, setGrade] = React.useState("");

  const handleChange = (event) => {
    setGrade(event.target.value);
  };

  return (
    <Box className="planner-select-wrapper">
      <FormControl fullWidth className="planner-select">
        <InputLabel id="grade-label">Planned Grade</InputLabel>
        <Select
          labelId="grade-label"
          value={grade}
          label="Planned Grade"
          onChange={handleChange}
        >
          <MenuItem value="A+">A+</MenuItem>
          <MenuItem value="A">A</MenuItem>
          <MenuItem value="A-">A-</MenuItem>
          <MenuItem value="B+">B+</MenuItem>
          <MenuItem value="B">B</MenuItem>
          <MenuItem value="B-">B-</MenuItem>
          <MenuItem value="C+">C+</MenuItem>
          <MenuItem value="C">C</MenuItem>
          <MenuItem value="D+">D+</MenuItem>
          <MenuItem value="D">D</MenuItem>
          <MenuItem value="F">F</MenuItem>
          <MenuItem value="S">S</MenuItem>
          <MenuItem value="U">U</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
