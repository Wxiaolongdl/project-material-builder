const MAX_MESSAGE_LENGTH = 1000;
const MAX_ERROR_LENGTH = 1200;

const SENSITIVE_PATTERNS: Array<[RegExp, string]> = [
  [/\b1[3-9]\d{9}\b/g, "[redacted-phone]"],
  [/\b\d{6}(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dXx]\b/g, "[redacted-id]"],
  [/\b(?:sk-[A-Za-z0-9_-]{8,}|[A-Z0-9_]*API[_-]?KEY\s*=\s*[^\s,;]+)/gi, "[redacted-secret]"],
  [/\b(?:cookie|session|token|authorization)\s*[:=]\s*[^\s,;]+/gi, "[redacted-secret]"],
];

export function sanitizeErrorText(value: unknown) {
  return redact(String(value ?? "未知错误")).slice(0, MAX_ERROR_LENGTH);
}

export function sanitizeUserMessage(value: string) {
  return redact(value).trim().slice(0, MAX_MESSAGE_LENGTH);
}

export function sanitizeOptionalContact(value: string) {
  return redact(value).trim().slice(0, 120);
}

export function sanitizeExcerpt(value: string, allowExcerpt: boolean) {
  if (!allowExcerpt) return "";
  return sanitizeUserMessage(value).slice(0, 500);
}

export async function createSessionIdHash(rawSessionId: string) {
  const input = new TextEncoder().encode(rawSessionId);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function redact(value: string) {
  return SENSITIVE_PATTERNS.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), value);
}
