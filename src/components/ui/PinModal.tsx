"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, Box, Typography, Button, Stack } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useLocale } from "@/lib/locale";

const SA = "#FF6B00";
const PIN_LENGTH = 6;
const CORRECT_PIN = "123456"; // mock PIN

interface PinModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PinModal({ open, onClose, onSuccess }: PinModalProps) {
  const { t } = useLocale();
  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (open) {
      setDigits(Array(PIN_LENGTH).fill(""));
      setError(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [open]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setError(false);

    if (value && index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleUnlock = () => {
    const pin = digits.join("");
    if (pin === CORRECT_PIN) {
      onSuccess();
    } else {
      setError(true);
      setDigits(Array(PIN_LENGTH).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  };

  const isFilled = digits.every((d) => d !== "");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: "12px", overflow: "hidden" } }}
    >
      {/* Orange Top Bar */}
      <Box sx={{ bgcolor: SA, height: 6, borderRadius: "12px 12px 0 0" }} />

      <Box sx={{ p: 4, textAlign: "center" }}>
        {/* Lock Icon */}
        <Box sx={{ bgcolor: "#FFF0E6", borderRadius: "50%", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
          <LockOpenIcon sx={{ fontSize: 32, color: SA }} />
        </Box>

        <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#374151", mb: 1 }}>
          {t("pin.title")}
        </Typography>
        <Typography sx={{ fontSize: 14, color: "#6B7280", mb: 3 }}>
          {t("pin.subtitle")}
        </Typography>

        {/* PIN Input Boxes */}
        <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mb: 2 }}>
          {digits.map((digit, i) => (
            <Box key={i} component="input"
              ref={(el: HTMLInputElement | null) => { inputRefs.current[i] = el; }}
              value={digit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(i, e.target.value)}
              onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(i, e)}
              type="password"
              inputMode="numeric"
              maxLength={1}
              sx={{
                width: 48, height: 56, textAlign: "center", fontSize: 24, fontWeight: 700,
                border: error ? "2px solid #FF4D49" : `2px solid ${digit ? SA : "rgba(76,78,100,0.22)"}`,
                borderRadius: "8px", outline: "none", color: "#374151",
                "&:focus": { borderColor: SA, boxShadow: `0 0 0 2px rgba(255,107,0,0.2)` },
              }}
            />
          ))}
        </Stack>

        {error && (
          <Typography sx={{ fontSize: 13, color: "#FF4D49", mb: 2 }}>
            {t("pin.error")}
          </Typography>
        )}

        {/* Buttons */}
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
          <Button variant="outlined" onClick={onClose}
            sx={{ textTransform: "none", fontSize: 15, color: "#374151", borderColor: "rgba(76,78,100,0.22)", borderRadius: "8px", height: 42, px: 3 }}>
            {t("common.cancel")}
          </Button>
          <Button variant="contained" onClick={handleUnlock} disabled={!isFilled}
            sx={{ textTransform: "none", fontSize: 15, bgcolor: SA, borderRadius: "8px", height: 42, px: 3, boxShadow: "0px 4px 8px -4px rgba(76,78,100,0.42)", "&:hover": { bgcolor: "#E65C00" }, "&:disabled": { bgcolor: "#CCC" } }}>
            {t("pin.unlock")}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
