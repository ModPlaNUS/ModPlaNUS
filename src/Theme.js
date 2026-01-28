import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#8a6b3f", // warm brown-gold (replaces blue)
    },
    secondary: {
      main: "#c8b089", // soft sand
    },
    background: {
      default: "#faf6ee", // parchment background
      paper: "#f5ecd9",
    },
    text: {
      primary: "#3f2f1c",
      secondary: "#6b5535",
    },
    action: {
      hover: "rgba(138, 107, 63, 0.08)",
      selected: "rgba(138, 107, 63, 0.12)",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: "#f5e6c8",
          color: "#3f2f1c",
          "&:hover": {
            backgroundColor: "#edd9b3",
          },
        },
        outlinedPrimary: {
          borderColor: "#c8b089",
          color: "#3f2f1c",
          "&:hover": {
            backgroundColor: "#f9f1dc",
          },
        },
      },
    },
  },
});

export default theme;
