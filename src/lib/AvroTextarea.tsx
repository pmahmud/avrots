import React, { useState, useRef, useEffect } from "react";
import type { KeyboardEvent, ChangeEvent } from "react";
import AvroPhonetic from "./avro";

interface AvroTextareaProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  className?: string;
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  onModeChange?: (banglaMode: boolean) => void;
}

const niceBg = "#181c2f";
const niceFg = "#f7fafc";
const accent = "#2ec4b6";
const indicatorBg = "#222a3a";
const indicatorFg = "#fff";

export const AvroTextarea: React.FC<AvroTextareaProps> = ({
  value = "",
  onChange,
  placeholder = "Type Bangla phonetically...",
  style = {},
  className = "",
  textareaProps = {},
  onModeChange,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [banglaMode, setBanglaMode] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Notify parent on mode change
  useEffect(() => {
    if (onModeChange) onModeChange(banglaMode);
  }, [banglaMode, onModeChange]);

  // Keyboard shortcut: Ctrl+M toggles Bangla mode
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && !e.altKey && !e.shiftKey && e.key.toLowerCase() === "m") {
      setBanglaMode((prev) => !prev);
      e.preventDefault();
      return;
    }
    if (!banglaMode) return;
    if ([" ", "Enter", "Tab"].includes(e.key)) {
      const el = textareaRef.current;
      if (!el) return;
      const cur = el.selectionStart || 0;
      let last = cur - 1;
      // Match jQuery: break on whitespace (not just space)
      while (
        last > 0 &&
        el.value.charAt(last) &&
        el.value.charAt(last).trim() !== ""
      )
        last--;
      if (el.value.charAt(last) && el.value.charAt(last).trim() === "") last++;
      const before = el.value.substring(0, last);
      const word = el.value.substring(last, cur);
      const after = el.value.substring(cur);
      const bangla = AvroPhonetic.parse(word);
      const newValue = before + bangla + after;
      setInputValue(newValue);
      if (onChange) onChange(newValue);
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = before.length + bangla.length;
      }, 0);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <div
      style={{ position: "relative", width: "100%", ...style }}
      className={className}
    >
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{
          width: "100%",
          minHeight: 120,
          padding: "0.75rem 1rem",
          borderRadius: 8,
          border: "none",
          background: niceBg,
          color: niceFg,
          fontSize: "1.1rem",
          outline: "none",
          boxShadow: "0 2px 8px rgba(30,40,60,0.08)",
          transition: "box-shadow 0.2s",
          resize: "vertical",
        }}
        {...textareaProps}
      />
      <div
        style={{
          position: "absolute",
          right: 10,
          top: 10,
          background: indicatorBg,
          color: indicatorFg,
          borderRadius: 6,
          padding: "0.2rem 0.7rem",
          fontSize: "0.95em",
          fontWeight: 500,
          letterSpacing: 1,
          boxShadow: banglaMode ? `0 0 0 2px ${accent}` : undefined,
          opacity: 0.92,
          userSelect: "none",
        }}
        title="Press Ctrl+M to toggle Bangla mode"
      >
        {banglaMode ? "Bangla" : "English"}
      </div>
    </div>
  );
};

export default AvroTextarea;
