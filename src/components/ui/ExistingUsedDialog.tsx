"use client";

import React, { useState, useCallback } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { TEXT, MUTED } from "@/lib/theme";

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
      <div className="text-sm" style={{ color: TEXT }}>
        <p className="mb-3">
          <strong>&quot;{info.itemName}&quot;</strong> ไม่สามารถลบได้เนื่องจากถูกใช้งานอยู่ใน:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          {info.usedIn.map((item, i) => (
            <li key={i} style={{ color: MUTED }}>{item}</li>
          ))}
        </ul>
        <p className="mt-4 text-xs" style={{ color: MUTED }}>
          กรุณาลบหรือแก้ไขรายการที่เกี่ยวข้องก่อน แล้วลองอีกครั้ง
        </p>
      </div>
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
