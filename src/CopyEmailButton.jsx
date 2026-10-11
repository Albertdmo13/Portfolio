import { useState, useRef, useEffect } from 'react';

export default function CopyEmailButton({ email, copiedText, Icons, className = "" }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopyEmail = (e) => {
    e.stopPropagation();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(email);
    }
    setCopied(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2400);
  };

  const displayText = copiedText || "Copied to clipboard";

  return (
    <button
      type="button"
      onClick={handleCopyEmail}
      className={`email-copy-btn ${copied ? "is-copied" : ""} ${className}`.trim()}
      title="Copy email to clipboard"
    >
      <span className="email-copy-base" aria-hidden={copied}>
        {Icons?.Copy && <Icons.Copy />}
        <span>{email}</span>
      </span>

      <span className="email-copy-slide" aria-hidden={!copied}>
        {Icons?.Check && <Icons.Check />}
        <span>{displayText}</span>
      </span>
    </button>
  );
}
