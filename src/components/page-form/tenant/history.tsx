"use client";

import { Typography } from "@mui/material";
import { SA } from "./constants";

interface HistoryTabProps {
  locale: string;
}

export default function HistoryTab({ locale }: HistoryTabProps) {
  return (
    <>
      <Typography sx={{ fontSize: 20, fontWeight: 700, color: SA, mb: 2 }}>
        {locale === "en" ? "History" : "ประวัติ"}
      </Typography>
      <Typography sx={{ fontSize: 15, color: "#9CA3AF" }}>
        {locale === "en" ? "No activity yet" : "ยังไม่มีประวัติ"}
      </Typography>
    </>
  );
}
