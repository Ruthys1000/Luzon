# Luz Creator ✦

**מחולל לו״ז הדרכה מקצועי מבוסס AI**

Luz Creator מייצר לו״ז שבועי מפורט ללמידה עצמאית — בלחיצה אחת. מזינים מטרות, ימים ושעות, ומקבלים לו״ז עם 4 בלוקי למידה ביום, הנחיות ללומד, ותוכן משלים — מוכן לשיתוף.

---

## תכונות עיקריות

- **לו״ז מותאם אישית** — 1–7 ימים, שעות גמישות, אפשרות למפגשי צוות
- **Streaming בזמן אמת** — הלו״ז נבנה בפניך תוך כדי יצירה
- **תצוגה מסודרת** — טבלה עם מספרי שיעור, סוג פעילות, הנחיה ללומד
- **תוכן משלים** — סרטון, מאמר ופעילות לכל יום עם קישורי חיפוש אוטומטיים
- **קישורים לחיצים** — URL-ים מתוך החומרים שלך הופכים אוטומטית לקישורים
- **פרטי זום** — קוד/קישור Zoom מוצג בלו״ז כשמוזן בטופס
- **הורדה ושיתוף** — קובץ HTML עצמאי עם שם מבוסס תאריך ושעה (`luz-YYYYMMDD-HHmm.html`)
- **עורך מובנה** — עריכת נושאים, הנחיות ותוכן משלים לפני שמירה
- **הודעת WhatsApp** — נוצרת אוטומטית לסיכום יום ההדרכה
- **שאלות ומשוב** — שאלות מובנות לדיוק הלו״ז

---

## טכנולוגיות

| שכבה | טכנולוגיה |
|------|-----------|
| Framework | Next.js 15 (App Router) |
| AI | Anthropic Claude (`claude-sonnet-4-6`) |
| Streaming | `ReadableStream` + `messages.stream()` |
| Prompt caching | `cache_control: ephemeral` על system prompt |
| פונטים | `next/font/google` — Heebo, ללא CDN חיצוני |
| סגנון | CSS Modules + globals (RTL, mobile-first) |
| שפה | TypeScript strict |

---

## מבנה הפרויקט

```
src/
├── app/
│   ├── page.tsx              # ממשק ראשי (טופס + תוצאה)
│   ├── layout.tsx            # Heebo font + metadata
│   ├── globals.css           # עיצוב גלובלי, RTL, responsive
│   └── api/generate/
│       └── route.ts          # API route — streaming + prompt caching
├── types/
│   └── schedule.ts           # טיפוסי TypeScript משותפים
├── constants/
│   └── sample.ts             # ACTIVITY_BADGE, getBadgeClass, TABS
└── lib/
    └── generate-html.ts      # יצירת HTML להורדה + linkify
```

---

## התקנה והרצה

```bash
# שכפול
git clone https://github.com/Ruthys1000/Luzon.git
cd Luzon

# התקנת תלויות
npm install

# הגדרת משתני סביבה
cp .env.local.example .env.local
# ערוך את .env.local והוסף:
# ANTHROPIC_API_KEY=sk-ant-...

# הרצה מקומית
npm run dev
```

פתח את [http://localhost:3000](http://localhost:3000)

---

## משתני סביבה

| משתנה | תיאור |
|-------|-------|
| `ANTHROPIC_API_KEY` | מפתח API של Anthropic (חובה) |

---

## שימוש

1. הזן את **מטרות ההדרכה** (חובה)
2. בחר **מספר ימים** ו**שעות פעילות**
3. הוסף אופציונלית: פרטי Zoom, אילוצים, דגשים, קישורים לחומרים
4. לחץ **צור לו״ז** — הלו״ז נבנה בזמן אמת
5. ערוך, הורד HTML, או שתף ישירות מהמכשיר

---

## רישיון

MIT
