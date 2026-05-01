export const ACTIVITY_BADGE: Record<string, string> = {
  "הרצאה": "badge-lecture",
  "תרגול": "badge-practice",
  "דיון": "badge-discussion",
  "הפסקה": "badge-break",
  "סיכום": "badge-summary",
  "פעילות אינטראקטיבית": "badge-activity",
};

export function getBadgeClass(type: string): string {
  return ACTIVITY_BADGE[type] ?? "badge-lecture";
}


export const QUICK_STARTERS: { label: string; goals: string }[] = [
  {
    label: "ניהול צוות",
    goals: "פיתוח מיומנויות ניהול צוות: תכנון ומעקב אחר משימות, תקשורת אפקטיבית עם הצוות, מתן משוב בונה ותמיכה בצמיחה מקצועית של העובדים",
  },
  {
    label: "Excel / Office",
    goals: "שיפור מיומנויות Excel ו-Office: נוסחאות מתקדמות, טבלאות ציר, עיצוב דוחות מקצועיים ושיתוף עבודה ב-SharePoint",
  },
  {
    label: "שירות לקוחות",
    goals: "שדרוג מיומנויות שירות לקוחות: הקשבה פעילה, טיפול בהתנגדויות ובלקוחות מאתגרים, פתרון בעיות יצירתי ויצירת חוויית לקוח מצוינת",
  },
  {
    label: "תקשורת בינאישית",
    goals: "חיזוק מיומנויות תקשורת בינאישית: שפת גוף, ניהול שיחות קשות, הצגת רעיונות בביטחון ובניית אמון עם עמיתים וממשקים",
  },
  {
    label: "כלים דיגיטליים",
    goals: "שימוש יעיל בכלים דיגיטליים לעבודה מרחוק: Teams/Zoom, ניהול משימות ב-Trello או Monday, שיתוף קבצים ושיתוף פעולה מקוון",
  },
];
