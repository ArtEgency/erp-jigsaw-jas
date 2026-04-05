"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  TextField, Button, Alert, Checkbox, FormControlLabel,
  IconButton, InputAdornment, Typography, Box, Stack,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { SA_PRIMARY } from "@/lib/theme";

export default function JASLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLocale();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError(t("auth.fillRequired"));
      return;
    }
    const success = await login(email, password);
    if (success) {
      router.push("/tenantlist");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      {/* Left: Hero Image */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          width: "55%",
          position: "relative",
          background: "linear-gradient(135deg, #0a1628 0%, #0f2847 50%, #1a3a5c 100%)",
          alignItems: "center", justifyContent: "center", overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", inset: 0 }}>
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, height: 500, borderRadius: "50%", border: `1px solid ${SA_PRIMARY}33` }} />
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 350, height: 350, borderRadius: "50%", border: `1px solid ${SA_PRIMARY}26` }} />
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 200, height: 200, borderRadius: "50%", border: `1px solid ${SA_PRIMARY}1A` }} />
          <Box sx={{ position: "absolute", top: "25%", right: "25%", width: 160, height: 160, bgcolor: `${SA_PRIMARY}33`, borderRadius: "50%", filter: "blur(48px)" }} />
          <Box sx={{ position: "absolute", bottom: "33%", left: "25%", width: 128, height: 128, bgcolor: "rgba(6,182,212,0.15)", borderRadius: "50%", filter: "blur(48px)" }} />
        </Box>
        <Box sx={{ position: "relative", zIndex: 10, textAlign: "center" }}>
          <Box sx={{ fontSize: 96, fontWeight: 700, color: "rgba(255,255,255,0.1)", letterSpacing: "0.1em", mb: 2 }}>ERP</Box>
          <Box component="p" sx={{ color: `${SA_PRIMARY}99`, fontSize: 14, letterSpacing: "0.3em", textTransform: "uppercase" }}>Enterprise Resource Planning</Box>
        </Box>
      </Box>

      {/* Right: Login Form */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", bgcolor: "white", px: 4 }}>
        <Box sx={{ width: "100%", maxWidth: 380 }}>
          {/* Logo */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Image
              src="/logo-jigsaw.png"
              alt="JIGSAW"
              width={220}
              height={50}
              style={{ margin: "0 auto 16px" }}
              priority
            />
            <Typography variant="body2" sx={{ color: SA_PRIMARY, fontWeight: 500 }}>
              {t("auth.welcome")}
            </Typography>
            <Typography variant="body2" sx={{ color: SA_PRIMARY, opacity: 0.7 }}>
              JIGSAW Backoffice
            </Typography>
          </Box>

          {/* Title */}
          <Typography variant="h6" sx={{ textAlign: "center", fontWeight: 700, mb: 3 }}>
            {t("auth.login")}
          </Typography>

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 2, fontSize: 13 }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <Stack spacing={2}>
            <TextField
              label={t("auth.email")}
              size="small"
              fullWidth
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
            />
            <TextField
              label={t("auth.password")}
              size="small"
              fullWidth
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          {/* Remember + Forgot */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", my: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  size="small"
                  sx={{ color: SA_PRIMARY, "&.Mui-checked": { color: SA_PRIMARY } }}
                />
              }
              label={<Typography variant="body2" sx={{ color: "#777" }}>{t("auth.remember")}</Typography>}
            />
            <Button variant="text" size="small" sx={{ color: SA_PRIMARY, textTransform: "none", fontSize: 13 }}>
              {t("auth.forgot")}
            </Button>
          </Box>

          {/* Login Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            sx={{
              bgcolor: SA_PRIMARY, "&:hover": { bgcolor: "#E65C00" },
              py: 1.2, fontWeight: 600, fontSize: 14, textTransform: "none",
            }}
          >
            {t("auth.login")}
          </Button>

          {/* Footer */}
          <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 3, color: "#999" }}>
            {t("auth.helpText")}{" "}
            <Button variant="text" size="small" sx={{ color: SA_PRIMARY, textTransform: "none", fontSize: 11, p: 0, minWidth: 0 }}>
              {t("auth.contactAdmin")}
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
