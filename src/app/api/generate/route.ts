import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { ScheduleInput } from "@/types/schedule";

const client = new Anthropic();

const SYSTEM_PROMPT = `אתה מומחה בכיר לפיתוח הדרכה, עיצוב למידה וטכנולוגיות הוראה.
המומחיות שלך: בניית תוכניות הכשרה מקצועיות, למידה מרחוק, instructional design.

═══════════════════════════════════════
אופי הלו״ז: ימי למידה עצמאיים
═══════════════════════════════════════

הלו״ז מיועד ללומדים עצמאיים – כל אחד לומד בקצב שלו, ללא מדריך מלווה.
כל בלוק הוא פעילות עצמאית: קריאה, צפייה, תרגיל, משימה, פרויקט.
אם ביקשו מפגשי צוות – הוסף בלוקים סינכרוניים (ציין ב-topic ו-activity_type).

מבנה יום: 4 בלוקים של 90 דקות + הפסקות (לפי שעות שנבחרו):
• בלוק 1 – פתיחה ובסיס | הפסקה 15 דק'
• בלוק 2 – העמקה ותרגול | הפסקת צהריים 45 דק'
• בלוק 3 – יישום | הפסקה 15 דק'
• בלוק 4 – סיכום ורפלקציה

═══════════════════════════════════════
שדה instructor_notes – הנחייה ללומד
═══════════════════════════════════════

CRITICAL: שדה זה מכוון ישירות ללומד, לא למדריך.
כתוב משפט או שניים שמסבירים ללומד מה לעשות בבלוק זה.
דוגמאות טובות:
• "קרא את הפרק ורשום 3 תובנות אישיות"
• "צפה בסרטון (קישור בציוד) ומלא את דף הרפלקציה"
• "בחר מקרה מהעבודה שלך ונתח אותו לפי המודל שלמדת"
אל תכתוב: מה המדריך ישאל, איך לנהל את השיעור, סדר הפגישה.

═══════════════════════════════════════
תוכן משלים – היה ספציפי
═══════════════════════════════════════

סרטונים/מאמרים: ציין שמות ספציפיים (TED, HBR, Coursera וכו') שניתן לחפש בגוגל.
פעילות: הנחיה אחת ברורה שהלומד יכול לבצע לבד.

═══════════════════════════════════════
פורמט JSON מחייב – ללא טקסט נוסף
═══════════════════════════════════════

{
  "rationale": "2-3 משפטים על הלוגיקה הפדגוגית של הלו״ז",
  "days": [
    {
      "day": "יום 1 – [שם הנושא]",
      "slots": [
        {
          "time": "09:00–10:30",
          "lesson_number": 1,
          "topic": "שם הנושא",
          "activity_type": "הרצאה|תרגול|דיון|הפסקה|סיכום|פעילות אינטראקטיבית",
          "instructor_notes": "הנחייה קצרה ללומד – מה לעשות בבלוק זה (1-2 משפטים). כלול קישורים ישירות כאן אם סופקו."
        }
      ],
      "supplementary": {
        "video": { "title": "שם ספציפי", "description": "מה לחפש ולמה שווה לצפות" },
        "article": { "title": "שם ספציפי", "description": "מה לקרוא ומה לקחת ממנו" },
        "activity": { "title": "שם הפעילות", "description": "הוראה אחת ברורה לביצוע" }
      }
    }
  ],
  "whatsapp_message": "הודעת ווטסאפ קצרה וידידותית עם עיקרי הלו״ז",
  "questions": [
    "שאלה 1 שתעזור לדייק את הלו״ז",
    "שאלה 2 שתעזור לדייק את הלו״ז"
  ]
}`;

function buildUserPrompt(input: ScheduleInput): string {
  const zoomSection = input.zoom_sessions?.trim()
    ? `\nמפגשי זום (הוסף לשדה instructor_notes של השיעורים הרלוונטיים לפי השעות):\n${input.zoom_sessions}`
    : "";

  const linksSection = input.material_links?.trim()
    ? `\nקישורים לחומרים שרוצים לשלב:\n${input.material_links}\nחשוב מאוד: כתוב את כתובת ה-URL המלאה (https://...) ישירות בתוך טקסט instructor_notes — לא בסוגריים, לא כהפניה, אלא כחלק מהמשפט. לדוגמה: "צפה בסרטון: https://youtube.com/..." — הדבר הזה קריטי לחוויית הלומד.`
    : "\nקישורים: לא סופקו – הצע שמות ספציפיים של סרטונים/מאמרים שניתן לחפש ביוטיוב / גוגל.";

  const teamSessionsNote = input.include_team_sessions === "yes"
    ? "כלול מפגשי צוות / עבודה בצוותים / דיון קבוצתי בחלק מהבלוקים."
    : "ימי למידה עצמאיים בלבד – אין מפגשי צוות.";

  const contentTypeNote =
    input.content_type === "course"
      ? "\nסוג תוכן: קורס ספציפי (Coursera / Udemy / LinkedIn Learning). בנה את הלו״ז סביב מבנה הקורס — לפי פרקים/מודולים. בכל בלוק ציין מה הלומד צופה/קורא בקורס, ובשדה instructor_notes הכוון לפרק/מודול הספציפי."
      : input.content_type === "my_content"
      ? "\nסוג תוכן: תוכן מותאם אישית של המדריך (סרטונים / מצגות / מסמכים). הקישורים שסופקו הם חומרי הליבה — בנה כל בלוק סביבם ישירות, ציין אותם ב-instructor_notes."
      : "";

  const previousDaysSection = input.previous_days?.trim()
    ? `\nהמשכיות — מה כבר למדנו:\n${input.previous_days}\nחשוב: אל תחזור על נושאים שכבר כוסו. המשך מאיפה שעצרנו.`
    : "";

  const refinementSection =
    input.refinement_qa && input.refinement_qa.length > 0
      ? `\n\nשיפורים מבוקשים — ענה על השאלות הבאות בלו״ז החדש:\n${input.refinement_qa
          .filter((qa) => qa.answer.trim())
          .map((qa) => `- שאלה: ${qa.question}\n  תשובה: ${qa.answer}`)
          .join("\n")}\n\nבנה לו״ז חדש ומשופר שמשקף את התשובות לעיל.`
      : "";

  return `בנה לו״ז שבועי מקצועי של ${input.days} ימים, עם בדיוק 4 שיעורים כפולים (90 דק' כל אחד) ביום.
הלו״ז מיועד ללמידה עצמאית. ${teamSessionsNote}
${contentTypeNote}
מטרות ההדרכה:
${input.goals}

שעות פעילות: ${input.start_time}–${input.end_time}

אילוצים:
${input.constraints || "אין אילוצים מיוחדים"}
${previousDaysSection}
${zoomSection}
${linksSection}
${refinementSection}

זכור: בדיוק 4 שיעורים כפולים (lesson_number: 1–4) ביום + הפסקות. החזר JSON בלבד.`;
}

export async function POST(req: NextRequest) {
  let input: ScheduleInput;
  try {
    input = await req.json();
  } catch {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }

  if (!input.goals?.trim() || !input.days || !input.start_time || !input.end_time) {
    return NextResponse.json(
      { error: "חסרים שדות חובה: מטרות, ימים, שעות" },
      { status: 400 }
    );
  }

  if (input.days < 1 || input.days > 7) {
    return NextResponse.json(
      { error: "מספר הימים חייב להיות בין 1 ל-7" },
      { status: 400 }
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 12000,
          system: [
            {
              type: "text" as const,
              text: SYSTEM_PROMPT,
              cache_control: { type: "ephemeral" as const },
            },
          ],
          messages: [{ role: "user", content: buildUserPrompt(input) }],
        });

        for await (const chunk of anthropicStream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }

        const finalMsg = await anthropicStream.finalMessage();
        const u = finalMsg.usage as unknown as Record<string, number>;
        const hit = (u.cache_read_input_tokens ?? 0) > 0;
        console.log(
          `[generate] input: ${u.input_tokens}, cache_read: ${u.cache_read_input_tokens ?? 0}, cache_create: ${u.cache_creation_input_tokens ?? 0}, output: ${u.output_tokens} | cache ${hit ? "HIT" : "MISS"}`
        );
      } catch (err) {
        console.error("[generate] stream error:", err);
        const msg = err instanceof Error ? err.message : "שגיאה פנימית";
        controller.enqueue(encoder.encode(`\nERROR:${msg}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
