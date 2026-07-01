import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import type { ScheduleResult } from "@/types/schedule";
import { buildSchedulePdfDocument } from "@/lib/schedule-pdf";

export const runtime = "nodejs";

// Simple in-memory rate limiter: max 10 requests per IP per minute
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  for (const [key, entry] of rateLimit) {
    if (now >= entry.resetAt) rateLimit.delete(key);
  }

  const entry = rateLimit.get(ip);
  if (!entry) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

interface ExportPdfBody {
  result: ScheduleResult;
  zoomSessions?: string;
  filename?: string;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "יותר מדי בקשות – אנא המתן דקה ונסה שוב" },
      { status: 429 }
    );
  }

  let body: ExportPdfBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }

  if (!body.result?.days?.length) {
    return NextResponse.json({ error: "חסרים נתוני לו״ז" }, { status: 400 });
  }

  try {
    const buffer = await renderToBuffer(buildSchedulePdfDocument(body.result, body.zoomSessions));
    const filename = body.filename?.trim() || `luz-${Date.now()}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(buffer.length),
      },
    });
  } catch (err) {
    console.error("[export-pdf] render error:", err);
    return NextResponse.json({ error: "שגיאה ביצירת קובץ ה-PDF" }, { status: 500 });
  }
}
