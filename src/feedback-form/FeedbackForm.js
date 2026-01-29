import Button from '@mui/material/Button';
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import './FeedbackForm.css';

export default function FeedbackForm() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const inputs = document.querySelectorAll('#fullname, #email, #remarks');
    inputs.forEach((input) => {
      input.value = '';
    });
    alert('Submitted!');
  };

  return (
    <div className="feedback-form">
      <Box className="feedback-header">
        <Typography variant="h3"><b>Feedback Form</b></Typography>

        <Typography variant="h6">
          We are here to listen to your suggestions, concerns and feedback in
          general! If there are other features that you think would improve the
          app or ways to improve existing features, let us know!
        </Typography>
      </Box>

      <Card className="feedback-card">
        <CardContent className="feedback-card-content">
          <div className="feedback-field">
            <Typography variant="h6">Full Name</Typography>
            <TextField id="fullname" label="Full Name" />
          </div>

          <div className="feedback-field">
            <Typography variant="h6">Email</Typography>
            <TextField id="email" label="Email" />
          </div>

          <div className="feedback-field">
            <Typography variant="h6">Remarks</Typography>
            <TextField
              id="remarks"
              label="Remarks"
              multiline
              rows={7}
            />
          </div>

          <Button
            className="feedback-button"
            variant="outlined"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
