import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#2A2A2A",
      light: "#404040",
      dark: "#1A1A1A",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#757575",
      light: "#9E9E9E",
      dark: "#616161",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FAFAFA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2A2A2A",
      secondary: "#757575",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          borderRadius: "12px",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "16px",
          borderBottom: "1px solid #F0F0F0",
        },
        head: {
          backgroundColor: "#FAFAFA",
          fontWeight: 600,
        },
      },
    },
  },
});
