"use client";

import { useState, useRef, useEffect, Fragment } from "react";
import type { SlotData, ScheduleResult } from "@/types/schedule";
import { getBadgeClass, TABS, QUICK_STARTERS } from "@/constants/sample";
import { generateHtml } from "@/lib/generate-html";

function linkify(text: string): string {
  return text.replace(/(https?:\/\/[^\s<>"']+)/g, (url) => {
    const clean = url.replace(/[.,!?;)'"]+$/, "");
    const display = clean.includes("zoom.us") ? "קישור לזום ←" : clean;
    return `<a href="${clean}" target="_blank" rel="noopener">${display}</a>`;
  });
}

function hasLink(html: string): boolean {
  return html.includes("<a ");
}

function suppLink(title: string, type: "video" | "article" | "activity"): string {
  const q = encodeURIComponent(title);
  return type === "video"
    ? `https://www.youtube.com/results?search_query=${q}`
    : `https://www.google.com/search?q=${q}`;
}

function scheduleFilename(): string {
  const now = new Date();
  const ts = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  return `luz-${ts}.html`;
}

export default function HomePage() {
  const [form, setForm] = useState({
    goals: "",
    days: "1",
    start_time: "09:00",
    end_time: "17:00",
    content_type: "topic" as "topic" | "course" | "my_content",
    previous_days: "",
    include_team_sessions: "yes",
    zoom_morning: "",
    zoom_end: "",
    constraints: "",
    notes: "",
    material_links: "",
  });

  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<ScheduleResult | null>(null);
  const [activeTab, setActiveTab] = useState("distribution");
  const [rationaleOpen, setRationaleOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftResult, setDraftResult] = useState<ScheduleResult | null>(null);
  const [editableHtml, setEditableHtml] = useState("");
  const [whatsappCopied, setWhatsappCopied] = useState(false);
  const [editableWhatsapp, setEditableWhatsapp] = useState("");
  const [shareNotice, setShareNotice] = useState("");
  const [qaAnswers, setQaAnswers] = useState<Record<number, string>>({});
  const resultRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) loadingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [loading]);

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

  async function runGenerate(refinement_qa?: { question: string; answer: string }[]) {
    setError("");
    setResult(null);
    setIsEditing(false);
    setDraftResult(null);
    setStreamingText("");
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, days: Number(form.days), refinement_qa }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "שגיאה ביצירת הלו״ז");
        return;
      }

      if (!res.body) {
        setError("שגיאת רשת – אנא נסה שוב");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setStreamingText(accumulated);
      }

      const jsonMatch = accumulated.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        setError("שגיאה ביצירת הלו״ז – אנא נסה שוב");
        return;
      }

      const scheduleData = JSON.parse(jsonMatch[0]);
      setResult(scheduleData);
      setEditableWhatsapp(scheduleData.whatsapp_message || "");
      setQaAnswers({});
      setActiveTab("distribution");
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setError("שגיאת רשת – אנא נסה שוב");
    } finally {
      setLoading(false);
      setStreamingText("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await runGenerate();
  }

  async function copyWhatsapp() {
    if (!result) return;
    await navigator.clipboard.writeText(editableWhatsapp);
    setWhatsappCopied(true);
    setTimeout(() => setWhatsappCopied(false), 1500);
  }

  async function shareSchedule() {
    if (!result) return;
    const blob = new Blob([editableHtml], { type: "text/html;charset=utf-8" });
    const file = new File([blob], scheduleFilename(), { type: "text/html" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text: editableWhatsapp });
      } catch {
        // user cancelled – do nothing
      }
    } else {
      // desktop fallback: download + copy message
      downloadHtml();
      try {
        await navigator.clipboard.writeText(editableWhatsapp);
        setShareNotice("הקובץ הורד והודעת הווטסאפ הועתקה ללוח");
      } catch {
        setShareNotice("הקובץ הורד — העתק את הודעת הווטסאפ מהטאב המתאים");
      }
      setTimeout(() => setShareNotice(""), 3500);
    }
  }

  function downloadHtml() {
    const blob = new Blob([editableHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = scheduleFilename();
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

  return (
    <div className="page-wrapper">
      <header className="site-header">
        <div className="logo">
          <span className="logo-mark">✦</span>
          Luz Creator
        </div>
        <p>תכנן יום למידה עצמאית ללומדים שלך ושלח בווטסאפ — תוך דקות</p>
      </header>

      <form onSubmit={handleSubmit}>
        {/* Basic info */}
        <div className="card">
          <div className="card-title">פרטי ההדרכה</div>
          <div className="form-grid">
            <div className="field full">
              <label>מטרות ההדרכה <span className="hint">*חובה</span></label>
              <div className="quick-starters">
                {QUICK_STARTERS.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    className="quick-starter-chip"
                    onClick={() => setForm((prev) => ({ ...prev, goals: s.goals }))}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <textarea
                name="goals"
                value={form.goals}
                onChange={handleChange}
                placeholder="לדוגמה: פיתוח מיומנויות ניהול, שיפור תקשורת צוותית, הכרת כלים לניהול משימות"
                required
              />
            </div>
            <div className="field full">
              <label>מה סוג התוכן שלך?</label>
              <div className="content-type-chips">
                {([
                  { value: "topic", label: "נושא / מטרות", desc: "אין חומרים ספציפיים – תחולל לפי הנושא" },
                  { value: "course", label: "קורס ספציפי", desc: "Coursera / Udemy / LinkedIn Learning" },
                  { value: "my_content", label: "תוכן שלי", desc: "הסרטונים / מצגות / מסמכים שלי" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`content-type-chip${form.content_type === opt.value ? " selected" : ""}`}
                    onClick={() => setForm((prev) => ({ ...prev, content_type: opt.value }))}
                  >
                    <span className="content-type-chip-label">{opt.label}</span>
                    <span className="content-type-chip-desc">{opt.desc}</span>
                  </button>
                ))}
              </div>
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
            הגדרות מתקדמות <span style={{ fontWeight: 400, color: "var(--text-muted)", fontSize: ".85rem" }}>(אופציונלי)</span>
          </div>
          <div className="form-grid">
            <div className="field full">
              <label>האם לכלול מפגשי צוות? <span className="hint">הלו״ז מיועד לימי למידה עצמאיים</span></label>
              <select name="include_team_sessions" value={form.include_team_sessions} onChange={handleChange}>
                <option value="no">לא – ימי למידה עצמאיים בלבד</option>
                <option value="yes">כן – לכלול מפגשי זום (פתיחה וסגירת יום)</option>
              </select>
            </div>
            {form.include_team_sessions === "yes" && (
              <>
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
              </>
            )}
            <div className="field full">
              <label>מה עסקנו בו עד עכשיו? <span className="hint">רשום בקצרה — הכלי ימשיך מאיפה שעצרתם</span></label>
              <textarea
                name="previous_days"
                value={form.previous_days}
                onChange={handleChange}
                placeholder="לדוגמה: יום 1 — מבוא לניהול עצמי וזיהוי דפוסים. יום 2 — מטריצת עדיפויות ותרגול. יום 3 — תקשורת בלחץ."
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
                placeholder="לדוגמה: יותר תרגול פחות הרצאה; הלומדים מתחום הכספים ללא ניסיון בלמידה מרחוק; הדבר החשוב ביותר הוא שהלומדים ירגישו מוצלחים ביום הראשון"
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
          {loading ? "מחולל לו״ז..." : "צור לו״ז"}
        </button>
      </form>

      {/* Loading state */}
      {loading && (() => {
        const len = streamingText.length;
        const charCount = len > 0 ? ` — ${len.toLocaleString("he-IL")} תווים` : "";
        const stage =
          len === 0 ? { label: "מנתחת מטרות ההדרכה...", pct: 5 } :
          len < 1500 ? { label: `בונה מבנה הלו״ז...${charCount}`, pct: 25 } :
          len < 4000 ? { label: `מכינה הנחיות ללומדים...${charCount}`, pct: 55 } :
          len < 7000 ? { label: `מכינה הודעת ווטסאפ...${charCount}`, pct: 78 } :
          { label: `מסיימת...${charCount}`, pct: 92 };
        return (
          <div ref={loadingRef} className="loading-card">
            <span className="spinner spinner-brand" />
            <div className="loading-text">
              <strong>מחוללת לו״ז...</strong>
              <span>{stage.label}</span>
              <div className="loading-progress">
                <div className="loading-progress-bar" style={{ width: `${stage.pct}%` }} />
              </div>
            </div>
          </div>
        );
      })()}

      {/* Results */}
      {result && (
        <div ref={resultRef} style={{ marginTop: "2.5rem" }}>
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
              עדכן הנחיות
            </button>
          </div>

          {/* Rationale */}
          <div className="card">
            <button
              type="button"
              className="rationale-toggle"
              onClick={() => setRationaleOpen((o) => !o)}
            >
              <span>למה הלו״ז בנוי כך?</span>
              <span className="rationale-toggle-arrow">{rationaleOpen ? "▲" : "▼"}</span>
            </button>
            {rationaleOpen && (
              <div className="rationale-box" style={{ marginTop: "1rem" }}>{result.rationale}</div>
            )}
          </div>

          {/* Zoom banner */}
          {(form.zoom_morning || form.zoom_end) && (
            <div className="zoom-info-bar">
              <div className="zoom-info-label">פרטי זום</div>
              {form.zoom_morning && <div>☀️ <strong>מפגש בוקר (שיעור 1):</strong> {form.zoom_morning}</div>}
              {form.zoom_end && <div>🌙 <strong>מפגש סיום יום (שיעור 4):</strong> {form.zoom_end}</div>}
            </div>
          )}

          {/* Schedule table */}
          <div className="card">
            <div className="card-title">לו״ז</div>
            <div className="schedule-table-wrap">
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>שעה</th>
                    <th>נושא</th>
                    <th>סוג פעילות</th>
                    <th>הנחייה ללומד</th>
                  </tr>
                </thead>
                <tbody>
                  {result.days.map((day) => (
                    <Fragment key={day.day}>
                      <tr className="day-row">
                        <td colSpan={4}>{day.day}</td>
                      </tr>
                      {day.slots.map((slot, si) => (
                        <tr key={`slot-${day.day}-${si}`}>
                          <td data-label="שעה" style={{ whiteSpace: "nowrap", color: "var(--text-muted)", fontSize: ".83rem" }}>
                            {slot.time}
                          </td>
                          <td data-label="נושא" style={{ fontWeight: 700 }}>
                            {slot.lesson_number ? `${slot.lesson_number}. ` : ""}{slot.topic}
                          </td>
                          <td data-label="סוג">
                            <span className={`activity-badge ${getBadgeClass(slot.activity_type)}`}>
                              {slot.activity_type}
                            </span>
                          </td>
                          <td data-label="הנחייה" style={{ fontSize: ".83rem", color: "var(--text-muted)" }}
                            dangerouslySetInnerHTML={{ __html: linkify(slot.instructor_notes) }}
                          />
                        </tr>
                      ))}
                      {/* Supplementary content */}
                      <tr key={`supp-${day.day}`} className="supp-table-row">
                        <td colSpan={4}>
                          <div className="supp-inline">
                            <div className="supp-inline-title">תוכן משלים</div>
                            <div className="supp-inline-items">
                              {(["video", "article", "activity"] as const).map((type) => {
                                const icons = { video: "🎬", article: "📖", activity: "🎯" };
                                const item = day.supplementary[type];
                                const descHtml = linkify(item.description);
                                const searchUrl = suppLink(item.title, type);
                                return (
                                  <div key={type} className="supp-inline-item">
                                    <span>{icons[type]}</span>
                                    <div style={{ textAlign: "right" }}>
                                      <strong>{item.title}</strong>
                                      <span dangerouslySetInnerHTML={{ __html: ` – ${descHtml}` }} />
                                      {!hasLink(descHtml) && (
                                        <a href={searchUrl} target="_blank" rel="noopener" className="supp-search-link">
                                          {type === "video" ? "חפש ביוטיוב" : "חפש בגוגל"} →
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
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
              {TABS.map((t) => (
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
                      שמור שינויים
                    </button>
                    <button className="copy-btn" type="button" onClick={() => setIsEditing(false)}>
                      ביטול
                    </button>
                  </>
                ) : (
                  <>
                    <button className="copy-btn" type="button" onClick={startEditing}>
                      ערוך תוכן
                    </button>
                    <button className="copy-btn" type="button" onClick={downloadHtml}>
                      הורד דף ללומדים
                    </button>
                    <button className="copy-btn copy-btn-share" type="button" onClick={shareSchedule}>
                      שתף
                    </button>
                  </>
                )}
              </div>

              {shareNotice && (
                <div className="share-notice">{shareNotice}</div>
              )}

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
                            <div className="field editor-slot-full">
                              <label>הנחייה ללומד</label>
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
                <a
                  className="copy-btn copy-btn-share"
                  href={`https://wa.me/?text=${encodeURIComponent(editableWhatsapp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  שלח בווטסאפ ↗
                </a>
              </div>
              <textarea
                className="whatsapp-textarea"
                value={editableWhatsapp}
                onChange={(e) => setEditableWhatsapp(e.target.value)}
              />
            </div>

            {/* Questions */}
            <div className={`tab-panel${activeTab === "questions" ? " active" : ""}`}>
              <p className="questions-intro">
                ענה על השאלות כדי שהכלי יוכל לשפר את הלו״ז עבורך.
              </p>
              <div className="questions-list">
                {result.questions.map((q, i) => (
                  <div key={i} className="question-item question-item-interactive">
                    <div className="question-text">
                      <span className="question-icon">❓</span>
                      {q}
                    </div>
                    <textarea
                      className="question-answer"
                      placeholder="הכנס תשובתך כאן..."
                      value={qaAnswers[i] || ""}
                      onChange={(e) =>
                        setQaAnswers((prev) => ({ ...prev, [i]: e.target.value }))
                      }
                    />
                  </div>
                ))}
              </div>
              <button
                className="btn btn-primary refine-btn"
                type="button"
                disabled={loading || Object.values(qaAnswers).every((a) => !a.trim())}
                onClick={() => {
                  const qa = result.questions
                    .map((q, i) => ({ question: q, answer: qaAnswers[i] || "" }))
                    .filter((qa) => qa.answer.trim());
                  runGenerate(qa);
                }}
              >
                {loading ? (
                  <><span className="spinner" /> משפר לו״ז...</>
                ) : (
                  "שפר לו״ז לפי התשובות"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="site-footer">
        <p>פותח על ידי <strong>רותי סלומון</strong></p>
        <p>תגובות והצעות לשיפור הכלי: <a href="mailto:ruthy.salomon@gmail.com">ruthy.salomon@gmail.com</a></p>
      </footer>
    </div>
  );
}
