import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';


export default function Buttons() {
  let goTo = useNavigate(); 
  const goToPlanner = () =>{ 
    let path = `/planner`; 
    goTo(path);
  };
  const goToCalculator = () =>{ 
    let path = `/calculator`; 
    goTo(path);
  };
  const goToChatroom = () =>{ 
    let path = `/Chatroom`; 
    goTo(path);
  };

  return (
    <Stack direction="row" spacing={2}>
      <Button variant="contained" onClick={goToPlanner} fullWidth>
      PLANNER
      </Button>
      <Button variant="contained" onClick={goToCalculator} fullWidth>
      CALCULATE CAP
      </Button>
      <Button variant="contained" onClick={goToChatroom} fullWidth>
      CHATROOM
      </Button>
    </Stack>
  );
}