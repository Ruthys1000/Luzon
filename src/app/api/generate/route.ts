import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const SYSTEM_PROMPT = `אתה מומחה לפיתוח הדרכה ולתכנון למידה מרחוק.

המטרה שלך היא לבנות לו״ז שבועי מקצועי, מאוזן פדגוגית, פרקטי ליישום, ומוכן לשיתוף עם לומדים.

עליך:
1. להקפיד על עקרונות פדגוגיים
2. לאזן עומס קוגניטיבי
3. לשלב מגוון שיטות הוראה
4. להציע תוכן משלים איכותי ורלוונטי
5. להציג את התוצאה בצורה ברורה, נקייה ומעשית

חוקים פדגוגיים:
1. פיזור עומסים:
   - אל תשים שתי פעילויות כבדות ברצף
   - גוון בין הרצאה, תרגול, דיון ופעילות אינטראקטיבית

2. הפסקות:
   - כל 90 דקות יש לשלב הפסקה של 15 דקות
   - יש לשלב הפסקת צהריים של 45–60 דקות

3. מבנה יום:
   - פתיחה קלה (היכרות / סקירה / icebreaker)
   - אמצע עם עומס עיקרי
   - סיום עם סיכום / תרגול / רפלקציה

4. אילוצים:
   - שלב הרצאות חובה בזמנים הגיוניים
   - הימנע משיבוץ תוכן מורכב בסוף יום עמוס

5. התאמה לקהל:
   - התאם את רמת הפעילויות לרקע הלומדים

החזר את התשובה בפורמט JSON בדיוק לפי המבנה הבא – ללא טקסט נוסף לפני או אחרי:

{
  "rationale": "הסבר קצר (2-3 שורות) למה בנית את הלו״ז בצורה הזו",
  "days": [
    {
      "day": "יום 1 – שם יום / תאריך",
      "slots": [
        {
          "time": "09:00–09:30",
          "topic": "שם הנושא",
          "activity_type": "הרצאה|תרגול|דיון|הפסקה|סיכום|פעילות אינטראקטיבית",
          "equipment": "ציוד נדרש",
          "instructor_notes": "דגשים למדריך"
        }
      ],
      "supplementary": {
        "video": { "title": "כותרת סרטון", "description": "תיאור קצר" },
        "article": { "title": "כותרת מאמר/מדריך", "description": "תיאור קצר" },
        "activity": { "title": "שם הפעילות", "description": "הוראות קצרות" }
      }
    }
  ],
  "whatsapp_message": "הודעת ווטסאפ מעוצבת עם אימוג׳ים",
  "questions": [
    "שאלה 1 למשתמש",
    "שאלה 2 למשתמש",
    "שאלה 3 למשתמש"
  ]
}`;

function buildUserPrompt(input: ScheduleInput): string {
  return `בנה לי לו״ז שבועי ללמידה מרחוק לפי הנתונים הבאים:

קהל יעד:
${input.target_audience}

מטרות ההדרכה:
${input.goals}

משך:
${input.days} ימים

שעות פעילות:
${input.start_time} - ${input.end_time}

אילוצים:
${input.constraints || "אין אילוצים מיוחדים"}

דגשים נוספים:
${input.notes || "אין"}

העדפות (אם יש):
${input.preferences || "אין"}

הדבר הכי חשוב בלו״ז הזה:
${input.most_important || "לא צוין"}

החזר JSON בלבד לפי הפורמט שקיבלת.`;
}

interface ScheduleInput {
  target_audience: string;
  goals: string;
  days: number;
  start_time: string;
  end_time: string;
  constraints?: string;
  notes?: string;
  preferences?: string;
  most_important?: string;
}

export async function POST(req: NextRequest) {
  try {
    const input: ScheduleInput = await req.json();

    if (!input.target_audience || !input.goals || !input.days || !input.start_time || !input.end_time) {
      return NextResponse.json(
        { error: "חסרים שדות חובה: קהל יעד, מטרות, ימים, שעות" },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildUserPrompt(input),
        },
      ],
    });

    const rawText = message.content[0].type === "text" ? message.content[0].text : "";

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "התגובה מהמודל אינה JSON תקין", raw: rawText },
        { status: 500 }
      );
    }

    const scheduleData = JSON.parse(jsonMatch[0]);
    return NextResponse.json(scheduleData);
  } catch (err) {
    const message = err instanceof Error ? err.message : "שגיאה לא ידועה";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
