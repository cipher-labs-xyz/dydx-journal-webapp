import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: ["Circular", "Roboto", "Helvetica", "Arial"].join(","),
  },
  components: {
    MuiCircularProgress: {
      styleOverrides: {
        circleDeterminate: {
          backgroundColor: "var(--color-text-dark)",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          background: "unset",
          "&:before": {
            display: "none",
          },
          "&:hover > ": {
            filter: "brightness(105)",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: 0,
          fontSize: "1.25em",
          margin: "10px 0",
          "&:hover": {
            filter: "brightness(105)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          paddingTop: "8px",
          paddingBottom: "8px",
          borderRadius: "5px",
          color: "inherit",
          boxShadow: "unset",
          boxSizing: "border-box",
          height: "40px",
          lineHeight: 0,
          "&:hover": {
            hover: "brightness(1.1)",
          },
        },
      },
      defaultProps: {
        disableRipple: true,
        disableElevation: true,
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { backgroundColor: "unset!important" },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          boxSizing: "border-box",
          borderRadius: "50%",
          width: "20px",
          height: "20px",
          backgroundColor: "var(--color-text-light)",
          color: "var(--color-text-dark)",
          border: "5px solid var(--color-text-dark)",
          outline: "none",
          padding: "0",
          margin: "10px",
          "&.Mui-checked": {
            border: "5px solid var(--color-purple)",
            color: "transparent",
          },
          "&:hover": {
            backgroundColor: "var(--color-text-light)",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        filled: {
          paddingTop: "8px",
          paddingBottom: "8px",
          backgroundColor: "var(--color-layer-lighter)",
          borderRadius: "5px",
          boxSizing: "border-box",
          height: "40px",
          paddingLeft: "16px",
          paddingRight: "36px!important",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: { fill: "inherit" },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid var(--color-layer-lighter)",
          padding: "8px",
          textAlign: "center",
        },
        head: {
          color: "var(--color-text-dark)",
          backgroundColor: "var(--color-layer-darker)",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          boxShadow: "unset",
          "&:hover": { backgroundColor: "var(--color-layer-light)", borderLeft: "2px solid var(--color-purple)" },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "var(--color-layer-lighter)",
        },
        arrow: {
          color: "var(--color-layer-lighter)",
        },
      },
    },
  },
  palette: {
    primary: { main: "#303044" },
    secondary: { main: "#6F6E84" },
    error: { main: "#FF5353" },
    success: { main: "#3fb68b" },
    info: { main: "#5973fe", contrastText: "#f7f7f7" },
    background: {
      default: "var(--color-layer-base)",
      paper: "var(--color-layer-base)",
    },
    text: {
      primary: "#c3c2d4",
      secondary: "var(--color-text-lighter)",
    },
    tonalOffset: 0.2,
  },
});

export default theme;
