"use client";

import { useState, useRef, useEffect, Fragment } from "react";

interface SlotData {
  time: string;
  lesson_number?: number;
  topic: string;
  activity_type: string;
  equipment: string;
  instructor_notes: string;
}

interface SupplementaryItem {
  title: string;
  description: string;
}

interface DayData {
  day: string;
  slots: SlotData[];
  supplementary: {
    video: SupplementaryItem;
    article: SupplementaryItem;
    activity: SupplementaryItem;
  };
}

interface ScheduleResult {
  rationale: string;
  days: DayData[];
  whatsapp_message: string;
  questions: string[];
}

const ACTIVITY_BADGE: Record<string, string> = {
  "הרצאה": "badge-lecture",
  "תרגול": "badge-practice",
  "דיון": "badge-discussion",
  "הפסקה": "badge-break",
  "סיכום": "badge-summary",
  "פעילות אינטראקטיבית": "badge-activity",
};

function getBadgeClass(type: string): string {
  for (const key of Object.keys(ACTIVITY_BADGE)) {
    if (type.includes(key)) return ACTIVITY_BADGE[key];
  }
  return "badge-lecture";
}

function generateHtml(
  result: ScheduleResult,
  zoom?: { morning?: string; end?: string }
): string {
  const rows = result.days.map((day) => {
    const dayHeader = `<tr style="background:#f3e4dc"><td colspan="5" style="padding:10px 14px;font-weight:700;color:#7f2f22;font-size:14px">${day.day}</td></tr>`;
    const slotRows = day.slots.map((s) => `
      <tr>
        <td style="white-space:nowrap;color:#6b7280;font-size:13px">${s.time}</td>
        <td style="font-weight:600;font-size:13px">${s.lesson_number ? `<span style="display:inline-block;background:#1f1c18;color:#fff;border-radius:999px;padding:0 7px;font-size:11px;margin-left:6px;vertical-align:middle">${s.lesson_number}</span>` : ""}${s.topic}</td>
        <td style="font-size:12px"><span style="background:#f3e4dc;color:#7f2f22;padding:2px 8px;border-radius:99px;white-space:nowrap">${s.activity_type}</span></td>
        <td style="font-size:12px;color:#374151">${s.equipment}</td>
        <td style="font-size:12px;color:#6b7280">${s.instructor_notes}</td>
      </tr>`).join("");
    const suppRow = `
      <tr style="background:#fdf8f4">
        <td colspan="5" style="padding:12px 14px;border-top:2px dashed #e3d8ca">
          <div style="font-size:11px;font-weight:800;color:#d46a50;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em">תוכן משלים</div>
          <div style="display:flex;flex-direction:column;gap:6px;font-size:12px;line-height:1.6">
            <div>🎬 <strong>${day.supplementary.video.title}</strong> – ${day.supplementary.video.description}</div>
            <div>📖 <strong>${day.supplementary.article.title}</strong> – ${day.supplementary.article.description}</div>
            <div>🎯 <strong>${day.supplementary.activity.title}</strong> – ${day.supplementary.activity.description}</div>
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
  table{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)}
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
<table>
  <thead><tr><th>שעה</th><th>נושא</th><th>סוג פעילות</th><th>ציוד נדרש</th><th>דגשים למדריך</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
<div class="footer">Luz Creator © ${new Date().getFullYear()}</div>
</body>
</html>`;
}

const SAMPLE_RESULT: ScheduleResult = {
  rationale:
    "הלו״ז בנוי בעקרון הדרגתיות: יום ראשון מניח תשתית תיאורטית, יום שני מעמיק ומתרגל, יום שלישי מיישם ומסכם. כל בלוק למידה עצמאי בנוי מ-3 שלבים: הכנה, גוף, וסגירה — כך שהלומד יודע תמיד היכן הוא נמצא. בכל יום יש 4 בלוקים של 90 דקות + הפסקות מוגדרות מראש.",
  days: [
    {
      day: "יום 1 – ניהול זמן למנהלים",
      slots: [
        { time: "09:00–10:30", lesson_number: 1, topic: "מבוא: למה ניהול זמן קורס אצל מנהלים?", activity_type: "הרצאה", equipment: "מצגת, לוח לבן", instructor_notes: "פתחו עם סקר ידיים — כמה ישנים פחות מ-6 שעות? בונה אמון מהיר" },
        { time: "10:30–10:45", topic: "הפסקה", activity_type: "הפסקה", equipment: "", instructor_notes: "" },
        { time: "10:45–12:15", lesson_number: 2, topic: "מטריצת אייזנהאואר + שיטת GTD בפועל", activity_type: "תרגול", equipment: "דפי עבודה, עטים", instructor_notes: "תנו לכל אחד לתעדף את רשימת המשימות האמיתית שלו — יוצר 'wow moment'" },
        { time: "12:15–13:00", topic: "הפסקת צהריים", activity_type: "הפסקה", equipment: "", instructor_notes: "" },
        { time: "13:00–14:30", lesson_number: 3, topic: "ניהול פגישות שגוזלות זמן — מתי לאמר לא", activity_type: "פעילות אינטראקטיבית", equipment: "כרטיסיות תפקידים", instructor_notes: "סימולציה: אחד מבקש פגישה, השני צריך להחליט. מייצרת דיון עמוק" },
        { time: "14:30–14:45", topic: "הפסקה", activity_type: "הפסקה", equipment: "", instructor_notes: "" },
        { time: "14:45–16:15", lesson_number: 4, topic: "בניית תכנית ניהול זמן אישית ל-30 יום", activity_type: "תרגול", equipment: "תבנית תכנית אישית", instructor_notes: "כל אחד בונה את שלו, ואז מציג בפני שותף — מגביר מחויבות" },
        { time: "16:15–17:00", topic: "סיכום, מחויבויות ושאלות", activity_type: "סיכום", equipment: "", instructor_notes: "בקשו מכל אחד לציין דבר אחד שישנה כבר מחר" },
      ],
      supplementary: {
        video: { title: "The Myth of Multitasking – TED Talk", description: "סרטון 15 דקות שמראה מחקרית למה ריבוי משימות הורס פרודוקטיביות — מצוין להקרנה בפתיחה" },
        article: { title: "Getting Things Done – סיכום עיקרי השיטה", description: "מאמר קצר ב-HBR שמסכם את עקרונות ה-GTD בצורה נגישה למנהלים עסוקים" },
        activity: { title: "Time Audit — ביקורת שבועית אישית", description: "תרגיל: כל משתתף רושם 10 דברים שעשה השבוע ומסווג כל אחד — דחוף/חשוב, דחוף/לא חשוב וכו'" },
      },
    },
  ],
  whatsapp_message:
    "שלום לכולם! 👋\n\nסיימנו היום הדרכה מעולה בנושא *ניהול זמן למנהלים*.\n\nמה עשינו:\n✅ הבנו למה ניהול זמן קורס (ולמה זה לא בעיית רצון)\n✅ תרגלנו מטריצת אייזנהאואר על המשימות שלנו\n✅ בנינו תכנית אישית ל-30 יום\n\nלזכירה — כל אחד קיבל על עצמו *שינוי אחד* לביצוע מחר.\n\nחומרים נוספים בתיקייה המשותפת.\nנתראה! 🙌",
  questions: [
    "האם הלומדים מכירים שיטות ניהול זמן קיימות (GTD, Pomodoro) — או מתחילים מאפס?",
    "האם יש לומדים שעובדים בעיקר ממיטינגים? אפשר להוסיף מודול על ניהול לו״ז בין פגישות",
    "כמה מנהלים מנהלים צוותים מרוחקים? זה דורש אסטרטגיות שונות של ניהול זמן",
  ],
};

export default function HomePage() {
  const [form, setForm] = useState({
    goals: "",
    days: "3",
    start_time: "09:00",
    end_time: "17:00",
    include_team_sessions: "no",
    zoom_morning: "",
    zoom_end: "",
    constraints: "",
    notes: "",
    preferences: "",
    most_important: "",
    material_links: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ScheduleResult | null>(SAMPLE_RESULT);
  const [isSample, setIsSample] = useState(true);
  const [activeTab, setActiveTab] = useState("distribution");
  const [isEditing, setIsEditing] = useState(false);
  const [draftResult, setDraftResult] = useState<ScheduleResult | null>(null);
  const [editableHtml, setEditableHtml] = useState(() => generateHtml(SAMPLE_RESULT));
  const [whatsappCopied, setWhatsappCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) {
      setEditableHtml(generateHtml(result, {
        morning: form.zoom_morning || undefined,
        end: form.zoom_end || undefined,
      }));
    }
  }, [result, form.zoom_morning, form.zoom_end]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function runGenerate() {
    setError("");
    setResult(null);
    setIsEditing(false);
    setDraftResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, days: Number(form.days) }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "שגיאה ביצירת הלו״ז");
        return;
      }

      setResult(data);
      setIsSample(false);
      setActiveTab("distribution");
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setError("שגיאת רשת – אנא נסה שוב");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await runGenerate();
  }

  async function copyWhatsapp() {
    if (!result) return;
    await navigator.clipboard.writeText(result.whatsapp_message);
    setWhatsappCopied(true);
    setTimeout(() => setWhatsappCopied(false), 1500);
  }

  function downloadHtml() {
    const blob = new Blob([editableHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "luz-schedule.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function startEditing() {
    if (!result) return;
    setDraftResult(JSON.parse(JSON.stringify(result)));
    setIsEditing(true);
  }

  function saveEditing() {
    if (!draftResult) return;
    setResult(draftResult);
    setIsEditing(false);
  }

  function updateDraftSlot(di: number, si: number, field: keyof SlotData, value: string) {
    if (!draftResult) return;
    setDraftResult({
      ...draftResult,
      days: draftResult.days.map((day, d) =>
        d !== di ? day : {
          ...day,
          slots: day.slots.map((slot, s) =>
            s !== si ? slot : { ...slot, [field]: value }
          ),
        }
      ),
    });
  }

  function updateDraftSupp(
    di: number,
    type: "video" | "article" | "activity",
    field: "title" | "description",
    value: string
  ) {
    if (!draftResult) return;
    setDraftResult({
      ...draftResult,
      days: draftResult.days.map((day, d) =>
        d !== di ? day : {
          ...day,
          supplementary: {
            ...day.supplementary,
            [type]: { ...day.supplementary[type], [field]: value },
          },
        }
      ),
    });
  }

  const tabs = [
    { id: "distribution", label: "לו״ז להפצה" },
    { id: "whatsapp", label: "הודעת ווטסאפ" },
    { id: "questions", label: "שאלות ומשוב" },
  ];

  return (
    <div className="page-wrapper">
      <header className="site-header">
        <div className="logo">
          <span className="logo-mark">✦</span>
          Luz Creator
        </div>
        <p>מחולל לו״ז הדרכה מקצועי</p>
      </header>

      <form onSubmit={handleSubmit}>
        {/* Basic info */}
        <div className="card">
          <div className="card-title">
            <span className="icon">📋</span> פרטי ההדרכה
          </div>
          <div className="form-grid">
            <div className="field full">
              <label>מטרות ההדרכה <span className="hint">*חובה</span></label>
              <textarea
                name="goals"
                value={form.goals}
                onChange={handleChange}
                placeholder="לדוגמה: פיתוח מיומנויות ניהול, שיפור תקשורת צוותית, הכרת כלים לניהול משימות"
                required
              />
            </div>
            <div className="field">
              <label>מספר ימים <span className="hint">*חובה</span></label>
              <input
                type="number"
                name="days"
                value={form.days}
                onChange={handleChange}
                min={1}
                max={7}
                required
              />
            </div>
            <div className="field" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <div>
                <label>שעת התחלה</label>
                <input type="time" name="start_time" value={form.start_time} onChange={handleChange} />
              </div>
              <div>
                <label>שעת סיום</label>
                <input type="time" name="end_time" value={form.end_time} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        {/* Advanced */}
        <div className="card">
          <div className="card-title">
            <span className="icon">⚙️</span> הגדרות מתקדמות <span style={{ fontWeight: 400, color: "var(--text-muted)", fontSize: ".85rem" }}>(אופציונלי)</span>
          </div>
          <div className="form-grid">
            <div className="field full">
              <label>האם לכלול מפגשי צוות? <span className="hint">הלו״ז מיועד לימי למידה עצמאיים</span></label>
              <select name="include_team_sessions" value={form.include_team_sessions} onChange={handleChange}>
                <option value="no">לא – ימי למידה עצמאיים בלבד</option>
                <option value="yes">כן – לכלול גם מפגשי צוות / עבודה בצוותים</option>
              </select>
            </div>
            <div className="field">
              <label>
                🔵 זום – מפגש בוקר <span className="hint">קישור או מספר חדר</span>
              </label>
              <input
                type="text"
                name="zoom_morning"
                value={form.zoom_morning}
                onChange={handleChange}
                placeholder="לדוגמה: 123 456 7890 או https://zoom.us/j/..."
              />
            </div>
            <div className="field">
              <label>
                🔵 זום – מפגש סיום יום <span className="hint">קישור או מספר חדר</span>
              </label>
              <input
                type="text"
                name="zoom_end"
                value={form.zoom_end}
                onChange={handleChange}
                placeholder="לדוגמה: 123 456 7890 או https://zoom.us/j/..."
              />
            </div>
            <div className="field full">
              <label>אילוצים <span className="hint">הרצאות חובה, מגבלות טכניות וכו׳</span></label>
              <textarea
                name="constraints"
                value={form.constraints}
                onChange={handleChange}
                placeholder="לדוגמה: יש הרצאת אורח ביום ב׳ בשעה 11:00, אין גישה לאינטרנט ביום ג׳"
              />
            </div>
            <div className="field full">
              <label>דגשים נוספים</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="לדוגמה: הלומדים רובם מתחום הכספים, אין ניסיון בלמידה מרחוק"
              />
            </div>
            <div className="field">
              <label>העדפות עיצוב / שיטה</label>
              <input
                type="text"
                name="preferences"
                value={form.preferences}
                onChange={handleChange}
                placeholder="לדוגמה: יותר תרגול, פחות הרצאה"
              />
            </div>
            <div className="field">
              <label>
                הדבר הכי חשוב לך בלו״ז הזה <span className="hint">מה יוצר הצלחה?</span>
              </label>
              <input
                type="text"
                name="most_important"
                value={form.most_important}
                onChange={handleChange}
                placeholder="לדוגמה: שהלומדים ירגישו מוצלחים ביום הראשון"
              />
            </div>
            <div className="field full">
              <label>
                קישורים לחומרים שלך <span className="hint">סרטונים, מצגות, מאמרים — שורה אחת לכל קישור</span>
              </label>
              <textarea
                className="links-field"
                name="material_links"
                value={form.material_links}
                onChange={handleChange}
                placeholder={"https://www.youtube.com/watch?v=...\nhttps://docs.google.com/..."}
              />
              <div className="links-hint">
                💡 אם אין לך קישורים — השאר ריק. הכלי ימצא ויציע תכנים רלוונטיים לפי הנושא.
              </div>
            </div>
          </div>
        </div>

        {error && <div className="error-box">⚠️ {error}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" />
              מחולל לו״ז...
            </>
          ) : (
            <>✨ צור לו״ז שבועי</>
          )}
        </button>
      </form>

      {/* Loading state */}
      {loading && (
        <div className="loading-card">
          <span className="spinner spinner-brand" />
          <div className="loading-text">
            <strong>מחוללת לו״ז...</strong>
            <span>הבינה המלאכותית בונה לו״ז מותאם אישית עבורך</span>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div ref={resultRef} style={{ marginTop: "2.5rem" }}>
          {/* Sample banner */}
          {isSample && (
            <div className="sample-banner">
              👁 זוהי תוצאת <strong>דוגמה בלבד</strong> — מלא את הפרטים ולחץ &ldquo;צור לו״ז שבועי&rdquo; כדי לקבל לו״ז אמיתי
            </div>
          )}

          {/* Action buttons */}
          <div className="result-actions">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => {
                setResult(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              ✏️ עדכן הנחיות
            </button>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={runGenerate}
              disabled={loading}
            >
              🔄 חולל מחדש
            </button>
          </div>

          {/* Rationale */}
          <div className="card">
            <div className="result-header">
              <div className="result-header-icon">💡</div>
              <div className="result-header-text">
                <h3>נימוק פדגוגי</h3>
                <p>ההסבר מאחורי מבנה הלו״ז</p>
              </div>
            </div>
            <div className="rationale-box">{result.rationale}</div>
          </div>

          {/* Schedule table – shown directly, no tab */}
          <div className="card">
            <div className="card-title">
              <span className="icon">📅</span> לו״ז
            </div>
            <div className="schedule-table-wrap">
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>שעה</th>
                    <th>נושא</th>
                    <th>סוג פעילות</th>
                    <th>ציוד נדרש</th>
                    <th>דגשים למדריך</th>
                  </tr>
                </thead>
                <tbody>
                  {result.days.map((day) => (
                    <Fragment key={day.day}>
                      <tr className="day-row">
                        <td colSpan={5}>{day.day}</td>
                      </tr>
                      {day.slots.map((slot, si) => (
                        <tr key={`slot-${day.day}-${si}`}>
                          <td data-label="שעה" style={{ whiteSpace: "nowrap", color: "var(--text-muted)", fontSize: ".83rem" }}>
                            {slot.time}
                          </td>
                          <td data-label="נושא" style={{ fontWeight: 700 }}>
                            {slot.lesson_number && (
                              <span className="lesson-pair">{slot.lesson_number}</span>
                            )}
                            {slot.topic}
                          </td>
                          <td data-label="סוג">
                            <span className={`activity-badge ${getBadgeClass(slot.activity_type)}`}>
                              {slot.activity_type}
                            </span>
                          </td>
                          <td data-label="ציוד" style={{ fontSize: ".83rem" }}>{slot.equipment}</td>
                          <td data-label="דגשים" style={{ fontSize: ".83rem", color: "var(--text-muted)" }}>
                            {slot.instructor_notes}
                          </td>
                        </tr>
                      ))}
                      {/* Supplementary content at end of each day */}
                      <tr key={`supp-${day.day}`} className="supp-table-row">
                        <td colSpan={5}>
                          <div className="supp-inline">
                            <div className="supp-inline-title">תוכן משלים</div>
                            <div className="supp-inline-items">
                              <div className="supp-inline-item">
                                <span>🎬</span>
                                <div>
                                  <strong>{day.supplementary.video.title}</strong>
                                  <span> – {day.supplementary.video.description}</span>
                                </div>
                              </div>
                              <div className="supp-inline-item">
                                <span>📖</span>
                                <div>
                                  <strong>{day.supplementary.article.title}</strong>
                                  <span> – {day.supplementary.article.description}</span>
                                </div>
                              </div>
                              <div className="supp-inline-item">
                                <span>🎯</span>
                                <div>
                                  <strong>{day.supplementary.activity.title}</strong>
                                  <span> – {day.supplementary.activity.description}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabs */}
          <div className="card">
            <div className="tab-bar">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  className={`tab${activeTab === t.id ? " active" : ""}`}
                  onClick={() => setActiveTab(t.id)}
                  type="button"
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* לו"ז להפצה */}
            <div className={`tab-panel${activeTab === "distribution" ? " active" : ""}`}>
              <div className="copy-row">
                {isEditing ? (
                  <>
                    <button className="copy-btn copy-btn-save" type="button" onClick={saveEditing}>
                      💾 שמור שינויים
                    </button>
                    <button className="copy-btn" type="button" onClick={() => setIsEditing(false)}>
                      ✕ ביטול
                    </button>
                  </>
                ) : (
                  <>
                    <button className="copy-btn" type="button" onClick={startEditing}>
                      ✏️ ערוך תוכן
                    </button>
                    <button className="copy-btn" type="button" onClick={downloadHtml}>
                      ⬇️ הורד HTML
                    </button>
                  </>
                )}
              </div>

              {isEditing && draftResult ? (
                <div className="structured-editor">
                  <div className="field">
                    <label>נימוק פדגוגי</label>
                    <textarea
                      value={draftResult.rationale}
                      onChange={(e) => setDraftResult({ ...draftResult, rationale: e.target.value })}
                    />
                  </div>

                  {draftResult.days.map((day, di) => (
                    <div key={di} className="editor-day">
                      <div className="editor-day-header">
                        <input
                          className="editor-day-name"
                          value={day.day}
                          onChange={(e) =>
                            setDraftResult({
                              ...draftResult,
                              days: draftResult.days.map((d, idx) =>
                                idx === di ? { ...d, day: e.target.value } : d
                              ),
                            })
                          }
                        />
                      </div>

                      {day.slots.map((slot, si) => (
                        <div key={si} className="editor-slot">
                          <div className="editor-slot-time">{slot.time}</div>
                          <div className="editor-slot-fields">
                            <div className="field">
                              <label>נושא</label>
                              <input
                                value={slot.topic}
                                onChange={(e) => updateDraftSlot(di, si, "topic", e.target.value)}
                              />
                            </div>
                            <div className="field">
                              <label>סוג פעילות</label>
                              <select
                                value={slot.activity_type}
                                onChange={(e) => updateDraftSlot(di, si, "activity_type", e.target.value)}
                              >
                                {["הרצאה","תרגול","דיון","הפסקה","סיכום","פעילות אינטראקטיבית"].map((t) => (
                                  <option key={t} value={t}>{t}</option>
                                ))}
                              </select>
                            </div>
                            <div className="field">
                              <label>ציוד נדרש</label>
                              <input
                                value={slot.equipment}
                                onChange={(e) => updateDraftSlot(di, si, "equipment", e.target.value)}
                              />
                            </div>
                            <div className="field editor-slot-full">
                              <label>דגשים למדריך</label>
                              <input
                                value={slot.instructor_notes}
                                onChange={(e) => updateDraftSlot(di, si, "instructor_notes", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="editor-supp">
                        <div className="editor-supp-title">תוכן משלים</div>
                        {(["video", "article", "activity"] as const).map((type) => {
                          const icons = { video: "🎬", article: "📖", activity: "🎯" };
                          return (
                            <div key={type} className="editor-supp-row">
                              <span className="editor-supp-icon">{icons[type]}</span>
                              <div className="field">
                                <label>כותרת</label>
                                <input
                                  value={day.supplementary[type].title}
                                  onChange={(e) => updateDraftSupp(di, type, "title", e.target.value)}
                                />
                              </div>
                              <div className="field">
                                <label>תיאור</label>
                                <input
                                  value={day.supplementary[type].description}
                                  onChange={(e) => updateDraftSupp(di, type, "description", e.target.value)}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <iframe
                  className="html-preview"
                  srcDoc={editableHtml}
                  title="תצוגה מקדימה של לו״ז"
                  sandbox="allow-same-origin"
                />
              )}
            </div>

            {/* WhatsApp */}
            <div className={`tab-panel${activeTab === "whatsapp" ? " active" : ""}`}>
              <div className="copy-row">
                <button
                  className="copy-btn"
                  type="button"
                  onClick={copyWhatsapp}
                >
                  {whatsappCopied ? "הועתק!" : "העתק הודעה"}
                </button>
              </div>
              <textarea
                className="whatsapp-textarea"
                readOnly
                value={result.whatsapp_message}
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
            </div>

            {/* Questions */}
            <div className={`tab-panel${activeTab === "questions" ? " active" : ""}`}>
              <div className="questions-list">
                {result.questions.map((q, i) => (
                  <div key={i} className="question-item">
                    <span>❓</span>
                    {q}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
