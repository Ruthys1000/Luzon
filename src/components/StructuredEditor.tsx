"use client";

import type { SlotData, ScheduleResult } from "@/types/schedule";

interface StructuredEditorProps {
  draftResult: ScheduleResult;
  onChange: (updated: ScheduleResult) => void;
}

export function StructuredEditor({ draftResult, onChange }: StructuredEditorProps) {
  function updateSlot(di: number, si: number, field: keyof SlotData, value: string) {
    onChange({
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

  function updateSupp(
    di: number,
    type: "video" | "article" | "activity",
    field: "title" | "description",
    value: string
  ) {
    onChange({
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
    <div className="structured-editor">
      <div className="field">
        <label>נימוק פדגוגי</label>
        <textarea
          value={draftResult.rationale}
          onChange={(e) => onChange({ ...draftResult, rationale: e.target.value })}
        />
      </div>

      {draftResult.days.map((day, di) => (
        <div key={di} className="editor-day">
          <div className="editor-day-header">
            <input
              type="text"
              className="editor-day-name"
              value={day.day}
              onChange={(e) =>
                onChange({
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
                    type="text"
                    value={slot.topic}
                    onChange={(e) => updateSlot(di, si, "topic", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>סוג פעילות</label>
                  <select
                    value={slot.activity_type}
                    onChange={(e) => updateSlot(di, si, "activity_type", e.target.value)}
                  >
                    {["הרצאה", "תרגול", "דיון", "הפסקה", "סיכום", "פעילות אינטראקטיבית"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="field editor-slot-full">
                  <label>הנחייה ללומד</label>
                  <textarea
                    className="editor-notes-textarea"
                    value={slot.instructor_notes}
                    onChange={(e) => updateSlot(di, si, "instructor_notes", e.target.value)}
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
                      type="text"
                      value={day.supplementary[type].title}
                      onChange={(e) => updateSupp(di, type, "title", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>תיאור</label>
                    <textarea
                      className="editor-supp-textarea"
                      value={day.supplementary[type].description}
                      onChange={(e) => updateSupp(di, type, "description", e.target.value)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
