import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

export default function BasicSelect() {
  const [grade, setGrade] = React.useState('');

  const handleChange = (event) => {
    setGrade(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Grade</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={grade}
          label="Grade"
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} label={"Planned Grade"} />}
        >
          <MenuItem value={1}>A+</MenuItem>
          <MenuItem value={2}>A</MenuItem>
          <MenuItem value={3}>A-</MenuItem>
          <MenuItem value={4}>B+</MenuItem>
          <MenuItem value={5}>B</MenuItem>
          <MenuItem value={4}>B-</MenuItem>
          <MenuItem value={7}>C+</MenuItem>
          <MenuItem value={8}>C</MenuItem>
          <MenuItem value={9}>C+</MenuItem>
          <MenuItem value={10}>D+</MenuItem>
          <MenuItem value={11}>D</MenuItem>
          <MenuItem value={12}>F</MenuItem>
          <MenuItem value={13}>S</MenuItem>
          <MenuItem value={14}>U</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
