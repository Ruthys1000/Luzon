"use client";

import { useState, Fragment } from "react";
import { Sparkles, Pencil } from "lucide-react";
import type { ScheduleResult } from "@/types/schedule";
import { getBadgeClass } from "@/constants/sample";
import { escapeHtml, linkify, hasLink, suppSearchUrl } from "@/lib/linkify";
import { StructuredEditor } from "@/components/StructuredEditor";

interface ScheduleResultProps {
  result: ScheduleResult;
  editableHtml: string;
  editableWhatsapp: string;
  zoomSessions: string;
  loading: boolean;
  onReset: () => void;
  onResultChange: (r: ScheduleResult) => void;
  onWhatsappChange: (msg: string) => void;
  onRefine: (qa: { question: string; answer: string }[]) => void;
  onDownload: () => void;
  onShare: () => void;
  shareNotice: string;
}

export function ScheduleResultPanel({
  result,
  editableHtml,
  editableWhatsapp,
  zoomSessions,
  loading,
  onReset,
  onResultChange,
  onWhatsappChange,
  onRefine,
  onDownload,
  onShare,
  shareNotice,
}: ScheduleResultProps) {
  const [rationaleOpen, setRationaleOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftResult, setDraftResult] = useState<ScheduleResult | null>(null);
  const [whatsappCopied, setWhatsappCopied] = useState(false);
  const [isImproveOpen, setIsImproveOpen] = useState(false);
  const [improveMode, setImproveMode] = useState<'ai'|'manual'>('ai');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [qaAnswers, setQaAnswers] = useState<Record<number, string>>({});

  function startEditing() {
    setDraftResult(JSON.parse(JSON.stringify(result)));
    setIsEditing(true);
  }

  function saveEditing() {
    if (!draftResult) return;
    onResultChange(draftResult);
    setIsEditing(false);
  }

  async function copyWhatsapp() {
    await navigator.clipboard.writeText(editableWhatsapp);
    setWhatsappCopied(true);
    setTimeout(() => setWhatsappCopied(false), 1500);
  }

  return (
    <div style={{ marginTop: "2.5rem" }}>

      {/* Quiet header — no nav links */}
      <div className="result-intro">
        <span className="result-intro-check">✓</span>
        <div>
          <div className="result-intro-title">הלו״ז מוכן</div>
          <div className="result-intro-sub">עברו על הלו״ז — מתחתיו: שיפור ושיתוף</div>
        </div>
      </div>

      {/* Rationale */}
      <div className="card">
        <button
          type="button"
          className="rationale-toggle"
          aria-expanded={rationaleOpen}
          aria-label="הצג או הסתר: למה הלו״ז בנוי כך?"
          onClick={() => setRationaleOpen((o) => !o)}
        >
          <span>למה הלו״ז בנוי כך?</span>
          <span className="rationale-toggle-arrow" aria-hidden="true">{rationaleOpen ? "▲" : "▼"}</span>
        </button>
        {rationaleOpen && (
          <div className="rationale-box" style={{ marginTop: "1rem" }}>{result.rationale}</div>
        )}
      </div>

      {/* Zoom banner */}
      {zoomSessions?.trim() && (
        <div className="zoom-info-bar">
          <div className="zoom-info-label">🔵 מפגשי זום</div>
          {zoomSessions.trim().split("\n").filter(l => l.trim()).map((line, i) => (
            <div key={i}>{line}</div>
          ))}
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
                <th>הנחיות</th>
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
                      <td
                        data-label="הנחייה"
                        style={{ fontSize: ".83rem", color: "var(--text-muted)" }}
                        dangerouslySetInnerHTML={{ __html: linkify(escapeHtml(slot.instructor_notes)) }}
                      />
                    </tr>
                  ))}
                  <tr key={`supp-${day.day}`} className="supp-table-row">
                    <td colSpan={4}>
                      <div className="supp-inline">
                        <div className="supp-inline-title">תוכן משלים</div>
                        <div className="supp-inline-items">
                          {(["video", "article", "activity"] as const).map((type) => {
                            const icons = { video: "🎬", article: "📖", activity: "🎯" };
                            const item = day.supplementary[type];
                            const descHtml = linkify(escapeHtml(item.description));
                            const searchUrl = suppSearchUrl(item.title, type);
                            return (
                              <div key={type} className="supp-inline-item">
                                <span>{icons[type]}</span>
                                <div style={{ textAlign: "right" }}>
                                  <strong>{item.title}</strong>
                                  <span dangerouslySetInnerHTML={{ __html: ` – ${descHtml}` }} />
                                  {!hasLink(descHtml) && (
                                    <a href={searchUrl} target="_blank" rel="noopener noreferrer" className="supp-search-link">
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

      {/* Accordion: Improve schedule (manual + AI) */}
      <div className="card" id="section-improve">
        <button
          type="button"
          className="rationale-toggle"
          aria-expanded={isImproveOpen}
          aria-label="הצג או הסתר: שיפור הלו״ז"
          onClick={() => setIsImproveOpen((o) => !o)}
        >
          <span>שפר את הלו״ז</span>
          <span className="rationale-toggle-arrow" aria-hidden="true">{isImproveOpen ? "▲" : "▼"}</span>
        </button>
        {isImproveOpen && (
          <div style={{ marginTop: "1.2rem" }}>
            {/* Tab selector */}
            <div className="improve-tabs">
              <button
                type="button"
                className={`improve-tab${improveMode === 'ai' ? ' active' : ''}`}
                onClick={() => { setImproveMode('ai'); setIsEditing(false); setDraftResult(null); }}
              ><Sparkles size={14} strokeWidth={1.8} /> שפר עם AI</button>
              <button
                type="button"
                className={`improve-tab${improveMode === 'manual' ? ' active' : ''}`}
                onClick={() => setImproveMode('manual')}
              ><Pencil size={14} strokeWidth={1.8} /> ערוך ידנית</button>
            </div>

            {/* Manual edit */}
            {improveMode === 'manual' && (
              <div className="improve-sub-section">
                {isEditing && draftResult ? (
                  <>
                    <StructuredEditor draftResult={draftResult} onChange={setDraftResult} />
                    <div className="copy-row" style={{ marginTop: ".9rem" }}>
                      <button className="copy-btn copy-btn-save" type="button" onClick={saveEditing}>שמור שינויים</button>
                      <button className="copy-btn" type="button" onClick={() => setIsEditing(false)}>ביטול</button>
                    </div>
                  </>
                ) : (
                  <button className="copy-btn" type="button" onClick={startEditing}>ערוך ידנית</button>
                )}
              </div>
            )}

            {/* AI refine */}
            {improveMode === 'ai' && (
              <div className="improve-sub-section">
                <p className="questions-intro">ענו על השאלות כדי שהכלי יוכל לשפר את הלו״ז.</p>
                <div className="questions-list">
                  {result.questions.map((q, i) => (
                    <div key={i} className="question-item question-item-interactive">
                      <div className="question-text">
                        <span className="question-icon" aria-hidden="true">❓</span>
                        {q}
                      </div>
                      <textarea
                        className="question-answer"
                        placeholder="כתבו תשובה כאן..."
                        value={qaAnswers[i] || ""}
                        onChange={(e) => setQaAnswers((prev) => ({ ...prev, [i]: e.target.value }))}
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
                    onRefine(qa);
                  }}
                >
                  {loading ? <><span className="spinner" /> משפר לו״ז...</> : "שפר לו״ז לפי התשובות"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Accordion: Share & send */}
      <div className="card" id="section-share">
        <button
          type="button"
          className="rationale-toggle"
          aria-expanded={isShareOpen}
          aria-label="הצג או הסתר: שיתוף ושליחה"
          onClick={() => setIsShareOpen((o) => !o)}
        >
          <span>שתף ושלח</span>
          <span className="rationale-toggle-arrow" aria-hidden="true">{isShareOpen ? "▲" : "▼"}</span>
        </button>
        {isShareOpen && (
          <div style={{ marginTop: "1.2rem" }}>
            {/* WhatsApp message */}
            <div className="improve-sub-section">
              <div className="improve-sub-title">הודעת WhatsApp</div>
              <p className="section-subtitle" style={{ marginBottom: ".7rem" }}>הודעה מכינה ליום שלמחרת</p>
              <textarea
                className="whatsapp-textarea"
                value={editableWhatsapp}
                onChange={(e) => onWhatsappChange(e.target.value)}
              />
              <div className="copy-row" style={{ marginTop: ".9rem" }}>
                <button className="copy-btn" type="button" onClick={copyWhatsapp}>
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
            </div>

            <hr className="improve-divider" />

            {/* Download / share file */}
            <div className="improve-sub-section">
              <div className="improve-sub-title">שמור ושתף</div>
              <p className="section-subtitle" style={{ marginBottom: ".7rem" }}>קובץ HTML עם כל הפרטים — שתפו בווטסאפ או הורידו</p>
              <div className="copy-row">
                <button className="copy-btn copy-btn-share" type="button" onClick={onShare}>שלח בווטסאפ ↗</button>
                <button className="copy-btn" type="button" onClick={onDownload}>הורד</button>
              </div>
              {shareNotice && <div className="share-notice">{shareNotice}</div>}
            </div>
          </div>
        )}
      </div>

      {/* Reset */}
      <div className="result-actions" style={{ marginTop: "1rem" }}>
        <button className="btn btn-secondary" type="button" onClick={onReset}>
          חזרה להתחלה
        </button>
      </div>

    </div>
  );
}
