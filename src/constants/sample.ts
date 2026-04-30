import type { ScheduleResult } from "@/types/schedule";

export const ACTIVITY_BADGE: Record<string, string> = {
  "הרצאה": "badge-lecture",
  "תרגול": "badge-practice",
  "דיון": "badge-discussion",
  "הפסקה": "badge-break",
  "סיכום": "badge-summary",
  "פעילות אינטראקטיבית": "badge-activity",
};

export function getBadgeClass(type: string): string {
  for (const key of Object.keys(ACTIVITY_BADGE)) {
    if (type.includes(key)) return ACTIVITY_BADGE[key];
  }
  return "badge-lecture";
}

export const SAMPLE_RESULT: ScheduleResult = {
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

export const TABS = [
  { id: "distribution", label: 'לו"ז להפצה' },
  { id: "whatsapp", label: "הודעת ווטסאפ" },
  { id: "questions", label: "שאלות ומשוב" },
] as const;
