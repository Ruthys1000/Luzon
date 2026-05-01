import type { ScheduleResult } from "@/types/schedule";
import { escapeHtml, linkifyStyled, hasLink, suppSearchUrl } from "@/lib/linkify";

interface ZoomOptions {
  sessions?: string;
}

function suppSearchLinkHtml(title: string, type: "video" | "article" | "activity"): string {
  const href = suppSearchUrl(title, type);
  const label = type === "video" ? "חפש ביוטיוב" : "חפש בגוגל";
  return ` <a href="${href}" target="_blank" rel="noopener" style="color:#1d7bd4;font-size:11px">${label} →</a>`;
}

export function generateHtml(result: ScheduleResult, zoom?: ZoomOptions): string {
  const rows = result.days.map((day) => {
    const dayHeader = `<tr style="background:#f3e4dc"><td colspan="4" style="padding:10px 14px;font-weight:700;color:#7f2f22;font-size:14px">${escapeHtml(day.day)}</td></tr>`;
    const slotRows = day.slots.map((s) => {
      const lessonPrefix = s.lesson_number
        ? `<strong style="font-size:12px;margin-left:4px">${s.lesson_number}.</strong> `
        : "";
      const topicHtml = `<span>${lessonPrefix}${escapeHtml(s.topic)}</span>`;
      const notesHtml = linkifyStyled(escapeHtml(s.instructor_notes));
      return `
      <tr>
        <td data-label="שעה" style="white-space:nowrap;color:#6b7280;font-size:13px">${escapeHtml(s.time)}</td>
        <td data-label="נושא" style="font-weight:600;font-size:13px">${topicHtml}</td>
        <td data-label="סוג" style="font-size:12px"><span style="background:#f3e4dc;color:#7f2f22;padding:2px 8px;border-radius:99px;white-space:nowrap">${escapeHtml(s.activity_type)}</span></td>
        <td data-label="הנחייה" style="font-size:12px;color:#6b7280;overflow-wrap:break-word">${notesHtml}</td>
      </tr>`;
    }).join("");

    const videoDesc = linkifyStyled(escapeHtml(day.supplementary.video.description));
    const articleDesc = linkifyStyled(escapeHtml(day.supplementary.article.description));
    const activityDesc = linkifyStyled(escapeHtml(day.supplementary.activity.description));

    const suppRow = `
      <tr style="background:#fdf8f4">
        <td colspan="4" style="padding:12px 14px;border-top:2px dashed #e3d8ca">
          <div>
            <div style="font-size:11px;font-weight:800;color:#d46a50;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em">תוכן משלים</div>
            <div style="display:flex;flex-direction:column;gap:6px;font-size:12px;line-height:1.6;text-align:right">
              <div>🎬 <strong>${escapeHtml(day.supplementary.video.title)}</strong> – ${videoDesc}${hasLink(videoDesc) ? "" : suppSearchLinkHtml(day.supplementary.video.title, "video")}</div>
              <div>📖 <strong>${escapeHtml(day.supplementary.article.title)}</strong> – ${articleDesc}${hasLink(articleDesc) ? "" : suppSearchLinkHtml(day.supplementary.article.title, "article")}</div>
              <div>🎯 <strong>${escapeHtml(day.supplementary.activity.title)}</strong> – ${activityDesc}${hasLink(activityDesc) ? "" : suppSearchLinkHtml(day.supplementary.activity.title, "activity")}</div>
            </div>
          </div>
        </td>
      </tr>`;
    return [dayHeader, slotRows, suppRow].join("");
  }).join("");

  const zoomBanner = zoom?.sessions?.trim() ? `
<div style="background:#eef5fd;border-radius:10px;padding:12px 16px;margin-bottom:20px;font-size:13px;line-height:1.8;border-right:4px solid #1d7bd4">
  <div style="font-size:11px;font-weight:800;color:#1d7bd4;text-transform:uppercase;margin-bottom:6px;letter-spacing:.05em">🔵 מפגשי זום</div>
  ${zoom.sessions.trim().split("\n").filter(l => l.trim()).map(l => `<div>${linkifyStyled(escapeHtml(l))}</div>`).join("")}
</div>` : "";

  return `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>לו״ז – Luz Creator</title>
<style>
  body{font-family:'Segoe UI',system-ui,sans-serif;background:#f7f3ec;margin:0;padding:20px;direction:rtl;color:#1f1c18}
  .rationale{background:linear-gradient(135deg,#fdf0eb,#fdf8f4);border-radius:10px;padding:14px 18px;margin-bottom:20px;font-size:.9rem;line-height:1.7;border-right:4px solid #d46a50}
  .table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;border-radius:12px}
  table{width:100%;border-collapse:collapse;background:#fff;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)}
  td{padding:10px 14px;border-bottom:1px solid #e5e7eb;font-size:13px;vertical-align:top;overflow-wrap:break-word;word-break:break-word}
  tr:last-child td{border-bottom:none}
  .footer{margin-top:20px;font-size:.8rem;color:#9ca3af;text-align:center}
  @media(max-width:640px){
    body{padding:10px}
    .table-wrap{border-radius:0}
    thead{display:none}
    table,tbody,tr{display:block;width:100%}
    td{display:grid;grid-template-columns:68px 1fr;gap:.4rem;padding:8px 12px;border-bottom:1px solid #cfc5b8;font-size:12px;width:100%;box-sizing:border-box}
    td::before{content:attr(data-label);font-weight:800;font-size:.7rem;color:#aaa197;padding-top:.15rem}
    td:last-child{border-bottom:none}
    tr:not([style*="background:#f3e4dc"]):not([style*="background:#fdf8f4"]){margin-bottom:.6rem;border:1px solid #e3d8ca;border-radius:12px;overflow:hidden;display:block;box-shadow:0 1px 4px rgba(0,0,0,.07);background:#fffdf9}
  }
</style>
</head>
<body>
<div class="rationale">${escapeHtml(result.rationale)}</div>
${zoomBanner}
<div class="table-wrap">
<table>
  <tbody>${rows}</tbody>
</table>
</div>
<div class="footer">Luz Creator © ${new Date().getFullYear()}</div>
</body>
</html>`;
}
