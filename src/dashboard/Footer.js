import * as React from "react";
import { Box, Container, Grid, Typography, Tooltip, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

/* Icons */
import GitHubIcon from "@mui/icons-material/GitHub";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";

import "./Footer.css";

export default function Footer() {
  const goTo = useNavigate();

  return (
    <Box component="footer" className="dashboard-footer">
      <Container maxWidth="md">
        <Grid
          container
          spacing={6}
          justifyContent="space-between"
          className="dashboard-footer-grid"
        >
          {/* ================= Contact ================= */}
          <Grid item xs={12} sm={6} className="dashboard-footer-col">
            <Typography className="dashboard-footer-title">
              Contact Us
            </Typography>

            <Box className="dashboard-footer-icons">
              <Tooltip title="GitHub" arrow>
                <IconButton
                  component="a"
                  href="https://github.com/ModPlaNUS/ModPlaNUS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dashboard-footer-icon-btn"
                >
                  <GitHubIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Feedback Form" arrow>
                <IconButton
                  onClick={() => goTo("/feedbackform")}
                  className="dashboard-footer-icon-btn"
                >
                  <FeedbackOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>

          {/* ================= Useful Links ================= */}
          <Grid item xs={12} sm={6} className="dashboard-footer-col">
            <Typography className="dashboard-footer-title">
              Useful Websites
            </Typography>

            <Box className="dashboard-footer-icons">
              <Tooltip title="NUSMODS" arrow>
                <IconButton
                  component="a"
                  href="https://nusmods.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dashboard-footer-icon-btn"
                >
                  <SchoolOutlinedIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="NUS Homepage" arrow>
                <IconButton
                  component="a"
                  href="https://nus.edu.sg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dashboard-footer-icon-btn"
                >
                  <AccountBalanceOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
