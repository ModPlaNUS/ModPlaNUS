import Button from '@mui/material/Button';
import { Card, CardContent, TextField, Typography } from '@mui/material';

export default function FeedbackForm(){

    const handleSubmit = (event)=>{
        event.preventDefault();
        const inputs = document.querySelectorAll('#fullname, #email, #remarks');
        inputs.forEach(input => {
            input.value = '';
          });
          alert("Submitted!");
    }
    return(
    <>
    <div>
            <Typography variant="h3">
            Feedback Form
            </Typography>
           <p></p>
            <Typography variant='h6'>
                We are here to listen to your suggestions, concerns and feedback in general!
                If there are other features that you think would improve the app or ways to improve existing
                features, let us know!
            </Typography>
            </div>
            <div>
        <Card sx={{ minWidth: 275 }}>
        <CardContent>
        <p></p>
        <div>
        <Typography variant='h6' gutterBottom>
          Full Name
        </Typography>
        <TextField id="fullname" label="Full Name" variant="outlined" fullWidth />
        </div>

        <p></p>
        
        <div>
        <Typography variant='h6' gutterBottom>
          Email
        </Typography>
        <TextField id="email" label="Email" variant="outlined" fullWidth />
        </div>

        <p></p>
        
        <div>
        <Typography variant='h6' gutterBottom>
          Remarks
        </Typography>
        <TextField
          id="remarks"
          label="Remarks"
          multiline
          rows={7}
          defaultValue=""
          variant="outlined"
          fullWidth
        />
        </div>
        <p></p>
        <div>
            <Button variant='outlined' onClick={handleSubmit}>
                Submit
            </Button>
        </div>
        </CardContent>
    </Card>
    </div>

    </>
    );
}