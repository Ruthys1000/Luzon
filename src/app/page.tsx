"use client";

import { useState, useRef, useMemo } from "react";

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

const SAMPLE_RESULT: ScheduleResult = {
  rationale:
    "היום בנוי בעקרון הדרגתיות: פותחים בהבנה תיאורטית של ניהול זמן, ממשיכים לכלים מעשיים מוכחים, ובנייה של מיומנות אישית. החלק האחרון מוקדש לתכנית פעולה אישית — כך שכל מנהל יצא עם deliverable ממשי ולא רק ידע תיאורטי.",
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
    target_audience: "",
    goals: "",
    days: "3",
    start_time: "09:00",
    end_time: "17:00",
    constraints: "",
    notes: "",
    preferences: "",
    most_important: "",
    material_links: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ScheduleResult | null>(SAMPLE_RESULT);
  const [activeTab, setActiveTab] = useState("table");
  const resultRef = useRef<HTMLDivElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
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
      setActiveTab("table");
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setError("שגיאת רשת – אנא נסה שוב");
    } finally {
      setLoading(false);
    }
  }

  async function copyText(text: string, btn: HTMLButtonElement) {
    await navigator.clipboard.writeText(text);
    const orig = btn.textContent;
    btn.textContent = "הועתק!";
    setTimeout(() => { btn.textContent = orig; }, 1500);
  }

  function generateHtml(result: ScheduleResult): string {
    const rows = result.days.flatMap((day) => {
      const dayHeader = `<tr style="background:#ede9fe"><td colspan="5" style="padding:10px 14px;font-weight:700;color:#3730a3;font-size:14px">${day.day}</td></tr>`;
      const slotRows = day.slots.map((s) => `
        <tr>
          <td style="white-space:nowrap;color:#6b7280;font-size:13px">${s.time}</td>
          <td style="font-weight:600;font-size:13px">${s.topic}</td>
          <td style="font-size:12px"><span style="background:#ede9fe;color:#6d28d9;padding:2px 8px;border-radius:99px;white-space:nowrap">${s.activity_type}</span></td>
          <td style="font-size:12px;color:#374151">${s.equipment}</td>
          <td style="font-size:12px;color:#6b7280">${s.instructor_notes}</td>
        </tr>`).join("");
      return dayHeader + slotRows;
    }).join("");

    return `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>לו״ז שבועי – Luz Creator</title>
<style>
  body{font-family:'Segoe UI',system-ui,sans-serif;background:#f7f8fc;margin:0;padding:24px;direction:rtl;color:#1e1b4b}
  h1{font-size:1.4rem;color:#4f46e5;margin-bottom:4px}
  .sub{color:#6b7280;font-size:.9rem;margin-bottom:24px}
  .rationale{background:linear-gradient(135deg,#ede9fe,#e0f2fe);border-radius:10px;padding:14px 18px;margin-bottom:24px;font-size:.9rem;line-height:1.7;border-right:4px solid #4f46e5}
  table{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)}
  th{background:#4f46e5;color:#fff;padding:10px 14px;text-align:right;font-size:13px;font-weight:600}
  td{padding:10px 14px;border-bottom:1px solid #e5e7eb;font-size:13px;vertical-align:top}
  tr:last-child td{border-bottom:none}
  .footer{margin-top:24px;font-size:.8rem;color:#9ca3af;text-align:center}
</style>
</head>
<body>
<h1>לו״ז שבועי – Luz Creator</h1>
<div class="sub">נוצר בעזרת בינה מלאכותית</div>
<div class="rationale">${result.rationale}</div>
<table>
  <thead><tr><th>שעה</th><th>נושא</th><th>סוג פעילות</th><th>ציוד נדרש</th><th>דגשים למדריך</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
<div class="footer">Luz Creator © ${new Date().getFullYear()}</div>
</body>
</html>`;
  }

  const htmlContent = useMemo(() => (result ? generateHtml(result) : ""), [result]);

  const tabs = [
    { id: "table", label: "לו״ז בטבלה" },
    { id: "html", label: "HTML מעוצב" },
    { id: "whatsapp", label: "הודעת ווטסאפ" },
    { id: "supplementary", label: "תוכן משלים" },
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
              <label>קהל יעד <span className="hint">*חובה</span></label>
              <input
                type="text"
                name="target_audience"
                value={form.target_audience}
                onChange={handleChange}
                placeholder="לדוגמה: מנהלי צוות מתחילים בתחום ההייטק"
                required
              />
            </div>
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

      {/* Results */}
      {result && (
        <div ref={resultRef} style={{ marginTop: "2.5rem" }}>
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

            {/* Table */}
            <div className={`tab-panel${activeTab === "table" ? " active" : ""}`}>
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
                      <>
                        <tr key={`hdr-${day.day}`} className="day-row">
                          <td colSpan={5}>{day.day}</td>
                        </tr>
                        {day.slots.map((slot, si) => (
                          <tr key={`slot-${day.day}-${si}`}>
                            <td data-label="שעה" style={{ whiteSpace: "nowrap", color: "var(--text-muted)", fontSize: ".83rem" }}>
                              {slot.time}
                            </td>
                            <td data-label="נושא" style={{ fontWeight: 700 }}>
                              {slot.lesson_number && (
                                <span className="lesson-pair">ש״כ {slot.lesson_number}</span>
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
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* HTML preview */}
            <div className={`tab-panel${activeTab === "html" ? " active" : ""}`}>
              <div className="copy-row">
                <button
                  className="copy-btn"
                  type="button"
                  onClick={(e) => copyText(htmlContent, e.currentTarget)}
                >
                  העתק HTML
                </button>
              </div>
              <div className="html-preview">
                {activeTab === "html" && (
                  <iframe
                    srcDoc={htmlContent}
                    title="תצוגה מקדימה"
                    sandbox="allow-same-origin"
                  />
                )}
              </div>
            </div>

            {/* WhatsApp */}
            <div className={`tab-panel${activeTab === "whatsapp" ? " active" : ""}`}>
              <div className="copy-row">
                <button
                  className="copy-btn"
                  type="button"
                  onClick={(e) => copyText(result.whatsapp_message, e.currentTarget)}
                >
                  העתק הודעה
                </button>
              </div>
              <div className="whatsapp-box">{result.whatsapp_message}</div>
            </div>

            {/* Supplementary */}
            <div className={`tab-panel${activeTab === "supplementary" ? " active" : ""}`}>
              {result.days.map((day) => (
                <div key={`supp-${day.day}`} className="supp-day">
                  <h4>{day.day}</h4>
                  <div className="supp-item">
                    <span className="supp-icon">🎬</span>
                    <div className="supp-text">
                      <strong>{day.supplementary.video.title}</strong>
                      <span>{day.supplementary.video.description}</span>
                    </div>
                  </div>
                  <div className="supp-item">
                    <span className="supp-icon">📖</span>
                    <div className="supp-text">
                      <strong>{day.supplementary.article.title}</strong>
                      <span>{day.supplementary.article.description}</span>
                    </div>
                  </div>
                  <div className="supp-item">
                    <span className="supp-icon">🎯</span>
                    <div className="supp-text">
                      <strong>{day.supplementary.activity.title}</strong>
                      <span>{day.supplementary.activity.description}</span>
                    </div>
                  </div>
                </div>
              ))}
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
              <div className="btn-row">
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
                  onClick={() => {
                    setResult(null);
                    setTimeout(() => {
                      document.querySelector("form")?.dispatchEvent(
                        new Event("submit", { cancelable: true, bubbles: true })
                      );
                    }, 100);
                  }}
                >
                  🔄 חולל מחדש
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
