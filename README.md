# Luz Creator ✦

> מחולל לו״ז הדרכה מקצועי מבוסס AI — מהטופס לווטסאפ, תוך דקות

מנהל הדרכה מזין נושא, שעות ואילוצים — ומקבל לו״ז יומי מפורט ללמידה עצמאית, הודעת WhatsApp מוכנה, וקובץ HTML להורדה ושיתוף.

**[luzon-ruthys.vercel.app](https://luzon-ruthys.vercel.app)**

---

## מה הכלי עושה

Luz Creator בונה ימי הדרכה עצמאיים עבור לומדים שעובדים בקצב שלהם, ללא מדריך מלווה בזמן אמת. המנהל מגדיר את המסגרת — ה-AI בונה את הלו״ז, כולל הנחיות ישירות ללומד, תוכן משלים, והודעה מוכנה לשליחה.

**מבנה יום:** 4 בלוקים של 90 דקות + הפסקות, מותאמים לשעות הפעילות שנבחרו.

---

## תכונות

### טופס חכם
- **3 מצבי תוכן** — נושא בלבד (ה-AI בונה הכל), קורס מוכן (Coursera / Udemy / LinkedIn Learning), או תוכן אישי (סרטונים / מצגות / מסמכים)
- **נושאים מהירים** — ניהול צוות, ניהול זמן, שירות לקוחות, תקשורת בינאישית, כלים דיגיטליים
- **זום** — מספר חדר + שעות; הקישור נבנה אוטומטית
- **המשכיות** — שדה "מה כיסינו בימים קודמים" לסדרות הדרכה
- **אילוצים** — שעות קבועות, אירועים מחייבים, מגבלות טכניות

### לו״ז שנוצר
- Streaming בזמן אמת — הלו״ז נבנה בפניך תוך כדי יצירה
- כל בלוק: שעה, נושא, סוג פעילות (הרצאה / תרגול / דיון / סיכום...), הנחייה ישירה ללומד
- תוכן משלים לכל יום — סרטון, מאמר, פעילות — עם קישורי חיפוש אוטומטיים ב-YouTube ו-Google
- באנר זום כחול עם קישורים לחיצים
- הסבר פדגוגי מתקפל ("למה הלו״ז בנוי כך?")

### עריכה ושיתוף
- **עורך מובנה** — עריכת נושאים, הנחיות ותוכן משלים לפני שיתוף
- **שיפור מונחה** — 2–3 שאלות מובנות לדיוק הלו״ז ויצירה מחדש
- **הודעת WhatsApp** — נוצרת אוטומטית, ניתנת לעריכה ולשליחה ישירה
- **קובץ HTML** — עצמאי, mobile-ready, להורדה ושיתוף דרך WhatsApp

---

## זרימת שימוש

```
1. מלא נושא + שעות + (אופציונלי) זום / אילוצים / קישורים
          ↓
2. לחץ "צור לו״ז" — streaming בזמן אמת
          ↓
3. קבל לו״ז מלא עם הנחיות ותוכן משלים
          ↓
4. ערוך אם צריך / ענה על שאלות לשיפור
          ↓
5. שלח הודעת WhatsApp ללומדים
          ↓
6. שתף את קובץ הלו״ז המלא
```

---

## טכנולוגיות

| שכבה | טכנולוגיה |
|------|-----------|
| Framework | Next.js 15 (App Router) |
| AI | Anthropic Claude `claude-sonnet-4-6` |
| Streaming | `ReadableStream` + `messages.stream()` |
| Prompt caching | `cache_control: ephemeral` על system prompt |
| פונטים | Heebo via `next/font/google` |
| סגנון | CSS גלובלי — RTL, mobile-first, ללא תלויות UI |
| שפה | TypeScript strict |

---

## מבנה הפרויקט

```
src/
├── app/
│   ├── page.tsx                  # ממשק ראשי — state, streaming, sharing
│   ├── layout.tsx                # Heebo font + metadata
│   ├── globals.css               # כל העיצוב — RTL, responsive, design tokens
│   └── api/generate/
│       └── route.ts              # POST endpoint — rate limiting, Claude streaming
├── components/
│   ├── ScheduleForm.tsx          # טופס הזנה עם שדות מותנים לפי סוג תוכן
│   ├── ScheduleResult.tsx        # תצוגת תוצאה — טבלה, WhatsApp, שיתוף
│   └── StructuredEditor.tsx      # עריכה מובנית של הלו״ז שנוצר
├── types/
│   └── schedule.ts               # ממשקי TypeScript משותפים
├── constants/
│   └── sample.ts                 # ACTIVITY_BADGE, QUICK_STARTERS
└── lib/
    ├── generate-html.ts          # יצירת קובץ HTML להורדה
    └── linkify.ts                # זיהוי URL-ים + טיפול מיוחד בקישורי Zoom
```

---

## התקנה

```bash
git clone https://github.com/Ruthys1000/Luzon.git
cd Luzon
npm install
```

צור קובץ `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

הרצה מקומית:
```bash
npm run dev
# http://localhost:3000
```

---

## משתני סביבה

| משתנה | תיאור |
|-------|-------|
| `ANTHROPIC_API_KEY` | מפתח API של Anthropic — [console.anthropic.com](https://console.anthropic.com) |

---

## פרטים טכניים

**Rate limiting** — 5 בקשות לדקה לכל IP (in-memory).

**Prompt caching** — ה-system prompt נשמר ב-cache (`ephemeral`) לחיסכון בעלות ובזמן תגובה.

**פורמט פלט** — Claude מחזיר JSON בלבד לפי schema קשיח. הלקוח מפרסר בזמן אמת עם fallback לחיתוך `{ ... }`.

**קובץ HTML** — CSS מוטמע, RTL, תומך מובייל — עובד ללא חיבור לאינטרנט לאחר הורדה.

---

## רישיון

MIT — [ruthy.salomon@gmail.com](mailto:ruthy.salomon@gmail.com)
