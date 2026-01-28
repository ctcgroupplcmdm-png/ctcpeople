import React, { useEffect, useRef, useState, useCallback } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import DiscountCard from "./DiscountCard"; // Your DiscountCard page
import { Box, Typography, Paper, Button, CircularProgress } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ctcLogo from "./assets/logos/ctc.png";

function App() {
  const { instance, accounts } = useMsal();
  const [loading, setLoading] = useState(true); // spinner while checking login
  const idleTimer = useRef(null);
  const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

  const login = () => instance.loginRedirect(loginRequest);

  const logout = useCallback(() => {
    instance.logoutRedirect();
  }, [instance]);

  // Idle logout
  useEffect(() => {
    const resetTimer = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        if (accounts.length > 0) {
          console.log("Idle timeout — logging out");
          logout();
        }
      }, IDLE_TIMEOUT);
    };

    const events = ["mousemove", "mousedown", "keypress", "touchstart", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [accounts, logout]);

  // Tiny delay to check accounts
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
          backgroundColor: "#f8fafc",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#f8fafc",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {accounts.length > 0 ? (
          <Routes>
            {/* Only DiscountCard route */}
            <Route path="/" element={<DiscountCard />} />
            <Route path="/discount-card" element={<DiscountCard />} />
          </Routes>
        ) : (
          // Full-screen login
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              textAlign: "center",
              background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            }}
          >
            <Paper
              elevation={4}
              sx={{
                p: 5,
                borderRadius: 3,
                textAlign: "center",
                width: "90%",
                maxWidth: 400,
                backgroundColor: "#ffffffdd",
              }}
            >
              <img
                src={ctcLogo}
                alt="CTC Group"
                style={{ width: 120, height: "auto", marginBottom: 20 }}
              />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Welcome to CTC Group Portal
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={4}>
                Access your employee dashboard, leave records, and personal information
                securely with your Microsoft account.
              </Typography>
              <Button
                onClick={login}
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontSize: "1rem",
                  px: 5,
                  py: 1.2,
                  fontWeight: "bold",
                  borderRadius: 2,
                }}
              >
                Login
              </Button>
            </Paper>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ position: "absolute", bottom: 20 }}
            >
              © {new Date().getFullYear()} Cyprus Trading Corporation Plc. All rights reserved.
            </Typography>
          </Box>
        )}
      </Box>
    </Router>
  );
}

export default App;
