"use client";

import React from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";

/* ── Action Type ── */
export interface ActionItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  color?: "primary" | "error" | "default" | "secondary" | "info" | "success" | "warning";
  onClick: () => void;
  disabled?: boolean;
  hidden?: boolean;
}

/* ── Helper: createActions ── */
export const createActions = {
  edit: (onClick: () => void, label = "แก้ไข"): ActionItem => ({
    key: "edit",
    label,
    icon: <EditIcon fontSize="small" />,
    color: "primary",
    onClick,
  }),

  delete: (onClick: () => void, label = "ลบ"): ActionItem => ({
    key: "delete",
    label,
    icon: <DeleteIcon fontSize="small" />,
    color: "error",
    onClick,
  }),

  view: (onClick: () => void, label = "ดูรายละเอียด"): ActionItem => ({
    key: "view",
    label,
    icon: <VisibilityIcon fontSize="small" />,
    color: "default",
    onClick,
  }),

  more: (onClick: () => void, label = "เพิ่มเติม"): ActionItem => ({
    key: "more",
    label,
    icon: <MoreVertIcon fontSize="small" />,
    color: "default",
    onClick,
  }),

  custom: (
    key: string,
    label: string,
    icon: React.ReactNode,
    onClick: () => void,
    color: ActionItem["color"] = "default"
  ): ActionItem => ({
    key,
    label,
    icon,
    color,
    onClick,
  }),
};

/* ── ActionButtons Component ── */
interface ActionButtonsProps {
  actions: ActionItem[];
  size?: "small" | "medium";
  gap?: number;
}

export default function ActionButtons({ actions, size = "small", gap = 0.5 }: ActionButtonsProps) {
  const visibleActions = actions.filter((a) => !a.hidden);

  return (
    <Stack direction="row" spacing={gap} alignItems="center">
      {visibleActions.map((action) => (
        <Tooltip key={action.key} title={action.label} arrow>
          <span>
            <IconButton
              size={size}
              color={action.color}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              disabled={action.disabled}
              sx={{
                "&:hover": {
                  backgroundColor: action.color === "error"
                    ? "rgba(229,57,53,0.08)"
                    : action.color === "primary"
                    ? "rgba(86,93,255,0.08)"
                    : "rgba(0,0,0,0.04)",
                },
              }}
            >
              {action.icon}
            </IconButton>
          </span>
        </Tooltip>
      ))}
    </Stack>
  );
}
