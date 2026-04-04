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
    <div className="min-h-screen flex">
      {/* Left: Hero Image */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-gradient-to-br from-[#0a1628] via-[#0f2847] to-[#1a3a5c] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#FF6B00]/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-[#FF6B00]/15" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-[#FF6B00]/10" />
          <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-[#FF6B00]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-cyan-500/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center">
          <div className="text-8xl font-bold text-white/10 tracking-widest mb-4">ERP</div>
          <p className="text-[#FF6B00]/60 text-sm tracking-[0.3em] uppercase">Enterprise Resource Planning</p>
        </div>
      </div>

      {/* Right: Login Form */}
      <Box className="flex-1 flex flex-col items-center justify-center bg-white px-8">
        <Box sx={{ width: "100%", maxWidth: 380 }}>
          {/* Logo */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Image
              src="/logo-jigsaw.png"
              alt="JIGSAW"
              width={220}
              height={50}
              className="mx-auto mb-4"
              priority
            />
            <Typography variant="body2" sx={{ color: "#FF6B00", fontWeight: 500 }}>
              {t("auth.welcome")}
            </Typography>
            <Typography variant="body2" sx={{ color: "#FF6B00", opacity: 0.7 }}>
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
                  sx={{ color: "#FF6B00", "&.Mui-checked": { color: "#FF6B00" } }}
                />
              }
              label={<Typography variant="body2" sx={{ color: "#777" }}>{t("auth.remember")}</Typography>}
            />
            <Button variant="text" size="small" sx={{ color: "#FF6B00", textTransform: "none", fontSize: 13 }}>
              {t("auth.forgot")}
            </Button>
          </Box>

          {/* Login Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            sx={{
              bgcolor: "#FF6B00", "&:hover": { bgcolor: "#E65C00" },
              py: 1.2, fontWeight: 600, fontSize: 14, textTransform: "none",
            }}
          >
            {t("auth.login")}
          </Button>

          {/* Footer */}
          <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 3, color: "#999" }}>
            {t("auth.helpText")}{" "}
            <Button variant="text" size="small" sx={{ color: "#FF6B00", textTransform: "none", fontSize: 11, p: 0, minWidth: 0 }}>
              {t("auth.contactAdmin")}
            </Button>
          </Typography>
        </Box>
      </Box>
    </div>
  );
}
