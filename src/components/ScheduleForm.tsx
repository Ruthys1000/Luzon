"use client";

import { QUICK_STARTERS } from "@/constants/sample";

export interface FormState {
  goals: string;
  days: string;
  start_time: string;
  end_time: string;
  content_type: "topic" | "course" | "my_content";
  courseUrl: string;
  myContentDescription: string;
  previous_days: string;
  zoomEnabled: boolean;
  zoomMeetingId: string;
  zoomTimes: string;
  constraints: string;
  material_links: string;
}

interface ScheduleFormProps {
  form: FormState;
  loading: boolean;
  error: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onContentTypeChange: (value: "topic" | "course" | "my_content") => void;
  onGoalsChange: (goals: string) => void;
  onZoomEnabledChange: (enabled: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ScheduleForm({
  form,
  loading,
  error,
  onChange,
  onContentTypeChange,
  onGoalsChange,
  onZoomEnabledChange,
  onSubmit,
}: ScheduleFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="card">
        <div className="card-title">פרטי ההדרכה</div>
        <p className="form-legend"><span className="required-mark">*</span> שדה חובה</p>
        <div className="form-grid">
          <div className="field full">
            <label>
              נושא היום, מטרות ורמת הלומדים/ות <span className="required-mark">*</span>{" "}
              <span className="hint">נושא + מה הלומדים/ות ייצאו עם + רמתם/ן — ככל שתפרטו, הלו״ז מדויק יותר</span>
            </label>
            <div className="quick-starters">
              {QUICK_STARTERS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  className="quick-starter-chip"
                  aria-label={`בחרו נושא: ${s.label}`}
                  onClick={() => onGoalsChange(s.goals)}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <textarea
              name="goals"
              value={form.goals}
              onChange={onChange}
              placeholder="לדוגמה: ניהול עצמי בלמידה מרחוק — לומדים מתחילים, ייצאו עם כלים לתכנון יום, זיהוי גורמי הסחה ובניית שגרת למידה"
              required
            />
          </div>
          <div className="field full">
            <label>מה יש לך? <span className="hint">בחרו אפשרות אחת — הלו״ז ייבנה לפיה</span></label>
            <div className="content-type-chips">
              {([
                { value: "topic", label: "נושא בלבד", desc: "אין חומרים – הכלי יבנה הכל לפי הנושא" },
                { value: "course", label: "קורס מוכן", desc: "Coursera / Udemy / LinkedIn Learning" },
                { value: "my_content", label: "תוכן שלי", desc: "יש לי חומרים — אתאר אותם בטקסט" },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`content-type-chip${form.content_type === opt.value ? " selected" : ""}`}
                  onClick={() => onContentTypeChange(opt.value)}
                >
                  <span className="content-type-chip-label">{opt.label}</span>
                  <span className="content-type-chip-desc">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
          {form.content_type === "course" && (
            <div className="field full">
              <label>
                קישור לקורס <span className="required-mark">*</span>{" "}
                <span className="hint">הדביקו את כתובת הקורס מ-Coursera / Udemy / LinkedIn Learning</span>
              </label>
              <input
                type="url"
                name="courseUrl"
                value={form.courseUrl}
                onChange={onChange}
                placeholder="https://www.coursera.org/learn/..."
                required
              />
            </div>
          )}
          {form.content_type === "my_content" && (
            <div className="field full">
              <label>
                תארו את החומרים שלכם <span className="required-mark">*</span>{" "}
                <span className="hint">הלו״ז יתבסס ישירות עליהם</span>
              </label>
              <textarea
                name="myContentDescription"
                value={form.myContentDescription}
                onChange={onChange}
                placeholder={"לדוגמה: סרטון הסבר 20 דק' על pivot tables; מצגת 30 שקפים על ניהול זמן; קובץ PDF עם תרגילים"}
                required
              />
              <div className="my-content-note">
                💡 אין צורך להעלות קבצים — פשוט כתבו מה יש לכם (כמות, אורך, נושאים)
              </div>
            </div>
          )}

          <div className="field">
            <label>מספר ימים <span className="required-mark">*</span> <span className="hint">בדרך כלל: 1</span></label>
            <input
              type="number"
              name="days"
              value={form.days}
              onChange={onChange}
              min={1}
              max={7}
              required
            />
          </div>
          <div className="field">
            <label>שעת התחלה <span className="required-mark">*</span> <span className="hint">שעות הלמידה ביום</span></label>
            <input type="time" name="start_time" value={form.start_time} onChange={onChange} />
          </div>
          <div className="field">
            <label>שעת סיום <span className="required-mark">*</span></label>
            <input type="time" name="end_time" value={form.end_time} onChange={onChange} />
          </div>

          <div className="field full">
            <label className="zoom-toggle-label">
              <input
                type="checkbox"
                checked={form.zoomEnabled}
                onChange={(e) => onZoomEnabledChange(e.target.checked)}
                className="zoom-toggle-checkbox"
              />
              <span>יש מפגשי זום ביום זה <span className="field-optional">(אופציונלי)</span></span>
            </label>
            {form.zoomEnabled && (
              <div className="zoom-fields">
                <div className="zoom-field-group">
                  <label className="zoom-sub-label">
                    מספר חדר <span className="hint">ספרות בלבד, ללא קישור</span>
                  </label>
                  <input
                    type="text"
                    name="zoomMeetingId"
                    value={form.zoomMeetingId}
                    onChange={onChange}
                    placeholder="123456789"
                    inputMode="numeric"
                    autoComplete="off"
                  />
                </div>
                <div className="zoom-field-group">
                  <label className="zoom-sub-label">
                    שעות <span className="hint">לדוגמה: 09:00, 17:00</span>
                  </label>
                  <input
                    type="text"
                    name="zoomTimes"
                    value={form.zoomTimes}
                    onChange={onChange}
                    placeholder="09:00, 17:00"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          פרטים נוספים{" "}
          <span style={{ fontWeight: 400, color: "var(--text-muted)", fontSize: ".85rem" }}>
            (אופציונלי — ככל שתמלא יותר, הלו״ז יהיה מדויק יותר)
          </span>
        </div>
        <div className="form-grid">
          <div className="field full">
            <label>מה כיסינו בימים הקודמים? <span className="hint">ביום הראשון? השאר ריק. מיום שני — כתוב בקצרה</span></label>
            <textarea
              name="previous_days"
              value={form.previous_days}
              onChange={onChange}
              placeholder="לדוגמה: אתמול — מבוא לניהול עצמי וזיהוי דפוסים; שלשום — מטריצת עדיפויות ותרגול"
            />
          </div>
          <div className="field full">
            <label>אילוצים <span className="hint">אירועים קבועים, שעות מחייבות, מגבלות טכניות...</span></label>
            <textarea
              name="constraints"
              value={form.constraints}
              onChange={onChange}
              placeholder="לדוגמה: פגישת צוות ב-11:00; הרצאת אורח ב-14:00; יום קצר – מסיים ב-15:00; אין גישה לאינטרנט"
            />
          </div>
          <div className="field full">
            <label>
              קישורים לחומרים שרוצה לשלב{" "}
              <span className="hint">תוכן שהלומדים יצפו / יקראו — שורה אחת לכל קישור</span>
            </label>
            <textarea
              className="links-field"
              name="material_links"
              value={form.material_links}
              onChange={onChange}
              placeholder={"https://www.youtube.com/watch?v=...\nhttps://docs.google.com/..."}
            />
            <div className="links-hint">
              💡 אין קישורים? השאר ריק — הכלי יציע תכנים רלוונטיים שהלומדים יוכלו לחפש בעצמם.
            </div>
          </div>
        </div>
      </div>

      {error && <div className="error-box">⚠️ {error}</div>}

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "מחולל לו״ז..." : "צור לו״ז"}
      </button>
    </form>
  );
}
