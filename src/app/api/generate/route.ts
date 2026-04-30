import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { ScheduleInput } from "@/types/schedule";

const client = new Anthropic();

const SYSTEM_PROMPT = `אתה מומחה בכיר לפיתוח הדרכה, עיצוב למידה וטכנולוגיות הוראה.
המומחיות שלך: בניית תוכניות הכשרה מקצועיות, למידה מרחוק, instructional design.

═══════════════════════════════════════
אופי הלו״ז: ימי למידה עצמאיים
═══════════════════════════════════════

הלו״ז מתייחס לימי למידה עצמאיים – הלומדים לומדים בקצב עצמם, לאו דווקא בכיתה עם מדריך.
כל "שיעור כפול" הוא בלוק של למידה עצמאית: קריאה, צפייה בסרטון, תרגיל, משימה, פרויקט וכד'.
אם התקבל בקשה לכלול מפגשי צוות – הוסף בלוקים מיוחדים של עבודה בצוות / דיון קבוצתי / סינכרוני (ציין זאת בבירור ב-topic ו-activity_type).

═══════════════════════════════════════
מבנה חובה: 4 שיעורים כפולים ביום
═══════════════════════════════════════

כל יום חייב להכיל בדיוק 4 שיעורים כפולים (כל שיעור = 90 דקות), פלוס הפסקות.
הפסק את היום כך (עם שעות התחלה וסיום שנתן המשתמש):

• שיעור כפול 1 – פתיחה ובניית בסיס (90 דק')
• הפסקה (15 דק')
• שיעור כפול 2 – העמקה ותרגול (90 דק')
• הפסקת צהריים (45 דק')
• שיעור כפול 3 – יישום ומקרי בוחן (90 דק')
• הפסקה (15 דק')
• שיעור כפול 4 – סיכום, רפלקציה, בדיקת הבנה (90 דק')

═══════════════════════════════════════
עקרונות פדגוגיים מחייבים
═══════════════════════════════════════

1. כל שיעור כפול מורכב מ-3 שלבים:
   - הכנה (10 דק'): הפעלה קוגניטיבית, שאלת פתיחה
   - גוף (65 דק'): תוכן + תרגול מיידי
   - סגירה (15 דק'): סיכום, שאלות, חיבור לשיעור הבא

2. גיוון חובה בין שיעורים:
   - שיעור 1: הרצאה + דיון
   - שיעור 2: תרגול + פעילות אינטראקטיבית
   - שיעור 3: יישום מעשי / מקרי בוחן
   - שיעור 4: סיכום + הערכה / משוב

3. בין ימים יש הדרגתיות: כל יום בונה על הקודם.

4. קישורים מסופקים: אם המשתמש מספק קישורים לחומרים, שלב אותם ישירות בשדות הרלוונטיים (equipment, instructor_notes, supplementary).

═══════════════════════════════════════
המלצות תוכן משלים – רמת מקצוענות
═══════════════════════════════════════

כשאתה מציע סרטונים ומאמרים – היה ספציפי:
- ציין שמות מרצים ידועים / ערוצים ידועים (TED, Coursera, Harvard Business Review, MIT OpenCourseWare וכו')
- ציין נושאים ספציפיים שניתן לחפש בגוגל/יוטיוב
- בפעילות: תן הנחיות ברות-ביצוע לחלוטין (לא גנריות)

═══════════════════════════════════════
פורמט JSON מחייב – ללא טקסט נוסף
═══════════════════════════════════════

{
  "rationale": "הסבר מפורט (3-4 משפטים) לבחירות הפדגוגיות המרכזיות",
  "days": [
    {
      "day": "יום 1 – [שם/תאריך]",
      "slots": [
        {
          "time": "09:00–10:30",
          "lesson_number": 1,
          "topic": "שם הנושא המדויק",
          "activity_type": "הרצאה|תרגול|דיון|הפסקה|סיכום|פעילות אינטראקטיבית",
          "equipment": "ציוד + קישורים רלוונטיים",
          "instructor_notes": "הוראות מפורטות למדריך – מה לעשות, איך, על מה לשים דגש"
        }
      ],
      "supplementary": {
        "video": {
          "title": "שם ספציפי של סרטון / ערוץ / הרצאה",
          "description": "מה ילמדו ממנו ומה לחפש"
        },
        "article": {
          "title": "שם מאמר / ספר / מדריך ספציפי",
          "description": "תיאור ומה לקרוא בו"
        },
        "activity": {
          "title": "שם הפעילות",
          "description": "הוראות מלאות וברות-ביצוע"
        }
      }
    }
  ],
  "whatsapp_message": "הודעת ווטסאפ מקצועית, ידידותית, עם אימוג׳ים, הכוללת את עיקרי הלו״ז",
  "questions": [
    "שאלה חדה ורלוונטית למשתמש על הלו״ז"
  ]
}`;

function buildUserPrompt(input: ScheduleInput): string {
  const zoomSection = input.zoom_morning || input.zoom_end
    ? `\nפרטי זום למפגשים סינכרוניים:\n${input.zoom_morning ? `- מפגש בוקר (שיעור כפול 1): ${input.zoom_morning}` : ""}${input.zoom_end ? `\n- מפגש סיום יום (שיעור כפול 4): ${input.zoom_end}` : ""}\nהוסף את פרטי הזום הרלוונטיים בשדה instructor_notes של השיעורים המתאימים.`
    : "";

  const linksSection = input.material_links?.trim()
    ? `\nקישורים לחומרים שרוצים לשלב:\n${input.material_links}\n(שלב קישורים אלה ישירות בשדות equipment ו-instructor_notes של הסלוטים הרלוונטיים, וציין אותם גם בתוכן המשלים)`
    : "\nקישורים: לא סופקו – הצע חומרים ספציפיים שניתן למצוא ביוטיוב / גוגל";

  const teamSessionsNote = input.include_team_sessions === "yes"
    ? "כלול מפגשי צוות / עבודה בצוותים / דיון קבוצתי בחלק מהבלוקים."
    : "ימי למידה עצמאיים בלבד – אין מפגשי צוות.";

  return `בנה לו״ז שבועי מקצועי של ${input.days} ימים, עם בדיוק 4 שיעורים כפולים (90 דק' כל אחד) ביום.
הלו״ז מיועד ללמידה עצמאית. ${teamSessionsNote}

מטרות ההדרכה:
${input.goals}

שעות פעילות: ${input.start_time}–${input.end_time}

אילוצים:
${input.constraints || "אין אילוצים מיוחדים"}

דגשים נוספים:
${input.notes || "אין"}

העדפות שיטה / עיצוב:
${input.preferences || "אין"}

הדבר הכי חשוב בלו״ז הזה:
${input.most_important || "לא צוין"}
${zoomSection}
${linksSection}

זכור: בדיוק 4 שיעורים כפולים (lesson_number: 1–4) ביום + הפסקות. החזר JSON בלבד.`;
}

export async function POST(req: NextRequest) {
  try {
    const input: ScheduleInput = await req.json();

    if (!input.goals || !input.days || !input.start_time || !input.end_time) {
      return NextResponse.json(
        { error: "חסרים שדות חובה: מטרות, ימים, שעות" },
        { status: 400 }
      );
    }

    if (input.days < 1 || input.days > 30) {
      return NextResponse.json(
        { error: "מספר הימים חייב להיות בין 1 ל-30" },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 12000,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: buildUserPrompt(input),
        },
      ],
    });

    const usage = message.usage as Record<string, number>;
    const cacheHit = (usage.cache_read_input_tokens ?? 0) > 0;
    console.log(
      `[generate] tokens – input: ${usage.input_tokens}, cache_read: ${usage.cache_read_input_tokens ?? 0}, cache_create: ${usage.cache_creation_input_tokens ?? 0}, output: ${usage.output_tokens} | cache ${cacheHit ? "HIT" : "MISS"}`
    );

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
