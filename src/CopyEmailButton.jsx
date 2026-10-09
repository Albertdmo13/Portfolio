import { useState } from 'react';

export default function CopyEmailButton({ email, copiedText, Icons, className = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopyEmail}
      className={`email-copy-btn ${className}`.trim()}
      title="Copy email to clipboard"
    >
      {copied ? <Icons.Check /> : <Icons.Copy />}
      <span>{copied ? (copiedText || "Copied!") : email}</span>
    </button>
  );
}
