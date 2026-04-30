import type { ScheduleResult } from "@/types/schedule";

interface ZoomOptions {
  morning?: string;
  end?: string;
}

function linkifyHtml(text: string): string {
  return text.replace(
    /(https?:\/\/[^\s<>"]+)/g,
    '<a href="$1" target="_blank" rel="noopener" style="color:#1d7bd4">$1</a>'
  );
}

export function generateHtml(result: ScheduleResult, zoom?: ZoomOptions): string {
  const rows = result.days.map((day) => {
    const dayHeader = `<tr style="background:#f3e4dc"><td colspan="4" style="padding:10px 14px;font-weight:700;color:#7f2f22;font-size:14px">${day.day}</td></tr>`;
    const slotRows = day.slots.map((s) => `
      <tr>
        <td style="white-space:nowrap;color:#6b7280;font-size:13px">${s.time}</td>
        <td style="font-weight:600;font-size:13px">${s.lesson_number ? `<span style="display:inline-block;background:#1f1c18;color:#fff;border-radius:999px;padding:0 7px;font-size:11px;margin-left:6px;vertical-align:middle">${s.lesson_number}</span>` : ""}${s.topic}</td>
        <td style="font-size:12px"><span style="background:#f3e4dc;color:#7f2f22;padding:2px 8px;border-radius:99px;white-space:nowrap">${s.activity_type}</span></td>
        <td style="font-size:12px;color:#6b7280">${linkifyHtml(s.instructor_notes)}</td>
      </tr>`).join("");
    const suppRow = `
      <tr style="background:#fdf8f4">
        <td colspan="4" style="padding:12px 14px;border-top:2px dashed #e3d8ca">
          <div style="font-size:11px;font-weight:800;color:#d46a50;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em">תוכן משלים</div>
          <div style="display:flex;flex-direction:column;gap:6px;font-size:12px;line-height:1.6">
            <div>🎬 <strong>${day.supplementary.video.title}</strong> – ${linkifyHtml(day.supplementary.video.description)}</div>
            <div>📖 <strong>${day.supplementary.article.title}</strong> – ${linkifyHtml(day.supplementary.article.description)}</div>
            <div>🎯 <strong>${day.supplementary.activity.title}</strong> – ${linkifyHtml(day.supplementary.activity.description)}</div>
          </div>
        </td>
      </tr>`;
    return [dayHeader, slotRows, suppRow].join("");
  }).join("");

  const zoomBanner = zoom && (zoom.morning || zoom.end) ? `
<div style="background:#eef5fd;border-radius:10px;padding:12px 16px;margin-bottom:20px;font-size:13px;line-height:1.8;border-right:4px solid #1d7bd4">
  <div style="font-size:11px;font-weight:800;color:#1d7bd4;text-transform:uppercase;margin-bottom:6px;letter-spacing:.05em">🔵 פרטי זום</div>
  ${zoom.morning ? `<div>☀️ <strong>מפגש בוקר (שיעור 1):</strong> ${zoom.morning}</div>` : ""}
  ${zoom.end ? `<div>🌙 <strong>מפגש סיום יום (שיעור 4):</strong> ${zoom.end}</div>` : ""}
</div>` : "";

  return `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>לו״ז – Luz Creator</title>
<style>
  body{font-family:'Segoe UI',system-ui,sans-serif;background:#f7f3ec;margin:0;padding:24px;direction:rtl;color:#1f1c18}
  h1{font-size:1.4rem;color:#d46a50;margin-bottom:4px}
  .sub{color:#6b7280;font-size:.9rem;margin-bottom:24px}
  .rationale{background:linear-gradient(135deg,#fdf0eb,#fdf8f4);border-radius:10px;padding:14px 18px;margin-bottom:24px;font-size:.9rem;line-height:1.7;border-right:4px solid #d46a50}
  .table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;border-radius:12px}
  table{width:100%;min-width:560px;border-collapse:collapse;background:#fff;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)}
  th{background:#1f1c18;color:#fff;padding:10px 14px;text-align:right;font-size:13px;font-weight:600}
  td{padding:10px 14px;border-bottom:1px solid #e5e7eb;font-size:13px;vertical-align:top}
  tr:last-child td{border-bottom:none}
  .footer{margin-top:24px;font-size:.8rem;color:#9ca3af;text-align:center}
  @media(max-width:600px){
    body{padding:12px}
    table,thead,tbody,th,td,tr{display:block;width:100%}
    thead tr{display:none}
    tr:not([style*="background:#f3e4dc"]):not([style*="background:#fdf8f4"]){margin-bottom:.5rem;border:1px solid #e3d8ca;border-radius:12px;overflow:hidden}
    td[data-label]{display:grid;grid-template-columns:72px 1fr;gap:.4rem;padding:7px 10px;border-bottom:1px solid #e5e7eb;font-size:12px}
    td[data-label]::before{content:attr(data-label);font-weight:800;font-size:.7rem;color:#aaa197}
    td[data-label]:last-child{border-bottom:none}
  }
</style>
</head>
<body>
<h1>לו״ז – Luz Creator</h1>
<div class="sub">נוצר בעזרת בינה מלאכותית</div>
<div class="rationale">${result.rationale}</div>
${zoomBanner}
<div class="table-wrap">
<table>
  <thead><tr><th>שעה</th><th>נושא</th><th>סוג פעילות</th><th>הנחייה ללומד</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
</div>
<div class="footer">Luz Creator © ${new Date().getFullYear()}</div>
</body>
</html>`;
}
