"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarDays, MessageSquare, GraduationCap, Zap, ArrowDown } from "lucide-react";
import type { ScheduleResult } from "@/types/schedule";
import { generateHtml } from "@/lib/generate-html";
import { ScheduleForm, type FormState } from "@/components/ScheduleForm";
import { ScheduleResultPanel } from "@/components/ScheduleResult";

function scheduleFilename(): string {
  const now = new Date();
  const ts = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  return `luz-${ts}.html`;
}

function parseScheduleJson(text: string): ScheduleResult {
  const trimmed = text.trim();
  if (trimmed.startsWith("ERROR:")) {
    throw new Error(trimmed.slice(6).trim() || "שגיאה בשרת");
  }
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      throw new Error("תגובה לא תקינה מהשרת");
    }
    return JSON.parse(trimmed.slice(start, end + 1));
  }
}

function buildZoomSessionsString(meetingId: string, times: string): string {
  if (!meetingId.trim() || !times.trim()) return "";
  return times
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => `${t} – https://zoom.us/j/${meetingId.trim()}`)
    .join("\n");
}

const INITIAL_FORM: FormState = {
  goals: "",
  days: "1",
  start_time: "09:00",
  end_time: "17:00",
  content_type: "topic",
  courseUrl: "",
  myContentDescription: "",
  previous_days: "",
  zoomEnabled: false,
  zoomMeetingId: "",
  zoomTimes: "",
  constraints: "",
  material_links: "",
};

export default function HomePage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<ScheduleResult | null>(null);
  const [editableHtml, setEditableHtml] = useState("");
  const [editableWhatsapp, setEditableWhatsapp] = useState("");
  const [shareNotice, setShareNotice] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) loadingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [loading]);

  useEffect(() => {
    if (result) {
      const zoomStr = form.zoomEnabled
        ? buildZoomSessionsString(form.zoomMeetingId, form.zoomTimes)
        : "";
      setEditableHtml(generateHtml(result, { sessions: zoomStr || undefined }));
    }
  }, [result, form.zoomEnabled, form.zoomMeetingId, form.zoomTimes]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function runGenerate(refinement_qa?: { question: string; answer: string }[]) {
    setError("");
    setResult(null);
    setStreamingText("");
    setLoading(true);

    try {
      const zoomStr = form.zoomEnabled
        ? buildZoomSessionsString(form.zoomMeetingId, form.zoomTimes)
        : "";

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          days: Number(form.days),
          include_team_sessions: form.zoomEnabled ? "yes" : "no",
          zoom_sessions: zoomStr,
          course_url: form.content_type === "course" ? form.courseUrl : undefined,
          my_content_description: form.content_type === "my_content" ? form.myContentDescription : undefined,
          refinement_qa,
        }),
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

      let scheduleData: ScheduleResult;
      try {
        scheduleData = parseScheduleJson(accumulated);
      } catch (err) {
        setError(err instanceof Error ? err.message : "שגיאה ביצירת הלו״ז – אנא נסה שוב");
        return;
      }

      setResult(scheduleData);
      setEditableWhatsapp(scheduleData.whatsapp_message || "");
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
    if (form.end_time <= form.start_time) {
      setError("שעת הסיום חייבת להיות אחרי שעת ההתחלה");
      return;
    }
    await runGenerate();
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

  const zoomSessionsString = form.zoomEnabled
    ? buildZoomSessionsString(form.zoomMeetingId, form.zoomTimes)
    : "";

  return (
    <div className="page-wrapper">
      <header className="site-header">
        <div className="hero-badge"><Zap size={13} strokeWidth={2.5} /> לו״ז מלא תוך 3 דקות</div>
        <div className="logo">
          <span className="logo-mark">✦</span>
          Luz Creator
        </div>
        <p className="hero-tagline">
          תכננו יום למידה מרחוק <em>בלי להשקיע שעות</em>
        </p>
        <div className="hero-cards">
          <div className="hero-card"><CalendarDays size={18} strokeWidth={1.8} /><span>לו״ז יומי מלא</span></div>
          <div className="hero-card"><MessageSquare size={18} strokeWidth={1.8} /><span>הודעה מלווה</span></div>
          <div className="hero-card"><GraduationCap size={18} strokeWidth={1.8} /><span>מבוסס פדגוגיה</span></div>
        </div>
        <button
          type="button"
          className="hero-cta"
          onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
        >
          בואו נתחיל <ArrowDown size={15} strokeWidth={2} />
        </button>
      </header>

      <div ref={formRef}>
        <ScheduleForm
          form={form}
          loading={loading}
          error={error}
          onChange={handleChange}
          onContentTypeChange={(value) => setForm((prev) => ({ ...prev, content_type: value }))}
          onGoalsChange={(goals) => setForm((prev) => ({ ...prev, goals }))}
          onZoomEnabledChange={(enabled) => setForm((prev) => ({ ...prev, zoomEnabled: enabled }))}
          onSubmit={handleSubmit}
        />
      </div>

      {/* Loading state */}
      {loading && (() => {
        const len = streamingText.length;
        const stageIndex =
          len === 0 ? 0 :
          len < 1500 ? 1 :
          len < 4000 ? 2 :
          len < 7000 ? 3 : 4;
        const steps = [
          "ניתוח מטרות ההדרכה",
          "בניית מבנה הלו״ז",
          "הכנת הנחיות ללומדים",
          "הכנת הודעת WhatsApp",
          "עיבוד סופי",
        ];
        return (
          <div ref={loadingRef} className="loading-card">
            <span className="spinner spinner-brand" />
            <div className="loading-text">
              <strong>בונה את הלו״ז שלך — שלב {stageIndex + 1} מתוך {steps.length}</strong>
              <div className="loading-steps">
                {steps.map((label, i) => {
                  const state = i < stageIndex ? "done" : i === stageIndex ? "active" : "pending";
                  return (
                    <div key={i} className={`loading-step loading-step-${state}`}>
                      <span className="loading-step-icon">
                        {state === "done" ? "✓" : state === "active" ? <span className="spinner spinner-step" /> : "○"}
                      </span>
                      <span>{label}{state === "active" ? "..." : ""}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {result && (
        <div ref={resultRef}>
          <ScheduleResultPanel
            result={result}
            editableHtml={editableHtml}
            editableWhatsapp={editableWhatsapp}
            zoomSessions={zoomSessionsString}
            loading={loading}
            shareNotice={shareNotice}
            onReset={() => {
              setResult(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onResultChange={(r) => {
              setResult(r);
            }}
            onWhatsappChange={setEditableWhatsapp}
            onRefine={runGenerate}
            onDownload={downloadHtml}
            onShare={shareSchedule}
          />
        </div>
      )}

      <footer className="site-footer">
        <p>הכלי עבד לך? יש רעיון שישפר אותו? <a href="mailto:ruthy.salomon@gmail.com">ruthy.salomon@gmail.com</a></p>
      </footer>
    </div>
  );
}
