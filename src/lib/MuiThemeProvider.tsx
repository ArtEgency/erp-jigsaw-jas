"use client";
import React from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: { main: "#565DFF", dark: "#4048CC", light: "#EEEEFF" },
    secondary: { main: "#FF6B00", dark: "#CC5500", light: "#FFF0E6" },
    error: { main: "#E53935" },
    success: { main: "#3B6D11" },
    text: { primary: "#333333", secondary: "#777777" },
    divider: "#E0E0E0",
    background: { default: "#F7F7F9", paper: "#FFFFFF" },
  },
  typography: {
    fontFamily: "var(--font-sarabun), 'Sarabun', sans-serif",
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small", variant: "outlined" },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 12 },
      },
    },
  },
});

export default function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
