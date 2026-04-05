"use client";

import React, { useState, useCallback } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";

/* ── Types ── */
interface ExistingUsedInfo {
  itemName: string;
  usedIn: string[];
}

interface ExistingUsedDialogProps {
  open: boolean;
  onClose: () => void;
  info: ExistingUsedInfo | null;
}

/* ── Dialog Component ── */
export function ExistingUsedDialog({ open, onClose, info }: ExistingUsedDialogProps) {
  if (!info) return null;

  return (
    <Modal open={open} onClose={onClose} title="ไม่สามารถลบได้"
      width="480px"
      footer={<Button variant="ghost" onClick={onClose}>ปิด</Button>}>
      <Box>
        <Typography variant="body2" sx={{ mb: 1.5, color: "text.primary" }}>
          <strong>&quot;{info.itemName}&quot;</strong> ไม่สามารถลบได้เนื่องจากถูกใช้งานอยู่ใน:
        </Typography>
        <List dense disablePadding sx={{ pl: 2 }}>
          {info.usedIn.map((item, i) => (
            <ListItem key={i} disableGutters sx={{ py: 0.25 }}>
              <ListItemText
                primary={`• ${item}`}
                primaryTypographyProps={{ variant: "body2", color: "text.secondary" }}
              />
            </ListItem>
          ))}
        </List>
        <Typography variant="caption" sx={{ display: "block", mt: 2, color: "text.secondary" }}>
          กรุณาลบหรือแก้ไขรายการที่เกี่ยวข้องก่อน แล้วลองอีกครั้ง
        </Typography>
      </Box>
    </Modal>
  );
}

/* ── Hook ── */
export function useExistingUsedHandler() {
  const [existingUsedDialog, setDialog] = useState<{ open: boolean; info: ExistingUsedInfo | null }>({
    open: false,
    info: null,
  });

  const handleExistingUsedError = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (response: any, itemName = "รายการนี้") => {
      const usedIn: string[] = response?.usedIn || response?.data?.usedIn || ["ข้อมูลที่เกี่ยวข้อง"];
      setDialog({ open: true, info: { itemName, usedIn } });
    },
    []
  );

  const closeExistingUsedDialog = useCallback(() => {
    setDialog({ open: false, info: null });
  }, []);

  return { existingUsedDialog, handleExistingUsedError, closeExistingUsedDialog };
}
