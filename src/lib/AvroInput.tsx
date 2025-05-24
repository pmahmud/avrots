import React, { useState, useRef, useEffect } from "react";
import type { KeyboardEvent, ChangeEvent } from "react";
import AvroPhonetic from "./avro";

interface AvroInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const niceBg = "#181c2f";
const niceFg = "#f7fafc";
const accent = "#2ec4b6";
const indicatorBg = "#222a3a";
const indicatorFg = "#fff";

export const AvroInput: React.FC<AvroInputProps> = ({
  value = "",
  onChange,
  placeholder = "Type Bangla phonetically...",
  style = {},
  className = "",
  inputProps = {},
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [banglaMode, setBanglaMode] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Keyboard shortcut: Ctrl+M toggles Bangla mode
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && !e.altKey && !e.shiftKey && e.key.toLowerCase() === "m") {
      setBanglaMode((prev) => !prev);
      e.preventDefault();
      return;
    }
    if (!banglaMode) return;
    if ([" ", "Enter", "Tab"].includes(e.key)) {
      // Replace the last word with Avro output
      const el = inputRef.current;
      if (!el) return;
      const cur = el.selectionStart || 0;
      let last = cur - 1;
      while (last > 0 && el.value.charAt(last) !== " ") last--;
      if (el.value.charAt(last) === " ") last++;
      const before = el.value.substring(0, last);
      const word = el.value.substring(last, cur);
      const after = el.value.substring(cur);
      const bangla = AvroPhonetic.parse(word);
      const newValue = before + bangla + after;
      setInputValue(newValue);
      if (onChange) onChange(newValue);
      // Move caret to after replaced word
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = before.length + bangla.length;
      }, 0);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <div
      style={{ position: "relative", width: "100%", ...style }}
      className={className}
    >
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          borderRadius: 8,
          border: "none",
          background: niceBg,
          color: niceFg,
          fontSize: "1.1rem",
          outline: "none",
          boxShadow: "0 2px 8px rgba(30,40,60,0.08)",
          transition: "box-shadow 0.2s",
        }}
        {...inputProps}
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

export default AvroInput;
