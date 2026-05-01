"use client";

import { QUICK_STARTERS } from "@/constants/sample";

export interface FormState {
  goals: string;
  days: string;
  start_time: string;
  end_time: string;
  content_type: "topic" | "course" | "my_content";
  previous_days: string;
  include_team_sessions: string;
  zoom_sessions: string;
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
  onSubmit: (e: React.FormEvent) => void;
}

export function ScheduleForm({
  form,
  loading,
  error,
  onChange,
  onContentTypeChange,
  onGoalsChange,
  onSubmit,
}: ScheduleFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="card">
        <div className="card-title">פרטי ההדרכה</div>
        <div className="form-grid">
          <div className="field full">
            <label>נושא ומטרות יום ההדרכה <span className="hint">בחר נושא מהיר למטה, או כתוב בעצמך</span></label>
            <div className="quick-starters">
              {QUICK_STARTERS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  className="quick-starter-chip"
                  aria-label={`בחר נושא: ${s.label}`}
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
              placeholder="לדוגמה: ניהול עצמי בלמידה מרחוק — הלומדים יצאו עם כלים מעשיים לתכנון יום עצמאי, זיהוי גורמי הסחה ובניית שגרת למידה"
              required
            />
          </div>
          <div className="field full">
            <label>מה יש לך? <span className="hint">בחר את סוג הבסיס ללו״ז</span></label>
            <div className="content-type-chips">
              {([
                { value: "topic", label: "נושא בלבד", desc: "אין חומרים – הכלי יבנה הכל לפי הנושא" },
                { value: "course", label: "קורס מוכן", desc: "Coursera / Udemy / LinkedIn Learning" },
                { value: "my_content", label: "תוכן שלי", desc: "הסרטונים / מצגות / מסמכים שלי" },
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
          <div className="field">
            <label>מספר ימים <span className="hint">*חובה — בדרך כלל: 1</span></label>
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
            <label>שעת התחלה <span className="hint">שעות הלומד בבית</span></label>
            <input type="time" name="start_time" value={form.start_time} onChange={onChange} />
          </div>
          <div className="field">
            <label>שעת סיום</label>
            <input type="time" name="end_time" value={form.end_time} onChange={onChange} />
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
            <label>האם יש מפגשי זום עם הלומדים?</label>
            <select name="include_team_sessions" value={form.include_team_sessions} onChange={onChange}>
              <option value="yes">כן – יש זום בפתיחה ו/או סגירת יום</option>
              <option value="no">לא – למידה עצמאית בלבד, ללא פגישות</option>
            </select>
          </div>
          {form.include_team_sessions === "yes" && (
            <div className="field full">
              <label>🔵 מפגשי זום <span className="hint">שורה לכל מפגש — שעה + קישור</span></label>
              <textarea
                name="zoom_sessions"
                value={form.zoom_sessions}
                onChange={onChange}
                placeholder={"09:00 – https://zoom.us/j/...\n13:00 – https://zoom.us/j/..."}
              />
            </div>
          )}
          <div className="field full">
            <label>אילוצים <span className="hint">הרצאות חובה, מגבלות טכניות וכו׳</span></label>
            <textarea
              name="constraints"
              value={form.constraints}
              onChange={onChange}
              placeholder="לדוגמה: פגישת צוות בשעה 11:00; הרצאת אורח בשעה 14:00; יום קצר – מסיימים ב-15:00"
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
