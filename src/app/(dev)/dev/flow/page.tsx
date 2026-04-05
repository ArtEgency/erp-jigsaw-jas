"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import { CONDITIONS } from "@/components/dev/conditions";
import type { PageCondition, ValidationRule, DataField } from "@/components/dev/conditions";

const PURPLE = "#7C3AED";

function FlowContent() {
  const searchParams = useSearchParams();
  const pagePath = searchParams.get("page") || "/";

  // Match condition — ลอง exact match ก่อน ถ้าไม่ได้ลอง partial
  const condition: PageCondition | undefined =
    CONDITIONS[pagePath] ||
    Object.values(CONDITIONS).find((c) => pagePath.includes(c.path));

  if (!condition) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#F8F7FF", p: 4 }}>
        <Paper sx={{ maxWidth: 700, mx: "auto", p: 4, textAlign: "center", borderRadius: 3 }}>
          <Typography sx={{ fontSize: 48, mb: 2 }}>📋</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#374151", mb: 1 }}>
            ยังไม่มี Condition สำหรับหน้านี้
          </Typography>
          <Typography sx={{ fontSize: 15, color: "#6B7280", mb: 3 }}>
            Path: <code style={{ color: PURPLE }}>{pagePath}</code>
          </Typography>
          <Paper sx={{ bgcolor: "#F3F4F6", p: 2, borderRadius: 2, textAlign: "left" }}>
            <Typography sx={{ fontSize: 13, fontFamily: "monospace", color: "#374151", whiteSpace: "pre-wrap" }}>
{`// สร้างไฟล์ conditions ใหม่:
// src/components/dev/conditions/xxx.ts

import { PageCondition } from "./types";

export const xxxCondition: PageCondition = {
  page: "ชื่อหน้า",
  path: "${pagePath}",
  requirements: ["..."],
  validations: [],
  flow: ["..."],
  dataModel: [],
};

// แล้วเพิ่มใน conditions/index.ts`}
            </Typography>
          </Paper>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F8F7FF" }}>
      {/* Header */}
      <Box sx={{ bgcolor: PURPLE, px: 4, py: 3 }}>
        <Typography sx={{ color: "white", fontSize: 13, fontWeight: 400, opacity: 0.8, mb: 0.5 }}>
          DEV SPEC INSPECTOR
        </Typography>
        <Typography sx={{ color: "white", fontSize: 24, fontWeight: 700 }}>
          {condition.page}
        </Typography>
        <Typography sx={{ color: "white", fontSize: 14, opacity: 0.8, mt: 0.5 }}>
          Path: {condition.path}
          {condition.description && ` — ${condition.description}`}
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 900, mx: "auto", p: 4, display: "flex", flexDirection: "column", gap: 3 }}>

        {/* 📋 Requirements */}
        <SectionCard icon="📋" title="Requirements" color="#059669">
          <Box component="ol" sx={{ pl: 2.5, m: 0, display: "flex", flexDirection: "column", gap: 1 }}>
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
                  minWidth: 28, height: 28, borderRadius: "50%",
                  bgcolor: i === 0 ? "#2563EB" : "#EFF6FF",
                  color: i === 0 ? "white" : "#2563EB",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700,
                }}>
                  {i + 1}
                </Box>
                <Typography sx={{ fontSize: 14, color: "#374151", lineHeight: 1.7, pt: 0.3 }}>
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
        <Typography sx={{ textAlign: "center", fontSize: 12, color: "#9CA3AF", mt: 2, mb: 4 }}>
          ⚠️ DevInspector — ลบก่อนขึ้น Production (ลบ folder components/dev + app/(dev))
        </Typography>
      </Box>
    </Box>
  );
}

function SectionCard({ icon, title, color, children }: { icon: string; title: string; color: string; children: React.ReactNode }) {
  return (
    <Paper sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid #E5E7EB" }}>
      <Box sx={{ px: 3, py: 1.5, bgcolor: color, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography sx={{ fontSize: 18 }}>{icon}</Typography>
        <Typography sx={{ color: "white", fontSize: 15, fontWeight: 700 }}>{title}</Typography>
      </Box>
      <Box sx={{ p: 3 }}>{children}</Box>
    </Paper>
  );
}

export default function FlowPage() {
  return (
    <Suspense fallback={<Box sx={{ p: 4 }}>Loading...</Box>}>
      <FlowContent />
    </Suspense>
  );
}
