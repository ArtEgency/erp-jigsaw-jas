"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import { CONDITIONS } from "@/components/dev/conditions";
import type { PageCondition, ValidationRule, DataField } from "@/components/dev/conditions";

const PURPLE = "#7C3AED";

/**
 * DevInspector — ปุ่ม [Spec] ลอยมุมล่างขวา
 * กดแล้วเปิด Panel slide จากขวา 80% แสดง Req/Validation/Flow/DataModel
 *
 * ⚠️ PRD: ลบ component นี้ + folder dev ก่อนขึ้น Production
 */
export function DevInspector() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Match condition
  const condition: PageCondition | undefined =
    CONDITIONS[pathname] ||
    Object.values(CONDITIONS).find((c) => pathname.includes(c.path));

  return (
    <>
      {/* ── FAB Button ── */}
      <Tooltip title={`Spec: ${pathname}`} placement="left" arrow>
        <Box
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            bgcolor: PURPLE,
            color: "white",
            width: 56,
            height: 56,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 0.5,
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: "#6D28D9",
              transform: "scale(1.1)",
              boxShadow: "0 6px 24px rgba(124,58,237,0.5)",
            },
          }}
        >
          Spec
        </Box>
      </Tooltip>

      {/* ── Backdrop ── */}
      {open && (
        <Box
          onClick={() => setOpen(false)}
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.4)",
            zIndex: 10000,
            transition: "opacity 0.3s",
          }}
        />
      )}

      {/* ── Slide Panel from Right (80%) ── */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "90%",
          maxWidth: 1400,
          height: "100vh",
          bgcolor: "#F8F7FF",
          zIndex: 10001,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          boxShadow: open ? "-8px 0 30px rgba(0,0,0,0.15)" : "none",
        }}
      >
        {/* ── Panel Header ── */}
        <Box sx={{ bgcolor: PURPLE, px: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <Box>
            <Typography sx={{ color: "white", fontSize: 11, fontWeight: 400, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1 }}>
              Dev Spec Inspector
            </Typography>
            <Typography sx={{ color: "white", fontSize: 20, fontWeight: 700, mt: 0.3 }}>
              {condition ? condition.page : "ยังไม่มี Spec"}
            </Typography>
            <Typography sx={{ color: "white", fontSize: 13, opacity: 0.7, mt: 0.3 }}>
              Path: {pathname}
              {condition?.description && ` — ${condition.description}`}
            </Typography>
          </Box>
          <IconButton onClick={() => setOpen(false)} sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.15)" } }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* ── Panel Body (Scrollable) ── */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
          {!condition ? (
            /* No condition */
            <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
              <Typography sx={{ fontSize: 48, mb: 2 }}>📋</Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 600, color: "#374151", mb: 1 }}>
                ยังไม่มี Spec สำหรับหน้านี้
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#6B7280", mb: 3 }}>
                Path: <code style={{ color: PURPLE }}>{pathname}</code>
              </Typography>
              <Paper sx={{ bgcolor: "#F3F4F6", p: 2, borderRadius: 2, textAlign: "left" }}>
                <Typography sx={{ fontSize: 12, fontFamily: "monospace", color: "#374151", whiteSpace: "pre-wrap" }}>
{`// สร้างไฟล์ conditions ใหม่:
// src/components/dev/conditions/xxx.ts

import { PageCondition } from "./types";

export const xxxCondition: PageCondition = {
  page: "ชื่อหน้า",
  path: "${pathname}",
  requirements: ["..."],
  validations: [],
  flow: ["..."],
  dataModel: [],
};

// แล้วเพิ่มใน conditions/index.ts`}
                </Typography>
              </Paper>
            </Paper>
          ) : (
            <>
              {/* 📋 Requirements */}
              <SectionCard icon="📋" title="Requirements" color="#059669">
                <Box component="ol" sx={{ pl: 2.5, m: 0, display: "flex", flexDirection: "column", gap: 0.8 }}>
                  {condition.requirements.map((req, i) => (
                    <Box component="li" key={i} sx={{ fontSize: 14, color: "#374151", lineHeight: 1.7 }}>
                      {req}
                    </Box>
                  ))}
                </Box>
              </SectionCard>

              {/* ✅ Validations */}
              <SectionCard icon="✅" title="Validations" color="#D97706">
                {condition.validations.length === 0 ? (
                  <Typography sx={{ fontSize: 14, color: "#9CA3AF" }}>ยังไม่มี validation</Typography>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {condition.validations.map((v: ValidationRule, i: number) => (
                      <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.5 }}>
                        <Chip label={v.field} size="small" sx={{ bgcolor: "#FEF3C7", color: "#92400E", fontWeight: 600, fontSize: 12, fontFamily: "monospace" }} />
                        <Typography sx={{ fontSize: 13, color: "#374151" }}>{v.rule}</Typography>
                        {v.when && (
                          <Chip label={v.when} size="small" variant="outlined" sx={{ fontSize: 11, color: "#6B7280", borderColor: "#D1D5DB" }} />
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </SectionCard>

              {/* 🔄 Flow */}
              <SectionCard icon="🔄" title="Flow (ลำดับการทำงาน)" color="#2563EB">
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  {condition.flow.map((step, i) => (
                    <Box key={i} sx={{ display: "flex", gap: 1.5, py: 0.5 }}>
                      <Box sx={{
                        minWidth: 26, height: 26, borderRadius: "50%",
                        bgcolor: i === 0 ? "#2563EB" : "#EFF6FF",
                        color: i === 0 ? "white" : "#2563EB",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700,
                      }}>
                        {i + 1}
                      </Box>
                      <Typography sx={{ fontSize: 14, color: "#374151", lineHeight: 1.7, pt: 0.2 }}>
                        {step.replace(/^\d+\.\s*/, "")}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </SectionCard>

              {/* 📊 Data Model */}
              <SectionCard icon="📊" title="Data Model" color="#7C3AED">
                {condition.dataModel.length === 0 ? (
                  <Typography sx={{ fontSize: 14, color: "#9CA3AF" }}>ยังไม่มี data model</Typography>
                ) : (
                  <Box sx={{ overflow: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #E5E7EB" }}>
                          <th style={{ textAlign: "left", color: "#6B7280", fontWeight: 600, padding: "8px 12px" }}>Field</th>
                          <th style={{ textAlign: "left", color: "#6B7280", fontWeight: 600, padding: "8px 12px" }}>Type</th>
                          <th style={{ textAlign: "left", color: "#6B7280", fontWeight: 600, padding: "8px 12px" }}>Flags</th>
                          <th style={{ textAlign: "left", color: "#6B7280", fontWeight: 600, padding: "8px 12px" }}>Example / Default</th>
                        </tr>
                      </thead>
                      <tbody>
                        {condition.dataModel.map((d: DataField, i: number) => (
                          <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                            <td style={{ padding: "8px 12px", fontFamily: "monospace", color: PURPLE, fontWeight: 600 }}>{d.field}</td>
                            <td style={{ padding: "8px 12px", color: "#374151" }}>{d.type}</td>
                            <td style={{ padding: "8px 12px" }}>
                              {d.required && <Chip label="required" size="small" sx={{ fontSize: 10, height: 20, mr: 0.5, bgcolor: "#FEE2E2", color: "#991B1B" }} />}
                              {d.unique && <Chip label="unique" size="small" sx={{ fontSize: 10, height: 20, bgcolor: "#DBEAFE", color: "#1E40AF" }} />}
                            </td>
                            <td style={{ padding: "8px 12px", color: "#6B7280", fontSize: 12 }}>
                              {d.example || (d.default !== undefined ? `default: ${d.default}` : "—")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                )}
              </SectionCard>

              {/* Footer */}
              <Typography sx={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", mt: 1, mb: 2 }}>
                ⚠️ DevInspector — ลบก่อนขึ้น Production (ลบ folder components/dev + app/(dev))
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </>
  );
}

function SectionCard({ icon, title, color, children }: { icon: string; title: string; color: string; children: React.ReactNode }) {
  return (
    <Paper sx={{ borderRadius: 2.5, overflow: "hidden", border: "1px solid #E5E7EB" }}>
      <Box sx={{ px: 2.5, py: 1.2, bgcolor: color, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography sx={{ fontSize: 16 }}>{icon}</Typography>
        <Typography sx={{ color: "white", fontSize: 14, fontWeight: 700 }}>{title}</Typography>
      </Box>
      <Box sx={{ p: 2.5 }}>{children}</Box>
    </Paper>
  );
}
