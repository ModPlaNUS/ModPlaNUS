import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CssBaseline,
  Grid,
  Typography,
  GlobalStyles,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "./Dashboard.css";

const tiers = [
  {
    title: "Join Us",
    subheader: "I want to make a free account!",
    buttonText: "Sign Up",
    rule: "Please use your NUS email ID for authentication and verification purposes",
    buttonVariant: "outlined",
    path: "/signup",
  },
  {
    title: "Continue Your Journey",
    subheader: "I already have an account",
    buttonText: "Sign In",
    rule: "Remember to trust the process!",
    buttonVariant: "contained",
    path: "/signin",
  },
  {
    title: "Continue As Guest",
    subheader: "I do not want to save my data",
    buttonText: "Explore",
    rule: "Please note you will not be able to access certain features",
    buttonVariant: "outlined",
    path: "/home",
  },
];

export default function Dashboard() {
  const goTo = useNavigate();

  return (
    <>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }} />
      <CssBaseline />

      {/* ================= Hero ================= */}
      <Box className="dashboard-hero">
        <Container maxWidth="sm">
          <Box className="dashboard-logo-wrapper">
            <img
              src="/modplanus-logo.png"
              alt="ModPlaNUS"
              className="dashboard-logo"
            />
          </Box>

          <Typography
            variant="h2"
            align="center"
            className="dashboard-title"
          >
            ModPlaNUS
          </Typography>

          <Typography
            variant="h6"
            align="center"
            component="p"
            className="dashboard-subtitle"
          >
            Your one-stop solution for module planning, CAP calculation,
            and academic clarity. Sign up to save your journey — or explore freely as a guest.
          </Typography>
        </Container>
      </Box>

      {/* ================= Cards Section ================= */}
      <Box className="dashboard-cards">
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {tiers.map((tier) => (
              <Grid item key={tier.title} xs={12} md={4}>
                <Card className="dashboard-card">
                  <CardHeader
                    title={tier.title}
                    subheader={tier.subheader}
                    titleTypographyProps={{
                      align: "center",
                      className: "dashboard-card-title",
                    }}
                    subheaderTypographyProps={{
                      align: "center",
                      className: "dashboard-card-subheader",
                    }}
                    className="dashboard-card-header"
                  />

                  <CardContent>
                    <Typography className="dashboard-rule">
                      {tier.rule}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    <Button
                      fullWidth
                      variant={tier.buttonVariant}
                      onClick={() => goTo(tier.path)}
                      className={`dashboard-button ${
                        tier.buttonVariant === "contained"
                          ? "dashboard-button-contained"
                          : "dashboard-button-outlined"
                      }`}
                    >
                      {tier.buttonText}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ================= Footer ================= */}
      <div className="dashboard-footer-separator" />
      <Footer />
      
    </>
  );
}
