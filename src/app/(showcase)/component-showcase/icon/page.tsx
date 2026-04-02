"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import AppsIcon from "@mui/icons-material/Apps";
import CategoryIcon from "@mui/icons-material/Category";
import WidgetsIcon from "@mui/icons-material/Widgets";

import { TENANT_PRIMARY as OR } from "@/lib/theme";

/* ══════════════════════════════════════ */
/* ── ICON DATA ── */
/* ══════════════════════════════════════ */
interface IconItem {
  name: string;
  label: string;
  file: string;
}

interface IconGroup {
  group: string;
  description: string;
  basePath: string;
  items: IconItem[];
}

const ICON_GROUPS: IconGroup[] = [
  {
    group: "Main Menu Icons",
    description: "ไอคอนเมนูหลักของระบบ ERP ใช้ใน Module Navigation Bar",
    basePath: "/icons/menu",
    items: [
      { name: "my-tasks", label: "งานของฉัน", file: "my-tasks.svg" },
      { name: "products", label: "สินค้า", file: "products.svg" },
      { name: "purchase", label: "จัดซื้อ", file: "purchase.svg" },
      { name: "warehouse", label: "คลังสินค้า", file: "warehouse.svg" },
      { name: "contacts", label: "ลูกค้า / ผู้จำหน่าย", file: "contacts.svg" },
      { name: "sales", label: "ขาย", file: "sales.svg" },
      { name: "finance", label: "การเงินและบัญชี", file: "finance.svg" },
      { name: "manufacturing", label: "การผลิต", file: "manufacturing.svg" },
      { name: "hr", label: "บุคคล", file: "hr.svg" },
      { name: "reports", label: "รายงาน", file: "reports.svg" },
      { name: "analytics", label: "การวิเคราะห์", file: "analytics.svg" },
    ],
  },
  {
    group: "Action Icons",
    description: "ไอคอนสำหรับปุ่มกระทำ เช่น แก้ไข ลบ คัดลอก แนบไฟล์",
    basePath: "/icons/actions",
    items: [
      { name: "edit", label: "แก้ไข", file: "edit.svg" },
      { name: "delete", label: "ลบ", file: "delete.svg" },
      { name: "cancel", label: "ยกเลิก", file: "cancel.svg" },
      { name: "pen", label: "เขียน", file: "pen.svg" },
      { name: "copy", label: "คัดลอก", file: "copy.svg" },
      { name: "scan", label: "สแกน", file: "scan.svg" },
      { name: "attachment", label: "แนบไฟล์", file: "attachment.svg" },
      { name: "photo-plus", label: "เพิ่มรูปภาพ", file: "photo-plus.svg" },
    ],
  },
  {
    group: "Status Icons",
    description: "ไอคอนแสดงสถานะ เช่น สำเร็จ ดู ล็อค",
    basePath: "/icons/status",
    items: [
      { name: "success", label: "สำเร็จ", file: "success.svg" },
      { name: "view", label: "ดู", file: "view.svg" },
      { name: "lock-password", label: "ล็อค/รหัสผ่าน", file: "lock-password.svg" },
    ],
  },
  {
    group: "Navigation Icons",
    description: "ไอคอนสำหรับ UI navigation เช่น dropdown ปฏิทิน จดหมาย",
    basePath: "/icons/nav",
    items: [
      { name: "arrow-dropdown", label: "ลูกศร Dropdown", file: "arrow-dropdown.svg" },
      { name: "more-vert", label: "เมนูเพิ่มเติม", file: "more-vert.svg" },
      { name: "calendar", label: "ปฏิทิน", file: "calendar.svg" },
      { name: "letter", label: "จดหมาย", file: "letter.svg" },
      { name: "mail-popup", label: "แจ้งเตือนอีเมล", file: "mail-popup.svg" },
    ],
  },
  {
    group: "Data Icons",
    description: "ไอคอนแสดงข้อมูล เช่น กราฟ ไฟล์ PDF โปรไฟล์",
    basePath: "/icons/data",
    items: [
      { name: "graph-up", label: "กราฟขึ้น", file: "graph-up.svg" },
      { name: "pie-chart", label: "แผนภูมิวงกลม", file: "pie-chart.svg" },
      { name: "user-id", label: "บัตรประจำตัว", file: "user-id.svg" },
      { name: "profile-circle", label: "โปรไฟล์", file: "profile-circle.svg" },
      { name: "file-pdf", label: "ไฟล์ PDF", file: "file-pdf.svg" },
      { name: "image", label: "รูปภาพ", file: "image.svg" },
    ],
  },
  {
    group: "Commerce Icons",
    description: "ไอคอนธุรกิจ/ERP เช่น ร้านค้า กล่อง ตั้งค่า",
    basePath: "/icons/commerce",
    items: [
      { name: "bag", label: "กระเป๋า/ถุง", file: "bag.svg" },
      { name: "box", label: "กล่องสินค้า", file: "box.svg" },
      { name: "shop", label: "ร้านค้า", file: "shop.svg" },
      { name: "home", label: "บ้าน/หน้าหลัก", file: "home.svg" },
      { name: "container", label: "คอนเทนเนอร์", file: "container.svg" },
      { name: "container-2", label: "คอนเทนเนอร์ 2", file: "container-2.svg" },
      { name: "settings", label: "ตั้งค่า", file: "settings.svg" },
      { name: "padding", label: "ระยะขอบ", file: "padding.svg" },
    ],
  },
];

/* ── Sidebar menu for icon page ── */
const SIDEBAR_ITEMS = ICON_GROUPS.map((g, i) => ({
  id: g.group,
  label: g.group,
  icon: i === 0 ? <AppsIcon fontSize="small" /> : <CategoryIcon fontSize="small" />,
}));

/* ══════════════════════════════════════ */
/* ── ICON CARD ── */
/* ══════════════════════════════════════ */
function IconCard({ icon, basePath }: { icon: IconItem; basePath: string }) {
  const [hovered, setHovered] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const codeSrc = `${basePath}/${icon.file}`;
  const codeSnippet = `<img src="${codeSrc}" alt="${icon.label}" width={20} height={20} />`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Paper
      variant="outlined"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowCode(false); }}
      sx={{
        p: 2.5,
        textAlign: "center",
        borderRadius: 2,
        transition: "all 0.2s",
        borderColor: hovered ? OR : "#E0E0E0",
        boxShadow: hovered ? `0 4px 12px ${OR}15` : "none",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* <> Code button — show on hover */}
      {hovered && (
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); setShowCode(!showCode); }}
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            bgcolor: showCode ? OR : "#F0F0F0",
            color: showCode ? "#fff" : "#888",
            width: 26,
            height: 26,
            fontSize: "0.7rem",
            fontWeight: 700,
            fontFamily: "monospace",
            "&:hover": { bgcolor: OR, color: "#fff" },
            transition: "all 0.15s",
          }}
        >
          {"<>"}
        </IconButton>
      )}

      <Box
        sx={{
          width: 56,
          height: 56,
          mx: "auto",
          mb: 1.5,
          borderRadius: 2,
          bgcolor: hovered ? `${OR}10` : "#F8F8FA",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
        }}
      >
        <img
          src={`${basePath}/${icon.file}`}
          alt={icon.label}
          width={36}
          height={36}
          style={{ borderRadius: 6 }}
        />
      </Box>
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, color: "#333", mb: 0.3, fontSize: "0.85rem" }}
      >
        {icon.label}
      </Typography>
      <Typography
        variant="caption"
        sx={{ color: "#aaa", fontSize: "0.7rem", fontFamily: "monospace" }}
      >
        {icon.file}
      </Typography>

      {/* Code Snippet Panel */}
      {showCode && (
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            bgcolor: "#1E1E2E",
            borderRadius: 1.5,
            textAlign: "left",
            position: "relative",
          }}
        >
          <Typography
            component="pre"
            sx={{
              fontSize: "0.65rem",
              color: "#A9DC76",
              fontFamily: "'Fira Code', 'Consolas', monospace",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              m: 0,
              lineHeight: 1.5,
            }}
          >
            {codeSnippet}
          </Typography>
          <IconButton
            size="small"
            onClick={handleCopy}
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              color: copied ? "#A9DC76" : "#888",
              width: 22,
              height: 22,
              "&:hover": { color: "#fff" },
            }}
          >
            {copied ? (
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M20 6L9 17l-5-5"/></svg>
            ) : (
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            )}
          </IconButton>
        </Box>
      )}
    </Paper>
  );
}

/* ══════════════════════════════════════ */
/* ── SECTION BLOCK ── */
/* ══════════════════════════════════════ */
function SectionBlock({
  id,
  title,
  description,
  count,
  children,
}: {
  id: string;
  title: string;
  description: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Box id={id} sx={{ mb: 5, scrollMarginTop: "24px" }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: OR,
            borderBottom: `2px solid ${OR}`,
            pb: 0.5,
            display: "inline-block",
          }}
        >
          {title}
        </Typography>
        <Chip label={`${count} icons`} size="small" variant="outlined" sx={{ fontSize: "0.7rem" }} />
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, fontSize: "0.85rem" }}>
        {description}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

/* ══════════════════════════════════════ */
/* ── MAIN PAGE ── */
/* ══════════════════════════════════════ */
export default function IconShowcasePage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(ICON_GROUPS[0]?.group ?? "");
  const [iconSearch, setIconSearch] = useState("");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const totalIcons = ICON_GROUPS.reduce((sum, g) => sum + g.items.length, 0);

  /* ── Filter icons by search (Thai + English) ── */
  const filteredIconGroups = ICON_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((icon) => {
      if (!iconSearch) return true;
      const q = iconSearch.toLowerCase();
      return (
        icon.label.toLowerCase().includes(q) ||
        icon.name.toLowerCase().includes(q) ||
        icon.file.toLowerCase().includes(q)
      );
    }),
  })).filter((g) => g.items.length > 0);
  const filteredTotal = filteredIconGroups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#F5F5F9" }}>
      {/* ═══ SIDEBAR ═══ */}
      <Box
        sx={{
          width: 260,
          bgcolor: "#fff",
          borderRight: "1px solid #E0E0E0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <Box sx={{ p: 2, borderBottom: "1px solid #E0E0E0" }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: OR,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <WidgetsIcon sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: OR, letterSpacing: 1 }}>
                JIGSAW
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Icon Library
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Search */}
        <Box sx={{ px: 1.5, py: 1, borderBottom: "1px solid #E0E0E0" }}>
          <TextField
            size="small"
            placeholder="ค้นหาไอคอน (ไทย/Eng)..."
            value={iconSearch}
            onChange={(e) => setIconSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ fontSize: 18, color: "#bbb", mr: 0.5 }} />,
              ...(iconSearch && {
                endAdornment: (
                  <IconButton size="small" onClick={() => setIconSearch("")} sx={{ p: 0.3 }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </IconButton>
                ),
              }),
            }}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                fontSize: "0.82rem",
                bgcolor: "#F8F8FA",
                "& fieldset": { borderColor: "#E8E8E8" },
                "&:hover fieldset": { borderColor: OR },
                "&.Mui-focused fieldset": { borderColor: OR },
              },
            }}
          />
        </Box>

        {/* Navigation */}
        <Box sx={{ flex: 1, overflow: "auto", py: 1 }}>
          {ICON_GROUPS.map((group, i) => (
            <Box key={group.group} sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={activeSection === group.group}
                onClick={() => {
                  setActiveSection(group.group);
                  scrollTo(group.group);
                }}
                sx={{
                  mx: 1,
                  borderRadius: 1.5,
                  "&.Mui-selected": { bgcolor: `${OR}12`, color: OR },
                  "&.Mui-selected .MuiListItemIcon-root": { color: OR },
                }}
              >
                <ListItemIcon sx={{ minWidth: 28 }}>
                  {SIDEBAR_ITEMS[i]?.icon}
                </ListItemIcon>
                <ListItemText
                  primary={group.group}
                  secondary={`${group.items.length} icons`}
                  primaryTypographyProps={{
                    fontSize: "0.85rem",
                    fontWeight: activeSection === group.group ? 600 : 400,
                  }}
                  secondaryTypographyProps={{ fontSize: "0.7rem" }}
                />
              </ListItemButton>
            </Box>
          ))}
        </Box>

        {/* Back button */}
        <Box sx={{ p: 2, borderTop: "1px solid #E0E0E0" }}>
          <Stack spacing={1}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/component-showcase")}
              size="small"
            >
              Component Library
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => router.push("/login")}
              size="small"
              sx={{ color: "#999" }}
            >
              Login
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* ═══ MAIN CONTENT ═══ */}
      <Box sx={{ flex: 1, overflow: "auto", p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#333" }}>
            Icon Library
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            ไอคอนทั้งหมดที่ใช้ในระบบ Jigsaw ERP — แบ่งตามหมวดหมู่การใช้งาน
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
            <Chip label={`${totalIcons} Total Icons`} size="small" color="primary" />
            <Chip label={`${ICON_GROUPS.length} Categories`} size="small" color="secondary" />
            <Chip label="SVG Format" size="small" variant="outlined" />
          </Stack>
        </Box>

        {/* Search Bar in Content */}
        <Box sx={{ mb: 3 }}>
          <TextField
            size="small"
            placeholder="ค้นหาไอคอน... (เช่น สินค้า, products, hr)"
            value={iconSearch}
            onChange={(e) => setIconSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ fontSize: 20, color: "#bbb", mr: 1 }} />,
              ...(iconSearch && {
                endAdornment: (
                  <IconButton size="small" onClick={() => setIconSearch("")}>
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </IconButton>
                ),
              }),
            }}
            sx={{
              width: "100%",
              maxWidth: 480,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                fontSize: "0.9rem",
                bgcolor: "#fff",
                "& fieldset": { borderColor: "#E0E0E0" },
                "&:hover fieldset": { borderColor: OR },
                "&.Mui-focused fieldset": { borderColor: OR },
              },
            }}
          />
          {iconSearch && (
            <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "#999" }}>
              พบ {filteredTotal} จาก {totalIcons} ไอคอน
            </Typography>
          )}
        </Box>

        {/* Icon Sections */}
        {filteredIconGroups.map((group) => (
          <SectionBlock
            key={group.group}
            id={group.group}
            title={group.group}
            description={group.description}
            count={group.items.length}
          >
            {group.items.map((icon) => (
              <IconCard key={icon.name} icon={icon} basePath={group.basePath} />
            ))}
          </SectionBlock>
        ))}

        {/* Empty State */}
        {iconSearch && filteredIconGroups.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              ไม่พบไอคอน &quot;{iconSearch}&quot;
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ลองค้นหาด้วยชื่อไทยหรือภาษาอังกฤษ
            </Typography>
          </Box>
        )}

        {/* Footer */}
        <Divider sx={{ my: 4 }} />
        <Box sx={{ textAlign: "center", pb: 4 }}>
          <Typography variant="body2" color="text.secondary">
            JIGSAW ERP - Icon Library
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total: {totalIcons} icons in {ICON_GROUPS.length} categories | SVG Format
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
