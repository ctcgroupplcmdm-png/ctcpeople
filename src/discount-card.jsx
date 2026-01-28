import React from "react";
import { useEffect, useState, useRef } from "react";
import { useMsal } from "@azure/msal-react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";

import argosyLogo from "./assets/logos/argosy.png";
import ctcLogo from "./assets/logos/ctc.png";
import artviewLogo from "./assets/logos/artview.png";
import CassandraLogo from "./assets/logos/cassandra.png";
import autoLogo from "./assets/logos/automotive.png";
import wwlLogo from "./assets/logos/wwl.png";
import apexlLogo from "./assets/logos/apex.png";
import nkslLogo from "./assets/logos/nks.png";
import limnilLogo from "./assets/logos/limni.png";


// ✅ Company → logo map
const companyLogos = {
  "Argosy Trading Company Ltd": argosyLogo,
  "Cyprus Trading Corporation Plc": ctcLogo,
  "Artview Co. Ltd": artviewLogo,
  "CTC Automotive LTD": autoLogo,
  "Cassandra Trading Ltd": CassandraLogo,
  "Woolworth (Cyprus) Properties Plc": wwlLogo,
  "Apex Ltd": apexlLogo,
  "N.K. Shacolas (Holdings) Ltd": nkslLogo,
  "Cyprus Limni Resorts & Golf Courses Plc": limnilLogo,
};

function DiscountCard() {
  const { instance, accounts } = useMsal();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const didInit = useRef(false);

  const now = new Date();

  const logout = () => instance.logoutRedirect();

  // ✅ SAME Logic App as Landing Page
  const urlUserInfo =
    "https://prod-253.westeurope.logic.azure.com:443/workflows/9825f1492046406ca55a012da579ae3c/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=PNW2Pv5Bp6DnM7rTWHyU3luOrCqoXvMlxD0Xlz5525A";

  useEffect(() => {
    const fetchUser = async () => {
      if (accounts.length === 0) return;

      const account = accounts[0];
      const oid = account.idTokenClaims?.oid || account.idTokenClaims?.sub;

      try {
        const res = await fetch(urlUserInfo, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oid }),
        });

        const data = await res.json();

        setUser({
          name: data.displayName || account.name || "User",
          employeeId: data.employeeId || "N/A",
          companyName: data.companyName || "",
        });
      } catch (err) {
        console.error("Error fetching user info:", err);
      } finally {
        setLoading(false);
      }
    };

    if (didInit.current) return;
    didInit.current = true;

    fetchUser();
  }, [accounts]);

  // 🔹 Loading state
  if (loading)
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (!user) return null;

  // Split name
  const parts = user.name.split(" ");
  const first = parts[0] || "";
  const middle = parts.length > 2 ? parts.slice(1, -1).join(" ") : "";
  const last = parts.length > 1 ? parts[parts.length - 1] : "";

  return (
    <Box sx={{ p: 4, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* 🔹 Header (ONLY logout) */}
      <Grid container justifyContent="flex-end" sx={{ mb: 3 }}>
        <Button variant="outlined" color="error" onClick={logout}>
          Logout
        </Button>
      </Grid>

      {/* 🔹 Centered Card */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Paper
          elevation={12}
          sx={{
            width: 360,
            height: 520,
            p: 4,
            borderRadius: 4,
            position: "relative",
            textAlign: "center",
            background: "linear-gradient(to bottom, #B9DCFF 0%, #ffffff 60%)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          }}
        >
          {/* Title */}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ mb: 6, letterSpacing: 3 }}
          >
            DISCOUNT CARD
          </Typography>

          {/* Logo */}
          {companyLogos[user.companyName] && (
  <img
    src={companyLogos[user.companyName]}
    alt="logo"
    style={{
      position: "absolute",
      bottom: 20,          // stick to bottom
      left: 20,
      right: 20,
      maxHeight: 90,      // smaller so it never overlaps
      objectFit: "contain",
      opacity: 0.25,      // subtle watermark look (optional but recommended)
      pointerEvents: "none",
    }}
  />
)}


          {/* Names */}
          <Typography variant="h5" fontWeight="bold">
            {first}
          </Typography>

          {middle && (
            <Typography variant="h6" color="text.secondary">
              {middle}
            </Typography>
          )}

          <Typography variant="h5" fontWeight="bold">
            {last}
          </Typography>

          {/* Employee ID */}
          <Typography sx={{ mt: 4, fontWeight: 600 }}>
            Employee Code: {user.employeeId}
          </Typography>

          {/* Timestamp */}
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              color: "gray",
            }}
          >
            {now.toLocaleString()}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default DiscountCard;
