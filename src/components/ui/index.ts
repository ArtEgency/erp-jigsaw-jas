/* ── Common Components Barrel Export ── */

// UI (legacy — Tailwind-based, use for non-MUI pages)
export { default as Button } from "./Button";
export { default as Badge } from "./Badge";
export { default as Modal } from "./Modal";

// UI (MUI-based — preferred)
export { default as FormDialog } from "./FormDialog";
export { default as ActionButtons } from "./ActionButtons";
export { createActions } from "./ActionButtons";
export type { ActionItem } from "./ActionButtons";

// Data Display (legacy — Tailwind-based)
export { default as DataTable } from "./DataTable";
export type { Column } from "./DataTable";
export { default as Pagination } from "./Pagination";

// Form (MUI + react-hook-form — preferred)
export { default as FormTextField } from "./FormTextField";
export { default as FormAutocomplete } from "./FormAutocomplete";
export { default as FormAutocompleteAdjust } from "./FormAutocompleteAdjust";
export { default as FormSwitch } from "./FormSwitch";
export { default as MultiLanguageInput } from "./MultiLanguageInput";

// Legacy Form (Tailwind-based — kept for backward compat)
export { default as FormField } from "./FormField";

// Feedback
export { ToastProvider, useToast } from "./Toast";

// Dialogs & Handlers
export { ExistingUsedDialog, useExistingUsedHandler } from "./ExistingUsedDialog";
