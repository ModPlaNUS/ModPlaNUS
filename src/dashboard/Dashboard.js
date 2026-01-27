import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/StarBorder';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';


const tiers = [
  {
    title: 'Join Us',
    subheader: 'I want to make a free account!',
    buttonText: 'Sign Up',
    rule:'Please use your NUS email ID for authentication and verification purposes',
    buttonVariant: 'outlined',
    path: '/signup',
  },
  {
    title: 'Continue Your Journey',
    subheader: 'I already have an account',
    buttonText: 'Sign In',
    rule:'Remember to trust the process!',
    buttonVariant: 'contained',
    path: '/signin',
  },
  {
    title: 'Continue As Guest',
    subheader: 'I do not want to save my data',
    buttonText: 'Explore',
    rule:'Please note you will not be able to access certain features',
    buttonVariant: 'outlined',
    path: '/home',
  },
];


export default function Dashboard() {
  
  let goTo = useNavigate();

  return (
    <React.Fragment>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      {/* Hero unit */}
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
         ModPlaNUS
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
         Welcome to ModPlaNUS! This is the one-spot solution for all your module woes! Plan your modules, calculate your CAP,
         see all your past module information and much more! Sign Up to save your data. If you already have an account, Sign In!
         Alternatively, you may continue as a Guest!
        </Typography>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            <Grid
              item
              key={tier.title}
              xs={12}
              sm={tier.title === 'Enterprise' ? 12 : 6}
              md={4}
            >
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: 'center' }}
                  action={tier.title === '' ? <StarIcon /> : null}
                  subheaderTypographyProps={{
                    align: 'center',
                  }}
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[700],
                  }}
                />
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'baseline',
                      mb: 2,
                    }}
                  >
                    <Typography variant="p" color="text.secondary">
                      {tier.rule}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button fullWidth variant={tier.buttonVariant}
                  onClick = {() => goTo(tier.path)}>
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* Footer */}
      <Container
        maxWidth="md"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          py: [3, 6],
        }}
      >
        <Grid container spacing={4} justifyContent="space-evenly">
          <Grid>
            <Typography variant = "h5">
            Contact Us
            </Typography>
            <Typography>
            <Link href="https://github.com/ModPlaNUS/ModPlaNUS" variant="subtitle1" color="text.secondary">  
            GitHub
            </Link>
            </Typography>
            <Button variant='text' onClick={()=>goTo('/feedbackform')}>
              Feedback Form
            </Button>
          </Grid>
          <Grid>
          <Typography variant = "h5">
          Useful Websites
          </Typography>
          <Typography>
          <Link href="https://luminus.nus.edu.sg/?r=%2Fdashboard" variant="subtitle1" color="text.secondary">  
          LumiNUS
          </Link>
          </Typography>
          <Typography>
          <Link href="https://nusmods.com" variant="subtitle1" color="text.secondary">  
          NUSMODS
          </Link>
          </Typography>
          <Typography>
          <Link href="https://myedurec.nus.edu.sg/psp/cs90prd/?cmd=login&languageCd=ENG&" variant="subtitle1" color="text.secondary">  
          EduRec
          </Link>
          </Typography>
          </Grid>
        </Grid>
      </Container>
      {/* End footer */}
    </React.Fragment>
  );
}