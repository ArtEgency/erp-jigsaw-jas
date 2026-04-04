"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

/* ── MUI ── */
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Slider from "@mui/material/Slider";
import Rating from "@mui/material/Rating";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
// Fab removed — moved to Icon Library
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

/* ── MUI Icons ── */
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import PrintIcon from "@mui/icons-material/Print";
import SaveIcon from "@mui/icons-material/Save";
import FileCopyIcon from "@mui/icons-material/FileCopy";
// CheckCircleIcon, InfoIcon removed — moved to Icon Library
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TableChartIcon from "@mui/icons-material/TableChart";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import FeedbackIcon from "@mui/icons-material/Feedback";
import WidgetsIcon from "@mui/icons-material/Widgets";
import TimelineIcon from "@mui/icons-material/Timeline";

/* ── MUI X DataGrid ── */
import { DataGrid, GridColDef } from "@mui/x-data-grid";

/* ── Custom Components ── */
import {
  FormTextField,
  FormAutocomplete,
  FormSwitch,
  FormDialog,
  ActionButtons,
  createActions,
  useToast,
} from "@/components/ui";

import { TENANT_PRIMARY as OR } from "@/lib/theme";

/* ══════════════════════════════════════ */
/* ── SIDEBAR MENU (Grouped) ── */
/* ══════════════════════════════════════ */
interface SectionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  keywords?: string;
}
interface SectionGroup {
  group: string;
  items: SectionItem[];
}

const SECTION_GROUPS: SectionGroup[] = [
  {
    group: "Icons & Assets",
    items: [
      { id: "__link__/component-showcase/icon", label: "Icons (แยกหน้า)", icon: <InventoryIcon fontSize="small" />, keywords: "icon svg menu ไอคอน รูป" },
      { id: "__link__/component-showcase/template", label: "Templates (แยกหน้า)", icon: <DashboardIcon fontSize="small" />, keywords: "template standard design datalist ตาราง มาตรฐาน เทมเพลต" },
    ],
  },
  {
    group: "Foundation",
    items: [
      { id: "typo", label: "Typo & Font Size", icon: <TextFieldsIcon fontSize="small" />, keywords: "typo typography font size weight color ฟอนต์ ขนาด สี" },
    ],
  },
  {
    group: "Form Elements",
    items: [
      { id: "buttons", label: "Buttons & FAB", icon: <WidgetsIcon fontSize="small" />, keywords: "button ปุ่ม contained outlined text fab floating action" },
      { id: "inputs", label: "Text Inputs", icon: <TextFieldsIcon fontSize="small" />, keywords: "input textfield ช่องกรอก password search" },
      { id: "selects", label: "Selects & Autocomplete", icon: <ViewListIcon fontSize="small" />, keywords: "select dropdown autocomplete เลือก ค้นหา combobox" },
      { id: "switches", label: "Switches & Toggles", icon: <ToggleOnIcon fontSize="small" />, keywords: "switch toggle checkbox radio สวิตช์ เปิดปิด" },
      { id: "forms", label: "Forms (RHF)", icon: <EditIcon fontSize="small" />, keywords: "form react-hook-form zod validation ฟอร์ม" },
    ],
  },
  {
    group: "Data Display",
    items: [
      { id: "tables", label: "Tables & DataGrid", icon: <TableChartIcon fontSize="small" />, keywords: "table datagrid ตาราง grid row column pagination" },
      { id: "cards", label: "Cards & Paper", icon: <DashboardIcon fontSize="small" />, keywords: "card paper การ์ด กระดาษ elevation" },
      { id: "lists", label: "Lists", icon: <ViewListIcon fontSize="small" />, keywords: "list รายการ listitem" },
      { id: "chips", label: "Chips & Badges", icon: <StarIcon fontSize="small" />, keywords: "chip badge แท็ก tag ป้าย notification" },
      { id: "avatars", label: "Avatars & Typography", icon: <PersonIcon fontSize="small" />, keywords: "avatar typography font ตัวอักษร รูปโปรไฟล์ heading" },
    ],
  },
  {
    group: "Feedback",
    items: [
      { id: "dialogs", label: "Dialogs & Modals", icon: <ViewCarouselIcon fontSize="small" />, keywords: "dialog modal popup confirm alert กล่องข้อความ" },
      { id: "feedback", label: "Feedback & Alerts", icon: <FeedbackIcon fontSize="small" />, keywords: "alert snackbar toast notification แจ้งเตือน success error warning" },
      { id: "progress", label: "Progress & Skeleton", icon: <TimelineIcon fontSize="small" />, keywords: "progress loading skeleton spinner โหลด circular linear" },
    ],
  },
  {
    group: "Navigation",
    items: [
      { id: "navigation", label: "Navigation", icon: <HomeIcon fontSize="small" />, keywords: "tabs breadcrumbs nav เมนู แท็บ เส้นทาง link" },
      { id: "timeline", label: "Timeline & Stepper", icon: <CalendarMonthIcon fontSize="small" />, keywords: "timeline stepper step ขั้นตอน ไทม์ไลน์ wizard" },
      { id: "speeddial", label: "SpeedDial & Rating", icon: <StarIcon fontSize="small" />, keywords: "speeddial rating star ดาว คะแนน" },
    ],
  },
  {
    group: "Layout",
    items: [
      { id: "layout", label: "Layout & Accordion", icon: <ViewModuleIcon fontSize="small" />, keywords: "accordion collapse divider tooltip layout พับ แบ่ง" },
    ],
  },
];

/* Flat list for counting / iterating all sections */
const ALL_SECTIONS = SECTION_GROUPS.flatMap((g) => g.items);

/* ══════════════════════════════════════ */
/* ── SECTION WRAPPER ── */
/* ══════════════════════════════════════ */
function SectionBlock({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <Box id={id} sx={{ mb: 5, scrollMarginTop: "80px" }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: OR, borderBottom: `2px solid ${OR}`, pb: 1, display: "inline-block" }}>
        {title}
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        {children}
      </Paper>
    </Box>
  );
}

/* ── Sub-section label with optional Last Approved ── */
function SubLabel({ children, approved }: { children: React.ReactNode; approved?: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, mb: 1.5 }}>
      <Typography variant="subtitle2" sx={{ color: "#666" }}>{children}</Typography>
      {approved && (
        <Typography variant="caption" sx={{ color: "#bbb", fontStyle: "italic", fontSize: "0.7rem" }}>
          (Last Approved {approved})
        </Typography>
      )}
    </Box>
  );
}

/* ══════════════════════════════════════ */
/* ── MAIN COMPONENT ── */
/* ══════════════════════════════════════ */
export default function ComponentShowcase() {
  const router = useRouter();
  const { showSuccess, showError, showWarning } = useToast();

  /* ── Form demo ── */
  const { control, handleSubmit } = useForm({
    defaultValues: {
      demoName: "สมชาย ใจดี",
      demoEmail: "demo@jigsaw.com",
      demoCategory: "",
      demoActive: true,
      demoNotes: "",
    },
  });

  /* ── Dialog state ── */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  /* ── Toggle states ── */
  const [tabValue, setTabValue] = useState(0);
  const [sliderVal, setSliderVal] = useState(40);
  const [ratingVal, setRatingVal] = useState<number | null>(3);
  const [toggleFormat, setToggleFormat] = useState<string[]>(["bold"]);
  const [toggleView, setToggleView] = useState("list");
  const [activeStep, setActiveStep] = useState(1);
  const [switchChecked, setSwitchChecked] = useState(true);

  /* ── DataGrid demo data ── */
  const gridRows = [
    { id: 1, code: "PRD001", name: "กาแฟคั่วเข้ม", category: "เครื่องดื่ม", price: 350, stock: 120, active: true },
    { id: 2, code: "PRD002", name: "ชาเขียวมัทฉะ", category: "เครื่องดื่ม", price: 280, stock: 85, active: true },
    { id: 3, code: "PRD003", name: "น้ำผึ้งดอกไม้ป่า", category: "อาหาร", price: 450, stock: 45, active: true },
    { id: 4, code: "PRD004", name: "แก้วเซรามิก 300ml", category: "ของใช้", price: 199, stock: 200, active: false },
    { id: 5, code: "PRD005", name: "เมล็ดกาแฟอาราบิก้า 1kg", category: "เครื่องดื่ม", price: 890, stock: 30, active: true },
  ];

  const gridColumns: GridColDef[] = [
    { field: "code", headerName: "รหัสสินค้า", width: 120 },
    {
      field: "name", headerName: "ชื่อสินค้า", flex: 1, minWidth: 200,
      renderCell: (p) => (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ height: "100%" }}>
          <Avatar sx={{ width: 30, height: 30, bgcolor: OR, fontSize: "0.75rem" }}>{(p.value as string)?.charAt(0)}</Avatar>
          <Typography variant="body2">{p.value as string}</Typography>
        </Stack>
      ),
    },
    { field: "category", headerName: "หมวดหมู่", width: 130 },
    { field: "price", headerName: "ราคา (บาท)", width: 120, type: "number" },
    { field: "stock", headerName: "คงเหลือ", width: 100, type: "number" },
    {
      field: "active", headerName: "สถานะ", width: 120,
      renderCell: (p) => <Chip label={p.value ? "ใช้งาน" : "ปิด"} size="small" color={p.value ? "success" : "default"} />,
    },
    {
      field: "actions", headerName: "จัดการ", width: 140, sortable: false,
      renderCell: () => (
        <ActionButtons actions={[
          createActions.edit(() => showSuccess("กด Edit")),
          createActions.delete(() => showError("กด Delete")),
          createActions.view(() => showWarning("กด View")),
        ]} />
      ),
    },
  ];

  /* ── Scroll to section ── */
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  /* ── Active section tracking ── */
  const [activeSection, setActiveSection] = useState("icons");
  const contentRef = useRef<HTMLDivElement>(null);

  /* ── Collapsed groups state (all expanded by default) ── */
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const toggleGroup = (group: string) =>
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));

  /* ── Global Search ── */
  const [searchQuery, setSearchQuery] = useState("");
  const filteredGroups = SECTION_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((s) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.label.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        (s.keywords && s.keywords.toLowerCase().includes(q))
      );
    }),
  })).filter((g) => g.items.length > 0);

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
            <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: OR, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography sx={{ fontSize: "1.2rem" }}>🧩</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: OR, letterSpacing: 1 }}>JIGSAW</Typography>
              <Typography variant="caption" color="text.secondary">Component Library</Typography>
            </Box>
          </Stack>
        </Box>

        {/* Search */}
        <Box sx={{ px: 1.5, py: 1, borderBottom: "1px solid #E0E0E0" }}>
          <TextField
            size="small"
            placeholder="ค้นหา component..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ fontSize: 18, color: "#bbb", mr: 0.5 }} />,
              ...(searchQuery && {
                endAdornment: (
                  <IconButton size="small" onClick={() => setSearchQuery("")} sx={{ p: 0.3 }}>
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

        {/* Navigation — Collapsible Groups */}
        <Box sx={{ flex: 1, overflow: "auto", py: 1 }}>
          {(searchQuery ? filteredGroups : SECTION_GROUPS).map((group) => {
            const isCollapsed = searchQuery ? false : (collapsedGroups[group.group] ?? false);
            return (
              <Box key={group.group} sx={{ mb: 0.5 }}>
                {/* Group Header */}
                <ListItemButton
                  onClick={() => toggleGroup(group.group)}
                  sx={{
                    mx: 1,
                    borderRadius: 1.5,
                    py: 0.5,
                    "&:hover": { bgcolor: "#F5F5F9" },
                  }}
                >
                  <ListItemText
                    primary={group.group}
                    primaryTypographyProps={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "#999",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  />
                  <ExpandMoreIcon
                    sx={{
                      fontSize: 16,
                      color: "#bbb",
                      transition: "transform 0.2s",
                      transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                    }}
                  />
                </ListItemButton>

                {/* Group Items */}
                {!isCollapsed && (
                  <List dense disablePadding>
                    {group.items.map((s) => (
                      <ListItemButton
                        key={s.id}
                        selected={activeSection === s.id}
                        onClick={() => {
                          if (s.id.startsWith("__link__")) {
                            router.push(s.id.replace("__link__", ""));
                          } else {
                            setActiveSection(s.id);
                            scrollTo(s.id);
                          }
                        }}
                        sx={{
                          mx: 1,
                          borderRadius: 1.5,
                          mb: 0.3,
                          pl: 3,
                          "&.Mui-selected": { bgcolor: `${OR}12`, color: OR },
                          "&.Mui-selected .MuiListItemIcon-root": { color: OR },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 28 }}>{s.icon}</ListItemIcon>
                        <ListItemText primary={s.label} primaryTypographyProps={{ fontSize: "0.82rem", fontWeight: activeSection === s.id ? 600 : 400 }} />
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </Box>
            );
          })}
          {searchQuery && filteredGroups.length === 0 && (
            <Box sx={{ px: 3, py: 4, textAlign: "center" }}>
              <Typography variant="caption" color="text.secondary">ไม่พบ &quot;{searchQuery}&quot;</Typography>
            </Box>
          )}
        </Box>

        {/* Back button */}
        <Box sx={{ p: 2, borderTop: "1px solid #E0E0E0" }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/tenantlist")}
            size="small"
          >
            กลับหน้า Master Account List
          </Button>
        </Box>
      </Box>

      {/* ═══ MAIN CONTENT ═══ */}
      <Box ref={contentRef} sx={{ flex: 1, overflow: "auto", p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#333" }}>
            Component ของระบบ
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            MUI Component Library - Interactive Live Preview (เหมือน ThemeForest)
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
            <Chip label="MUI v5" size="small" color="primary" />
            <Chip label="MUI X DataGrid" size="small" color="secondary" />
            <Chip label="React Hook Form" size="small" variant="outlined" />
            <Chip label="Tailwind CSS" size="small" variant="outlined" />
          </Stack>
        </Box>

        {/* ═══════════════════════════════════════════ */}
        {/* ── 0. TYPO & FONT SIZE ── */}
        {/* ═══════════════════════════════════════════ */}
        <SectionBlock id="typo" title="Typo & Font Size">
          <Typography variant="body2" sx={{ color: "#777", mb: 2 }}>
            DATA LIST — หน้าตาราง (1920px) — ค่ามาตรฐานสำหรับการออกแบบหน้า DataList ทุกหน้า
          </Typography>
          <Paper sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid #E0E0E0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, fontFamily: "'Sarabun', sans-serif" }}>
              <thead>
                <tr style={{ backgroundColor: "#1A1A1A", color: "white" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, width: "30%" }}>Element</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600 }}>Font size</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600 }}>Weight</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600 }}>Height / Size</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600 }}>สี</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { el: "Breadcrumb", size: "13px", weight: "400", height: "—", color: "muted / primary", colorHex: "#777" },
                  { el: 'Page title "รายชื่อลูกค้า"', size: "22px", weight: "700", height: "—", color: "#1A1A1A", colorHex: "#1A1A1A" },
                  { el: 'Button "ส่งออกรายงาน"', size: "13px", weight: "600", height: "h: 36px", color: "outline orange", colorHex: "#FF6B00" },
                  { el: 'Button "เพิ่มลูกค้า"', size: "13px", weight: "600", height: "h: 36px", color: "#FF6B00", colorHex: "#FF6B00" },
                  { el: "Search input", size: "14px", weight: "400", height: "h: 40px", color: "border #E5E7EB", colorHex: "#E5E7EB" },
                  { el: "Table header", size: "13px", weight: "600", height: "—", color: "#6B7280", colorHex: "#6B7280" },
                  { el: "Table body — ชื่อหลัก", size: "14px", weight: "500", height: "—", color: "#1A1A1A", colorHex: "#1A1A1A" },
                  { el: "Table body — sub (ตำแหน่ง)", size: "12px", weight: "400", height: "—", color: "#6B7280", colorHex: "#6B7280" },
                  { el: "Table body — ทั่วไป", size: "14px", weight: "400", height: "—", color: "#1A1A1A", colorHex: "#1A1A1A" },
                  { el: "Table row height", size: "—", weight: "—", height: "~56px", color: "—", colorHex: "" },
                  { el: "Link รหัส MA-xx", size: "14px", weight: "500", height: "—", color: "#FF6B00", colorHex: "#FF6B00" },
                  { el: "Status badge", size: "12px", weight: "500", height: "h: ~24px", color: "ตามสถานะ", colorHex: "" },
                  { el: "Pagination text", size: "13px", weight: "400", height: "—", color: "#6B7280", colorHex: "#6B7280" },
                  { el: "Pagination button", size: "13px", weight: "400", height: "28×28px", color: "active: orange", colorHex: "#FF6B00" },
                  { el: "Footer text", size: "12px", weight: "400", height: "—", color: "#9CA3AF", colorHex: "#9CA3AF" },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #F0F0F0", backgroundColor: i % 2 === 0 ? "#FAFAFA" : "white" }}>
                    <td style={{ padding: "10px 16px", fontWeight: 500, color: "#333" }}>{row.el}</td>
                    <td style={{ padding: "10px 16px", textAlign: "center", color: "#FF6B00", fontWeight: 500 }}>{row.size}</td>
                    <td style={{ padding: "10px 16px", textAlign: "center", color: "#333" }}>{row.weight}</td>
                    <td style={{ padding: "10px 16px", textAlign: "center", color: row.height !== "—" ? "#FF6B00" : "#999" }}>{row.height}</td>
                    <td style={{ padding: "10px 16px", textAlign: "center" }}>
                      {row.colorHex ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <span style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: row.colorHex, border: "1px solid #E0E0E0", flexShrink: 0 }} />
                          <span style={{ fontSize: 13, color: "#555" }}>{row.color}</span>
                        </span>
                      ) : (
                        <span style={{ fontSize: 13, color: "#999" }}>{row.color}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Paper>
        </SectionBlock>

        {/* ═══════════════════════════════════════════ */}
        {/* ── 1. BUTTONS & FAB ── */}
        {/* ═══════════════════════════════════════════ */}
        <SectionBlock id="buttons" title="Buttons & FAB">
          <SubLabel>Contained Buttons</SubLabel>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 3 }}>
            <Button variant="contained">Primary</Button>
            <Button variant="contained" color="secondary">Secondary</Button>
            <Button variant="contained" color="success">Success</Button>
            <Button variant="contained" color="error">Error</Button>
            <Button variant="contained" color="warning">Warning</Button>
            <Button variant="contained" color="info">Info</Button>
            <Button variant="contained" disabled>Disabled</Button>
          </Stack>

          <SubLabel approved="V.1 23/03/2026">Outlined Buttons</SubLabel>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 3 }}>
            <Button variant="outlined">Primary</Button>
            <Button variant="outlined" color="secondary">Secondary</Button>
            <Button variant="outlined" color="success">Success</Button>
            <Button variant="outlined" color="error">Error</Button>
          </Stack>

          <SubLabel>Text Buttons</SubLabel>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 3 }}>
            <Button variant="text">Primary</Button>
            <Button variant="text" color="secondary">Secondary</Button>
            <Button variant="text" startIcon={<AddIcon />}>With Icon</Button>
          </Stack>

          <SubLabel>Sizes</SubLabel>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
            <Button variant="contained" size="small">Small</Button>
            <Button variant="contained" size="medium">Medium</Button>
            <Button variant="contained" size="large">Large</Button>
          </Stack>

          {/* Icon Buttons & FAB — ย้ายไป Icon Library แล้ว */}
        </SectionBlock>

        {/* ═══════════════════════════════════════════ */}
        {/* ── 2. TEXT INPUTS ── */}
        {/* ═══════════════════════════════════════════ */}
        <SectionBlock id="inputs" title="Text Inputs">
          {/* Input sx standard: H:56px, placeholder:18px, label:16px */}
          {(() => {
            const TF = { "& .MuiOutlinedInput-root": { height: 54, fontSize: 16, alignItems: "center" }, "& .MuiInputLabel-root": { fontSize: 14 }, "& .MuiOutlinedInput-input": { fontSize: 16, display: "flex", alignItems: "center", "&::placeholder": { fontSize: 16 } } };
            const TF_FILLED = { "& .MuiFilledInput-root": { fontSize: 16, alignItems: "center" }, "& .MuiInputLabel-root": { fontSize: 14 }, "& .MuiFilledInput-input": { fontSize: 16, display: "flex", alignItems: "center", "&::placeholder": { fontSize: 16 } } };
            const TF_STD = { "& .MuiInput-root": { fontSize: 16, alignItems: "center" }, "& .MuiInputLabel-root": { fontSize: 14 }, "& .MuiInput-input": { fontSize: 16, display: "flex", alignItems: "center", "&::placeholder": { fontSize: 16 } } };
            return (
              <>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, mb: 3 }}>
                  <Box>
                    <Chip label="CP-INPUT-OUTLINED" size="small" sx={{ mb: 1, fontFamily: "monospace", fontSize: 11, bgcolor: "#F5F5F7" }} />
                    <TextField label="Outlined (default)" sx={TF} fullWidth />
                  </Box>
                  <Box>
                    <Chip label="CP-INPUT-FILLED" size="small" sx={{ mb: 1, fontFamily: "monospace", fontSize: 11, bgcolor: "#F5F5F7" }} />
                    <TextField label="Filled" variant="filled" sx={TF_FILLED} fullWidth />
                  </Box>
                  <Box>
                    <Chip label="CP-INPUT-STANDARD" size="small" sx={{ mb: 1, fontFamily: "monospace", fontSize: 11, bgcolor: "#F5F5F7" }} />
                    <TextField label="Standard" variant="standard" sx={TF_STD} fullWidth />
                  </Box>
                  <Box>
                    <Chip label="CP-INPUT-PLACEHOLDER" size="small" sx={{ mb: 1, fontFamily: "monospace", fontSize: 11, bgcolor: "#F5F5F7" }} />
                    <TextField label="With Placeholder" placeholder="พิมพ์ที่นี่..." sx={TF} fullWidth InputLabelProps={{ shrink: true }} />
                  </Box>
                  <Box>
                    <Chip label="CP-INPUT-REQUIRED" size="small" sx={{ mb: 1, fontFamily: "monospace", fontSize: 11, bgcolor: "#F5F5F7" }} />
                    <TextField label="Required" required sx={TF} fullWidth />
                  </Box>
                  <Box>
                    <Chip label="CP-INPUT-DISABLED" size="small" sx={{ mb: 1, fontFamily: "monospace", fontSize: 11, bgcolor: "#F5F5F7" }} />
                    <TextField label="Disabled" disabled sx={TF} fullWidth defaultValue="ข้อมูลเดิม" />
                  </Box>
                  <Box>
                    <Chip label="CP-INPUT-ERROR" size="small" sx={{ mb: 1, fontFamily: "monospace", fontSize: 11, bgcolor: "#F5F5F7" }} />
                    <TextField label="Error State" error helperText="กรุณากรอกข้อมูล" sx={TF} fullWidth />
                  </Box>
                  <Box>
                    <Chip label="CP-INPUT-PASSWORD" size="small" sx={{ mb: 1, fontFamily: "monospace", fontSize: 11, bgcolor: "#F5F5F7" }} />
                    <TextField label="Password" type="password" sx={TF} fullWidth defaultValue="secret" />
                  </Box>
                  <Box>
                    <Chip label="CP-INPUT-NUMBER" size="small" sx={{ mb: 1, fontFamily: "monospace", fontSize: 11, bgcolor: "#F5F5F7" }} />
                    <TextField label="Number" type="number" sx={TF} fullWidth defaultValue={42} />
                  </Box>
                </Box>

                <SubLabel>Multiline / Textarea</SubLabel>
                <Chip label="CP-INPUT-MULTILINE" size="small" sx={{ mb: 1, fontFamily: "monospace", fontSize: 11, bgcolor: "#F5F5F7" }} />
                <TextField label="ข้อความยาว" multiline rows={3} fullWidth placeholder="พิมพ์ข้อความยาวที่นี่..." sx={{ "& .MuiOutlinedInput-root": { fontSize: 18 }, "& .MuiInputLabel-root": { fontSize: 16 } }} />

                <Typography variant="subtitle2" sx={{ mt: 3, mb: 1.5, color: "#666" }}>Select (Dropdown)</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
                  <Box>
                    <Chip label="CP-SELECT-DROPDOWN" size="small" sx={{ mb: 1, fontFamily: "monospace", fontSize: 11, bgcolor: "#F5F5F7" }} />
                    <TextField select label="เลือกแผนก" sx={TF} fullWidth defaultValue="sales" InputLabelProps={{ shrink: true }}>
                      <MenuItem value="sales">ฝ่ายขาย</MenuItem>
                      <MenuItem value="acc">ฝ่ายบัญชี</MenuItem>
                      <MenuItem value="hr">ฝ่ายบุคคล</MenuItem>
                    </TextField>
                  </Box>
                  <Box>
                    <Chip label="CP-SELECT-STATUS" size="small" sx={{ mb: 1, fontFamily: "monospace", fontSize: 11, bgcolor: "#F5F5F7" }} />
                    <TextField select label="สถานะ" sx={TF} fullWidth defaultValue="active" InputLabelProps={{ shrink: true }}>
                      <MenuItem value="active">ใช้งาน</MenuItem>
                      <MenuItem value="inactive">ไม่ใช้งาน</MenuItem>
                    </TextField>
                  </Box>
                </Box>
              </>
            );
          })()}
        </SectionBlock>

        {/* ═══════════════════════════════════════════ */}
        {/* ── 3. SELECTS & AUTOCOMPLETE ── */}
        {/* ═══════════════════════════════════════════ */}
        <SectionBlock id="selects" title="Selects & Autocomplete (Custom)">
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            FormAutocomplete - component จากระบบ Jigsaw (react-hook-form integrated)
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <FormAutocomplete
              name="demoCategory"
              control={control}
              label="หมวดหมู่สินค้า"
              options={[
                { id: "food", name: "อาหาร" },
                { id: "drink", name: "เครื่องดื่ม" },
                { id: "goods", name: "ของใช้" },
                { id: "elec", name: "อิเล็กทรอนิกส์" },
              ]}
            />
            <FormAutocomplete
              name="demoCategory"
              control={control}
              label="สถานะ (Fixed Options)"
              options={[
                { id: "active", name: "ใช้งาน" },
                { id: "inactive", name: "ไม่ใช้งาน" },
                { id: "pending", name: "รอดำเนินการ" },
              ]}
            />
          </Box>
        </SectionBlock>

        {/* ═══════════════════════════════════════════ */}
        {/* ── 4. SWITCHES & TOGGLES ── */}
        {/* ═══════════════════════════════════════════ */}
        <SectionBlock id="switches" title="Switches, Checkboxes, Radios & Toggles">
          <SubLabel>Switch</SubLabel>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <FormControlLabel control={<Switch checked={switchChecked} onChange={(e) => setSwitchChecked(e.target.checked)} />} label="ใช้งาน" />
            <FormControlLabel control={<Switch disabled />} label="Disabled" />
            <FormControlLabel control={<Switch color="success" defaultChecked />} label="Success" />
            <FormControlLabel control={<Switch color="warning" defaultChecked />} label="Warning" />
          </Stack>

          <SubLabel>Checkbox</SubLabel>
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <FormControlLabel control={<Checkbox defaultChecked />} label="เลือก A" />
            <FormControlLabel control={<Checkbox />} label="เลือก B" />
            <FormControlLabel control={<Checkbox disabled />} label="Disabled" />
            <FormControlLabel control={<Checkbox color="success" defaultChecked />} label="Success" />
          </Stack>

          <SubLabel>Radio Group</SubLabel>
          <RadioGroup row defaultValue="bank">
            <FormControlLabel value="bank" control={<Radio />} label="บัญชีธนาคาร" />
            <FormControlLabel value="cash" control={<Radio />} label="เงินสด" />
            <FormControlLabel value="promptpay" control={<Radio />} label="พร้อมเพย์" />
          </RadioGroup>

          <Divider sx={{ my: 2.5 }} />

          <SubLabel>Toggle Button Group</SubLabel>
          <Stack direction="row" spacing={2}>
            <ToggleButtonGroup value={toggleFormat} onChange={(_, v) => setToggleFormat(v)} size="small">
              <ToggleButton value="bold"><FormatBoldIcon /></ToggleButton>
              <ToggleButton value="italic"><FormatItalicIcon /></ToggleButton>
              <ToggleButton value="underline"><FormatUnderlinedIcon /></ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup exclusive value={toggleView} onChange={(_, v) => v && setToggleView(v)} size="small">
              <ToggleButton value="list"><ViewListIcon /></ToggleButton>
              <ToggleButton value="grid"><ViewModuleIcon /></ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <Divider sx={{ my: 2.5 }} />

          <SubLabel>Slider</SubLabel>
          <Box sx={{ width: 300 }}>
            <Slider value={sliderVal} onChange={(_, v) => setSliderVal(v as number)} valueLabelDisplay="auto" />
            <Typography variant="body2" color="text.secondary">Value: {sliderVal}</Typography>
          </Box>
        </SectionBlock>

        {/* ═══════════════════════════════════════════ */}
        {/* ── 5. FORMS (RHF) ── */}
        {/* ═══════════════════════════════════════════ */}
        <SectionBlock id="forms" title="Forms (React Hook Form + MUI)">
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            FormTextField + FormAutocomplete + FormSwitch ทั้งหมดใช้ react-hook-form Controller
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
            <FormTextField name="demoName" control={control} label="ชื่อ-นามสกุล" required />
            <FormTextField name="demoEmail" control={control} label="อีเมล" type="email" />
            <FormAutocomplete
              name="demoCategory"
              control={control}
              label="หมวดหมู่"
              options={[{ id: "a", name: "หมวด A" }, { id: "b", name: "หมวด B" }]}
            />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FormSwitch name="demoActive" control={control} label="สถานะใช้งาน" />
            </Box>
          </Box>
          <FormTextField name="demoNotes" control={control} label="หมายเหตุ" multiline rows={3} />
          <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleSubmit((data) => showSuccess(`บันทึก: ${JSON.stringify(data)}`))} startIcon={<SaveIcon />}>บันทึก</Button>
            <Button variant="outlined">ยกเลิก</Button>
          </Stack>
        </SectionBlock>

        {/* ═══════════════════════════════════════════ */}
        {/* ── 6. TABLES & DATAGRID ── */}
        {/* ═══════════════════════════════════════════ */}
        <SectionBlock id="tables" title="Tables & MUI X DataGrid">
          <SubLabel>MUI X DataGrid (Production-grade)</SubLabel>
          <DataGrid
            rows={gridRows}
            columns={gridColumns}
            pageSizeOptions={[5, 10]}
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
            getRowHeight={() => 52}
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": { bgcolor: "#F5F5F7", fontWeight: 600 },
              "& .MuiDataGrid-row:hover": { bgcolor: "rgba(86,93,255,0.04)" },
              "& .MuiCheckbox-root.Mui-checked": { color: OR },
              mb: 4,
            }}
          />

          <SubLabel>MUI Table (Simple)</SubLabel>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#F5F5F7" }}>
                  <TableCell sx={{ fontWeight: 600 }}>รหัส</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>ชื่อ</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>แผนก</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">เงินเดือน</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { code: "EMP001", name: "สมชาย ใจดี", dept: "ฝ่ายขาย", salary: "35,000" },
                  { code: "EMP002", name: "สมหญิง รักเรียน", dept: "ฝ่ายบัญชี", salary: "42,000" },
                  { code: "EMP003", name: "วิชัย สร้างสรรค์", dept: "ฝ่ายผลิต", salary: "28,000" },
                ].map((r) => (
                  <TableRow key={r.code} hover>
                    <TableCell sx={{ color: OR, fontWeight: 500 }}>{r.code}</TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.dept}</TableCell>
                    <TableCell align="right">{r.salary}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </SectionBlock>

        {/* ═══════════════════════════════════════════ */}
        {/* ── 7. DIALOGS & MODALS ── */}
        {/* ═══════════════════════════════════════════ */}
        <SectionBlock id="dialogs" title="Dialogs & Modals">
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => setDialogOpen(true)}>MUI Dialog</Button>
            <Button variant="outlined" onClick={() => setFormDialogOpen(true)}>FormDialog (Custom)</Button>
          </Stack>

          {/* Native MUI Dialog */}
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>ยืนยันการลบ</DialogTitle>
            <DialogContent>
              <Typography>คุณต้องการลบรายการ &quot;กาแฟคั่วเข้ม&quot; ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้</Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setDialogOpen(false)}>ยกเลิก</Button>
              <Button variant="contained" color="error" onClick={() => { setDialogOpen(false); showError("ลบรายการแล้ว"); }}>ลบ</Button>
            </DialogActions>
          </Dialog>

          {/* FormDialog (Custom Component) */}
          <FormDialog
            open={formDialogOpen}
            onClose={() => setFormDialogOpen(false)}
            title="เพิ่มหมวดหมู่ใหม่"
            footer={
              <>
                <Button onClick={() => setFormDialogOpen(false)}>ยกเลิก</Button>
                <Button variant="contained" onClick={() => { setFormDialogOpen(false); showSuccess("บันทึกสำเร็จ!"); }}>บันทึก</Button>
              </>
            }
          >
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="ชื่อหมวดหมู่" size="small" fullWidth />
              <TextField label="รหัส" size="small" fullWidth />
              <TextField label="รายละเอียด" size="small" fullWidth multiline rows={2} />
            </Stack>
          </FormDialog>
        </SectionBlock>

        {/* ═══════════════════════════════════════════ */}
        {/* ── 8. FEEDBACK & ALERTS ── */}
        {/* ═══════════════════════════════════════════ */}
        <SectionBlock id="feedback" title="Feedback, Alerts & Snackbar">
          <SubLabel>Alert</SubLabel>
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            <Alert severity="success"><AlertTitle>สำเร็จ</AlertTitle>บันทึกข้อมูลเรียบร้อยแล้ว</Alert>
            <Alert severity="error"><AlertTitle>ข้อผิดพลาด</AlertTitle>ไม่สามารถบันทึกข้อมูลได้</Alert>
            <Alert severity="warning"><AlertTitle>คำเตือน</AlertTitle>ข้อมูลบางรายการยังไม่สมบูรณ์</Alert>
            <Alert severity="info"><AlertTitle>ข้อมูล</AlertTitle>ระบบจะอัปเดตข้อมูลทุกๆ 5 นาที</Alert>
          </Stack>

          <SubLabel>Toast (Custom useToast)</SubLabel>
          <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
            <Button variant="contained" color="success" size="small" onClick={() => showSuccess("บันทึกเรียบร้อย!")}>showSuccess</Button>
            <Button variant="contained" color="error" size="small" onClick={() => showError("เกิดข้อผิดพลาด!")}>showError</Button>
            <Button variant="contained" color="warning" size="small" onClick={() => showWarning("คำเตือน!")}>showWarning</Button>
          </Stack>

          <SubLabel>Snackbar</SubLabel>
          <Button variant="outlined" size="small" onClick={() => setSnackOpen(true)}>แสดง Snackbar</Button>
          <Snackbar open={snackOpen} autoHideDuration={3000} onClose={() => setSnackOpen(false)} message="ดำเนินการเรียบร้อย!" />
        </SectionBlock>

        {/* ═══════════════════════════════════════════ */}
        {/* ── 9. CHIPS & BADGES ── */}
        {/* ═══════════════════════════════════════════ */}
        <SectionBlock id="chips" title="Chips & Badges">
          <SubLabel>Chips</SubLabel>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
            <Chip label="ใช้งาน" color="success" size="small" />
            <Chip label="ไม่ใช้งาน" color="default" size="small" />
            <Chip label="รอดำเนินการ" color="warning" size="small" />
            <Chip label="ปฏิเสธ" color="error" size="small" />
            <Chip label="กำลังดำเนินการ" color="info" size="small" />
            <Chip label="ลบได้" onDelete={() => {}} size="small" />
            <Chip avatar={<Avatar>S</Avatar>} label="สมชาย" size="small" />
            <Chip icon={<StarIcon />} label="Featured" color="primary" variant="outlined" size="small" />
          </Stack>

          <SubLabel>Badges</SubLabel>
          <Stack direction="row" spacing={3}>
            <Badge badgeContent={4} color="primary"><MailIcon /></Badge>
            <Badge badgeContent={12} color="error"><NotificationsIcon /></Badge>
            <Badge badgeContent={99} max={99} color="secondary"><ShoppingCartIcon /></Badge>
            <Badge variant="dot" color="success"><InventoryIcon /></Badge>
          </Stack>
        </SectionBlock>

        {/* ═══════════════════════════════════════════ */}
        {/* ── 10. CARDS & PAPER ── */}
        {/* ═══════════════════════════════════════════ */}
        <SectionBlock id="cards" title="Cards & Paper">
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
            <Card>
              <CardMedia sx={{ height: 120, bgcolor: `${OR}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <InventoryIcon sx={{ fontSize: 48, color: OR }} />
              </CardMedia>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem" }}>สินค้าทั่วไป</Typography>
                <Typography variant="body2" color="text.secondary">สินค้าที่ขายตามปกติ ไม่มีตัวเลือก</Typography>
              </CardContent>
              <CardActions>
                <Button size="small">ดูรายละเอียด</Button>
                <IconButton size="small"><FavoriteIcon fontSize="small" /></IconButton>
                <IconButton size="small"><ShareIcon fontSize="small" /></IconButton>
              </CardActions>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem" }}>ยอดขายวันนี้</Typography>
                  <Chip label="+12%" color="success" size="small" />
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 700, color: OR, mt: 1 }}>฿42,500</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>เพิ่มขึ้นจากเมื่อวาน ฿5,200</Typography>
              </CardContent>
            </Card>

            <Paper sx={{ p: 2.5, borderRadius: 2 }} elevation={3}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Paper (elevation=3)</Typography>
              <Typography variant="body2" color="text.secondary">ใช้สำหรับจัดกลุ่ม content ที่มี shadow</Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body2" color="text.secondary">Paper มี variant: elevation (default) และ outlined</Typography>
            </Paper>
          </Box>
        </SectionBlock>

        {/* ═══════════════════════════════════════════ */}
        {/* ── 11. LISTS ── */}
        {/* ═══════════════════════════════════════════ */}
        <SectionBlock id="lists" title="Lists">
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Paper variant="outlined">
              <List dense>
                {[
                  { icon: <DashboardIcon />, text: "Dashboard", badge: null },
                  { icon: <PersonIcon />, text: "พนักงาน", badge: 5 },
                  { icon: <InventoryIcon />, text: "สินค้า", badge: 12 },
                  { icon: <ShoppingCartIcon />, text: "การขาย", badge: null },
                  { icon: <SettingsIcon />, text: "ตั้งค่า", badge: null },
                ].map((item) => (
                  <ListItem key={item.text} secondaryAction={item.badge ? <Chip label={item.badge} size="small" color="primary" /> : null}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}
              </List>
            </Paper>

            <Paper variant="outlined">
              <List dense>
                {[
                  { name: "สมชาย ใจดี", role: "ผู้จัดการ", color: "#FF6B6B" },
                  { name: "สมหญิง รักเรียน", role: "หัวหน้างาน", color: "#10B981" },
                  { name: "วิชัย สร้างสรรค์", role: "พนักงาน", color: "#565DFF" },
                ].map((p) => (
                  <ListItem key={p.name}>
                    <ListItemIcon><Avatar sx={{ width: 32, height: 32, bgcolor: p.color, fontSize: "0.8rem" }}>{p.name.charAt(0)}</Avatar></ListItemIcon>
                    <ListItemText primary={p.name} secondary={p.role} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </SectionBlock>

        {/* ═══════════════════════════════════════════ */}
        {/* ── 12. NAVIGATION ── */}
        {/* ═══════════════════════════════════════════ */}
        <SectionBlock id="navigation" title="Navigation (Tabs, Breadcrumbs)">
          <SubLabel>Tabs</SubLabel>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 2 }}>
            <Tab label="ทั้งหมด" />
            <Tab label="ใช้งาน" />
            <Tab label="ไม่ใช้งาน" />
            <Tab label="รอดำเนินการ" />
          </Tabs>
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {["แสดงข้อมูลทั้งหมด", "แสดงเฉพาะที่ใช้งาน", "แสดงเฉพาะที่ไม่ใช้งาน", "แสดงเฉพาะที่รอดำเนินการ"][tabValue]}
            </Typography>
          </Paper>

          <SubLabel>Breadcrumbs</SubLabel>
          <Stack spacing={1}>
            <Breadcrumbs>
              <Link underline="hover" color="inherit" href="#"><HomeIcon sx={{ fontSize: "1rem", mr: 0.5, verticalAlign: "middle" }} />หน้าหลัก</Link>
              <Link underline="hover" color="inherit" href="#">บุคคล</Link>
              <Typography color="text.primary" sx={{ fontWeight: 600 }}>พนักงาน</Typography>
            </Breadcrumbs>
            <Breadcrumbs>
              <Link underline="hover" color="inherit" href="#">สินค้า</Link>
              <Link underline="hover" color="inherit" href="#">หมวดหมู่</Link>
              <Typography color="text.primary" sx={{ fontWeight: 600 }}>เพิ่มหมวดหมู่</Typography>
            </Breadcrumbs>
          </Stack>
        </SectionBlock>

        {/* ═══════════════════════════════════════════ */}
        {/* ── 13. PROGRESS & SKELETON ── */}
        {/* ═══════════════════════════════════════════ */}
        <SectionBlock id="progress" title="Progress & Skeleton Loading">
          <SubLabel>Linear Progress</SubLabel>
          <Stack spacing={2} sx={{ mb: 3, width: 400 }}>
            <LinearProgress />
            <LinearProgress variant="determinate" value={65} />
            <LinearProgress color="secondary" variant="determinate" value={40} />
            <LinearProgress color="success" variant="buffer" value={80} valueBuffer={90} />
          </Stack>

          <SubLabel>Circular Progress</SubLabel>
          <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
            <CircularProgress />
            <CircularProgress color="secondary" />
            <CircularProgress variant="determinate" value={75} />
            <CircularProgress size={24} />
          </Stack>

          <SubLabel>Skeleton Loading</SubLabel>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
            <Paper sx={{ p: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" sx={{ mt: 1 }} />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="rectangular" height={80} sx={{ mt: 1, borderRadius: 1 }} />
            </Paper>
            <Paper sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="text" width={120} />
              </Stack>
              <Skeleton variant="text" sx={{ mt: 1 }} />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="40%" />
            </Paper>
            <Paper sx={{ p: 2 }}>
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
              <Skeleton variant="text" sx={{ mt: 1 }} />
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Skeleton variant="rounded" width={60} height={24} />
                <Skeleton variant="rounded" width={60} height={24} />
              </Stack>
            </Paper>
          </Box>
        </SectionBlock>

        {/* ═══════════════════════════════════════════ */}
        {/* ── 14. LAYOUT & ACCORDION ── */}
        {/* ═══════════════════════════════════════════ */}
        <SectionBlock id="layout" title="Layout (Accordion, Divider, Tooltip)">
          <SubLabel>Accordion (Collapsible Sections)</SubLabel>
          {[
            { title: "ข้อมูลทั่วไป", content: "รหัสพนักงาน, ชื่อ-นามสกุล, คำนำหน้า, เพศ, วันเกิด" },
            { title: "ข้อมูลการติดต่อ", content: "ที่อยู่, เบอร์โทร, อีเมล, Line ID" },
            { title: "ข้อมูลการทำงาน", content: "แผนก, ตำแหน่ง, วันเริ่มงาน, ประเภทพนักงาน" },
          ].map((a, i) => (
            <Accordion key={i} defaultExpanded={i === 0} sx={{ "&:before": { display: "none" } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>{a.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">{a.content}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}

          <Divider sx={{ my: 3 }} />

          <SubLabel>Tooltips</SubLabel>
          <Stack direction="row" spacing={2}>
            <Tooltip title="แก้ไขรายการ" arrow><IconButton color="primary"><EditIcon /></IconButton></Tooltip>
            <Tooltip title="ลบรายการ" arrow><IconButton color="error"><DeleteIcon /></IconButton></Tooltip>
            <Tooltip title="ค้นหา" arrow placement="bottom"><IconButton><SearchIcon /></IconButton></Tooltip>
            <Tooltip title="พิมพ์" arrow placement="right"><IconButton><PrintIcon /></IconButton></Tooltip>
          </Stack>
        </SectionBlock>

        {/* ═══════════════════════════════════════════ */}
        {/* ── 15. AVATARS & TYPOGRAPHY ── */}
        {/* ═══════════════════════════════════════════ */}
        <SectionBlock id="avatars" title="Avatars & Typography">
          <SubLabel>Avatars</SubLabel>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: "#FF6B6B" }}>PA</Avatar>
            <Avatar sx={{ bgcolor: "#565DFF" }}>JI</Avatar>
            <Avatar sx={{ bgcolor: "#10B981" }}>AL</Avatar>
            <Avatar sx={{ bgcolor: "#FF9F43" }}>BP</Avatar>
            <Avatar sx={{ bgcolor: "#8B5CF6" }}>SA</Avatar>
          </Stack>

          <SubLabel>Avatar Group</SubLabel>
          <AvatarGroup max={4} sx={{ mb: 3, justifyContent: "flex-end" }}>
            <Avatar sx={{ bgcolor: "#FF6B6B" }}>S</Avatar>
            <Avatar sx={{ bgcolor: "#565DFF" }}>W</Avatar>
            <Avatar sx={{ bgcolor: "#10B981" }}>N</Avatar>
            <Avatar sx={{ bgcolor: "#FF9F43" }}>P</Avatar>
            <Avatar sx={{ bgcolor: "#8B5CF6" }}>J</Avatar>
          </AvatarGroup>

          <Divider sx={{ my: 2 }} />

          <SubLabel>Typography Scale</SubLabel>
          <Typography variant="h3" gutterBottom>h3 - Heading</Typography>
          <Typography variant="h4" gutterBottom>h4 - Heading</Typography>
          <Typography variant="h5" gutterBottom>h5 - Heading</Typography>
          <Typography variant="h6" gutterBottom>h6 - Heading</Typography>
          <Typography variant="subtitle1" gutterBottom>subtitle1 - Subtitle</Typography>
          <Typography variant="subtitle2" gutterBottom>subtitle2 - Subtitle</Typography>
          <Typography variant="body1" gutterBottom>body1 - เนื้อหาหลัก ข้อความปกติ</Typography>
          <Typography variant="body2" gutterBottom>body2 - เนื้อหารอง ข้อความขนาดเล็ก</Typography>
          <Typography variant="caption" display="block" gutterBottom>caption - ข้อความกำกับ</Typography>
          <Typography variant="overline" display="block">overline - OVERLINE TEXT</Typography>
        </SectionBlock>

        {/* ═══════════════════════════════════════════ */}
        {/* ── 16. TIMELINE & STEPPER ── */}
        {/* ═══════════════════════════════════════════ */}
        <SectionBlock id="timeline" title="Timeline & Stepper">
          <SubLabel>Stepper</SubLabel>
          <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
            <Step><StepLabel>ข้อมูลทั่วไป</StepLabel></Step>
            <Step><StepLabel>ข้อมูลการติดต่อ</StepLabel></Step>
            <Step><StepLabel>ข้อมูลการทำงาน</StepLabel></Step>
            <Step><StepLabel>ยืนยัน</StepLabel></Step>
          </Stepper>
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
            <Button size="small" disabled={activeStep === 0} onClick={() => setActiveStep((s) => s - 1)}>ก่อนหน้า</Button>
            <Button size="small" variant="contained" disabled={activeStep === 3} onClick={() => setActiveStep((s) => s + 1)}>ถัดไป</Button>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <SubLabel>Timeline</SubLabel>
          <Timeline position="alternate">
            <TimelineItem>
              <TimelineSeparator><TimelineDot color="primary" /><TimelineConnector /></TimelineSeparator>
              <TimelineContent><Typography variant="body2" sx={{ fontWeight: 600 }}>สร้างใบสั่งซื้อ</Typography><Typography variant="caption" color="text.secondary">09:30 - สมชาย</Typography></TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator><TimelineDot color="warning" /><TimelineConnector /></TimelineSeparator>
              <TimelineContent><Typography variant="body2" sx={{ fontWeight: 600 }}>อนุมัติใบสั่งซื้อ</Typography><Typography variant="caption" color="text.secondary">11:45 - ผู้จัดการ</Typography></TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator><TimelineDot color="success" /><TimelineConnector /></TimelineSeparator>
              <TimelineContent><Typography variant="body2" sx={{ fontWeight: 600 }}>รับสินค้า</Typography><Typography variant="caption" color="text.secondary">14:00 - คลังสินค้า</Typography></TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator><TimelineDot color="info" /></TimelineSeparator>
              <TimelineContent><Typography variant="body2" sx={{ fontWeight: 600 }}>บันทึกเข้าระบบ</Typography><Typography variant="caption" color="text.secondary">14:30 - ระบบอัตโนมัติ</Typography></TimelineContent>
            </TimelineItem>
          </Timeline>
        </SectionBlock>

        {/* ═══════════════════════════════════════════ */}
        {/* ── 17. SPEED DIAL & RATING ── */}
        {/* ═══════════════════════════════════════════ */}
        <SectionBlock id="speeddial" title="SpeedDial & Rating">
          <SubLabel>Rating</SubLabel>
          <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">ความพึงพอใจ</Typography>
              <Rating value={ratingVal} onChange={(_, v) => setRatingVal(v)} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Read-only</Typography>
              <Rating value={4} readOnly />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Heart Icon</Typography>
              <Rating value={3} icon={<FavoriteIcon sx={{ color: "#FF6B6B" }} />} emptyIcon={<FavoriteIcon />} />
            </Box>
          </Stack>

          <SubLabel>SpeedDial</SubLabel>
          <Box sx={{ position: "relative", height: 140 }}>
            <SpeedDial
              ariaLabel="SpeedDial demo"
              sx={{ position: "absolute", bottom: 16, left: 16 }}
              icon={<AddIcon />}
              direction="right"
            >
              <SpeedDialAction icon={<FileCopyIcon />} tooltipTitle="คัดลอก" />
              <SpeedDialAction icon={<SaveIcon />} tooltipTitle="บันทึก" />
              <SpeedDialAction icon={<PrintIcon />} tooltipTitle="พิมพ์" />
              <SpeedDialAction icon={<ShareIcon />} tooltipTitle="แชร์" />
            </SpeedDial>
          </Box>
        </SectionBlock>

        {/* Footer */}
        <Divider sx={{ my: 4 }} />
        <Box sx={{ textAlign: "center", pb: 4 }}>
          <Typography variant="body2" color="text.secondary">
            JIGSAW ERP - Component Library | MUI v5 + MUI X DataGrid + React Hook Form
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total: {ALL_SECTIONS.length} categories | Built with Material-UI
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
