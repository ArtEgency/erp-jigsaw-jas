"use client";

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  disabled?: boolean;
  textarea?: boolean;
  required?: boolean;
  maxLength?: number;
  variant?: "tenant" | "sa";
}

export default function FloatingField({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  textarea = false,
  required = false,
  maxLength,
  variant = "tenant",
}: Props) {
  const cls = [
    "field-group",
    variant === "sa" ? "sa" : "",
    required && !value ? "required" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls}>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={3}
          maxLength={maxLength}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          maxLength={maxLength}
        />
      )}
      <label>
        {label}
        {required && <span className="text-erp-error ml-0.5">*</span>}
      </label>
      {maxLength && (
        <span className="field-char-count">
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}
