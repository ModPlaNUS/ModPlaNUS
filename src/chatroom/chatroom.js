import * as React from "react";
import { Box, Typography } from "@mui/material";

import "./Chatroom.css";

export default function Chatroom() {
  return (
    <Box className="chatroom">
      <Box className="chatroom-overlay">
        <Typography variant="h4" className="chatroom-title">
          Chatroom
        </Typography>

        <Typography className="chatroom-subtitle">
          This space is being built ✨
        </Typography>

        <Typography className="chatroom-note">
          Soon you’ll be able to discuss modules, CAP planning, and semester
          strategies with others.
        </Typography>
      </Box>
    </Box>
  );
}
