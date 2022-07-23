import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { auth } from '../authentication/firebase-config';
import Buttons from './Buttons';


function WarningList(props) {
  const { warnings, setWarnings } = props;

  function handleWarningCompletionToggled(toToggleWarning, toToggleWarningIndex) {
    const newWarnings = [
      ...warnings.slice(0, toToggleWarningIndex),
      {
        msg: toToggleWarning.msg,
        isComplete: !toToggleWarning.isComplete
      },
      ...warnings.slice(toToggleWarningIndex + 1)
    ];
    setWarnings(newWarnings);

  }

  return (
    <table style={{ margin: "0 auto", width: "100%" }}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Warning</th>
              <th>Handled</th>
            </tr>
          </thead>
          <tbody>
            {warnings.map((warns, index) => (
              <tr key={warns.msg}>
                <td>{index + 1}</td>
                <td>{warns.msg}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={warns.isComplete}
                    onChange={() => handleWarningCompletionToggled(warns, index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  );
}

export default function Home() {


    const currUser = () => {
            let user = auth.currentUser;
               return (
                   <p> I'm the current user: {user.email} </p>
               );
    }

  return (
    <>
    <Card sx={{ maxWidth: 3450,  margin: 25 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {currUser}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          We hope to display all user details on this home page. This includes module credits earned so far, semester wise details and much more!
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" fullWidth>Relive The Journey!</Button>
      </CardActions>
    </Card>
    <>
    <Buttons/>
    </>
    </>
  );
}