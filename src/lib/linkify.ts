export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function safeUrl(raw: string): string | null {
  const clean = raw.replace(/[.,!?;)'"]+$/, "");
  try {
    const { protocol } = new URL(clean);
    return protocol === "http:" || protocol === "https:" ? clean : null;
  } catch {
    return null;
  }
}

export function linkify(text: string): string {
  return text.replace(/(https?:\/\/[^\s<>"']+)/g, (url) => {
    const clean = safeUrl(url);
    if (!clean) return escapeHtml(url);
    const display = clean.includes("zoom.us") ? "קישור לזום ←" : clean;
    return `<a href="${clean}" target="_blank" rel="noopener noreferrer">${display}</a>`;
  });
}

export function linkifyStyled(text: string): string {
  return text.replace(/(https?:\/\/[^\s<>"']+)/g, (url) => {
    const clean = safeUrl(url);
    if (!clean) return escapeHtml(url);
    const display = clean.includes("zoom.us") ? "קישור לזום ←" : clean;
    return `<a href="${clean}" target="_blank" rel="noopener noreferrer" style="color:#1d7bd4">${display}</a>`;
  });
}

export function hasLink(html: string): boolean {
  return html.includes("<a ");
}

export interface LinkSegment {
  text: string;
  url: string | null;
}

export function segmentLinks(text: string): LinkSegment[] {
  const segments: LinkSegment[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(/(https?:\/\/[^\s<>"']+)/g)) {
    const raw = match[0];
    const index = match.index ?? 0;
    if (index > lastIndex) segments.push({ text: text.slice(lastIndex, index), url: null });
    const clean = safeUrl(raw);
    if (!clean) {
      segments.push({ text: raw, url: null });
    } else {
      const display = clean.includes("zoom.us") ? "קישור לזום ←" : clean;
      segments.push({ text: display, url: clean });
    }
    lastIndex = index + raw.length;
  }
  if (lastIndex < text.length) segments.push({ text: text.slice(lastIndex), url: null });
  return segments;
}

export function suppSearchUrl(title: string, type: "video" | "article" | "activity"): string {
  const q = encodeURIComponent(title);
  return type === "video"
    ? `https://www.youtube.com/results?search_query=${q}`
    : `https://www.google.com/search?q=${q}`;
}
