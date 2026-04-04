"use client";

import { useState, useEffect } from "react";
import { TextField, MenuItem, Button, Stack, Box, Typography } from "@mui/material";

const SA = "#FF6B00";

/* ── TPL-MODAL-SIZE-M TextField sx ── */
const FIELD_SX = {
  "& .MuiOutlinedInput-root": {
    height: 48, fontSize: 15, fontWeight: 400, color: "#1A1A1A", borderRadius: "8px",
    "& .MuiOutlinedInput-notchedOutline": { borderWidth: "1.5px", borderColor: "#E5E7EB" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#E5E7EB" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderWidth: "1.5px", borderColor: SA },
  },
  "& .MuiInputLabel-root": {
    fontSize: 15, fontWeight: 400, color: "#6B7280",
    "&.Mui-focused": { fontSize: 12, fontWeight: 400, color: SA },
    "&.MuiInputLabel-shrink": { fontSize: 12 },
  },
  "& .MuiOutlinedInput-input": {
    fontSize: 15, fontWeight: 400, color: "#1A1A1A", padding: "12px 14px",
    "&::placeholder": { fontSize: 15, fontWeight: 400 },
  },
  "& .MuiFormLabel-asterisk": { color: "#EF4444", fontWeight: 400 },
};

const SH = { shrink: true };

export default function AddCustomerPopout() {
  const [form, setForm] = useState({
    company: "", firstName: "", lastName: "", position: "",
    customerGroup: "ทั่วไป", email: "", phone: "", tenantQuota: "3",
  });

  const [channel, setChannel] = useState<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ch = new BroadcastChannel("customer_channel");
      setChannel(ch);
      return () => ch.close();
    }
  }, []);

  const handleSave = () => {
    if (channel) {
      channel.postMessage({
        type: "NEW_CUSTOMER",
        data: {
          id: `MA-${new Date().getFullYear() % 100}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`,
          firstName: form.firstName,
          lastName: form.lastName,
          position: form.position,
          company: form.company,
          email: form.email,
          phone: form.phone,
          customerGroup: form.customerGroup,
          tenantQuota: parseInt(form.tenantQuota) || 3,
          tenantUsed: 0,
          status: "รอยืนยัน Email",
          emailVerifiedAt: "",
        },
      });
    }
    window.close();
  };

  const handleCancel = () => { window.close(); };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      {/* Header */}
      <Box sx={{ bgcolor: SA, px: 3, height: 52, display: "flex", alignItems: "center" }}>
        <Typography sx={{ color: "white", fontWeight: 600, fontSize: 18 }}>สร้าง Master Account (Pop out)</Typography>
      </Box>
      {/* Body */}
      <Box sx={{ p: "28px" }}>
        <Stack spacing="20px">
          <TextField label="ชื่อบริษัท / ห้างร้าน" required fullWidth placeholder="กรอกชื่อร้าน / ชื่อบริษัท" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} sx={FIELD_SX} InputLabelProps={SH} />
          <Stack direction="row" spacing="16px">
            <TextField label="ชื่อ" required fullWidth placeholder="กรอกชื่อ" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} sx={FIELD_SX} InputLabelProps={SH} />
            <TextField label="นามสกุล" required fullWidth placeholder="กรอกนามสกุล" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} sx={FIELD_SX} InputLabelProps={SH} />
          </Stack>
          <Stack direction="row" spacing="16px">
            <TextField label="ตำแหน่ง" required fullWidth placeholder="กรอกตำแหน่ง" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} sx={FIELD_SX} InputLabelProps={SH} />
            <TextField label="กลุ่มลูกค้า" required select fullWidth value={form.customerGroup} onChange={(e) => setForm({ ...form, customerGroup: e.target.value })} sx={FIELD_SX} InputLabelProps={SH}>
              <MenuItem value="ทั่วไป">ทั่วไป</MenuItem>
              <MenuItem value="ขายส่ง">ขายส่ง</MenuItem>
              <MenuItem value="ขายปลีก">ขายปลีก</MenuItem>
              <MenuItem value="VIP">VIP</MenuItem>
            </TextField>
          </Stack>
          <Stack direction="row" spacing="16px">
            <TextField label="จำนวนธุรกิจ (Tenant Quota)" required fullWidth value={form.tenantQuota} onChange={(e) => setForm({ ...form, tenantQuota: e.target.value })} sx={FIELD_SX} InputLabelProps={SH} />
            <TextField label="เบอร์โทรศัพท์" required fullWidth placeholder="กรอกเบอร์โทร" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} sx={FIELD_SX} InputLabelProps={SH}
              InputProps={{ startAdornment: <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 1, whiteSpace: "nowrap", fontSize: 15, color: "#374151" }}>🇹🇭 +66</Box> }}
            />
          </Stack>
          <Stack direction="row" spacing="16px" alignItems="flex-start">
            <TextField label="อีเมล (Master Email)" required fullWidth placeholder="กรอกอีเมล" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} sx={{ flex: 1, ...FIELD_SX }} InputLabelProps={SH} />
            <Box sx={{ flex: 1, minHeight: 48, display: "flex", alignItems: "center", gap: 1, bgcolor: "#FEF3C7", borderRadius: "8px", px: 2, py: 1.5, fontSize: 13, fontWeight: 400, color: "#92400E" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              ระบบจะส่ง Email ยืนยันตัวตนให้ผู้ติดต่อทันที
            </Box>
          </Stack>
        </Stack>
      </Box>
      {/* Footer */}
      <Box sx={{ px: "28px", py: 2, display: "flex", justifyContent: "flex-end", gap: 1.5, borderTop: "1px solid #F0F0F0" }}>
        <Button variant="outlined" onClick={handleCancel} sx={{ textTransform: "none", fontSize: 14, fontWeight: 600, height: 40, color: SA, borderColor: SA, "&:hover": { borderColor: "#CC5500", color: "#CC5500", bgcolor: "rgba(255,107,0,0.04)" } }}>ยกเลิก</Button>
        <Button variant="contained" onClick={handleSave} sx={{ bgcolor: SA, "&:hover": { bgcolor: "#CC5500" }, textTransform: "none", fontSize: 14, fontWeight: 600, height: 40 }}>บันทึก</Button>
      </Box>
    </Box>
  );
}
