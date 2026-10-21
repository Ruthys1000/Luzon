import path from "path";
import type { Style } from "@react-pdf/types";
import { Document, Page, View, Text, Link, StyleSheet, Font } from "@react-pdf/renderer";
import type { ScheduleResult, SlotData } from "@/types/schedule";
import { segmentLinks, suppSearchLink, type LinkSegment } from "@/lib/linkify";
import { getCatalogItem, catalogSearchUrl, catalogSearchLabel } from "@/constants/catalog";

let fontsRegistered = false;

function registerFonts() {
  if (fontsRegistered) return;
  Font.register({
    family: "Heebo",
    fonts: [
      { src: path.join(process.cwd(), "public/fonts/Heebo-Regular.ttf"), fontWeight: "normal" },
      { src: path.join(process.cwd(), "public/fonts/Heebo-Bold.ttf"), fontWeight: "bold" },
    ],
  });
  fontsRegistered = true;
}

const BADGE_COLORS: Record<string, { background: string; color: string }> = {
  "הרצאה": { background: "#f3e4dc", color: "#7f2f22" },
  "תרגול": { background: "#e4efe7", color: "#287a52" },
  "דיון": { background: "#f8edcf", color: "#8a5a12" },
  "הפסקה": { background: "#f4eee6", color: "#7b7066" },
  "סיכום": { background: "#ece7f4", color: "#4d3b78" },
  "פעילות אינטראקטיבית": { background: "#eee0d8", color: "#8b402e" },
};

function getBadgeColors(type: string) {
  return BADGE_COLORS[type] ?? BADGE_COLORS["הרצאה"];
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Heebo",
    fontSize: 10,
    color: "#1f1c18",
    padding: 28,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7f2f22",
    marginBottom: 12,
    textAlign: "right",
    direction: "rtl",
  },
  rationale: {
    backgroundColor: "#fdf8f4",
    borderRightWidth: 4,
    borderRightColor: "#d46a50",
    borderRightStyle: "solid",
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
  },
  rationaleText: {
    fontSize: 9.5,
    lineHeight: 1.5,
    textAlign: "right",
    direction: "rtl",
  },
  zoomBanner: {
    backgroundColor: "#eef5fd",
    borderRightWidth: 4,
    borderRightColor: "#1d7bd4",
    borderRightStyle: "solid",
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
  },
  zoomLabel: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#1d7bd4",
    marginBottom: 4,
    textAlign: "right",
    direction: "rtl",
  },
  zoomLine: {
    fontSize: 9.5,
    lineHeight: 1.6,
    textAlign: "right",
    direction: "rtl",
  },
  dayHeader: {
    backgroundColor: "#f3e4dc",
    borderRadius: 4,
    padding: "7 10",
    marginTop: 10,
    marginBottom: 4,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#7f2f22",
    textAlign: "right",
    direction: "rtl",
  },
  slotRow: {
    flexDirection: "row-reverse",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderBottomStyle: "solid",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  cellTime: {
    flexBasis: "12%",
    fontSize: 8.5,
    color: "#6b7280",
    textAlign: "right",
    direction: "ltr", // "09:00–10:30" reads left to right
  },
  cellTopic: {
    flexBasis: "30%",
    fontSize: 9.5,
    fontWeight: "bold",
    paddingHorizontal: 4,
    textAlign: "right",
    direction: "rtl",
  },
  cellBadge: {
    flexBasis: "16%",
    paddingHorizontal: 4,
  },
  badge: {
    fontSize: 7.5,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    alignSelf: "flex-start",
  },
  cellNotes: {
    flexBasis: "42%",
    flexShrink: 1,
  },
  cellNotesText: {
    fontSize: 8.5,
    color: "#6b7280",
    lineHeight: 1.5,
    textAlign: "right",
    direction: "rtl",
  },
  suppBlock: {
    backgroundColor: "#fdf8f4",
    borderTopWidth: 2,
    borderTopColor: "#e3d8ca",
    borderTopStyle: "dashed",
    borderRadius: 4,
    padding: 10,
    marginBottom: 4,
  },
  suppTitle: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#d46a50",
    marginBottom: 6,
    textAlign: "right",
    direction: "rtl",
  },
  suppItem: {
    marginBottom: 6,
  },
  suppItemLabel: {
    fontSize: 8.5,
    fontWeight: "bold",
    lineHeight: 1.5,
    textAlign: "right",
    direction: "rtl",
  },
  suppItemDesc: {
    fontSize: 8.5,
    lineHeight: 1.5,
    textAlign: "right",
    direction: "rtl",
  },
  link: {
    color: "#1d7bd4",
    textDecoration: "none",
    direction: "rtl",
  },
  catalogRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 5,
  },
  catalogTag: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#287a52",
    backgroundColor: "#e4efe7",
    borderRadius: 6,
    paddingVertical: 1,
    paddingHorizontal: 5,
  },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    textAlign: "center",
    direction: "rtl",
    fontSize: 7.5,
    color: "#9ca3af",
  },
});

// Links get their own line: inline colored runs inside RTL text are recolored over the wrong glyphs
function TextWithLinks({ text, style, linkStyle }: { text: string; style?: Style; linkStyle?: Style }) {
  const segments: LinkSegment[] = segmentLinks(text);
  const plain = segments
    .filter((seg) => !seg.url)
    .map((seg) => seg.text)
    .join(" ")
    .replace(/\s+([.,:;)])/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[\s–—:-]+$/, "")
    .trim();
  const links = segments.filter((seg) => seg.url);
  return (
    <>
      {plain && <Text style={style}>{plain}</Text>}
      {links.map((seg, i) => (
        <Link key={i} src={seg.url!} style={[style ?? {}, linkStyle ?? styles.link]}>
          {pdfSafe(seg.text.replace(/\s*[←→]\s*/g, ""))}
        </Link>
      ))}
    </>
  );
}

function SlotRow({ slot }: { slot: SlotData }) {
  const badgeColors = getBadgeColors(slot.activity_type);
  const catalogItem = getCatalogItem(slot.catalog_id);
  return (
    <View style={styles.slotRow} wrap={false}>
      <Text style={styles.cellTime}>{slot.time}</Text>
      <Text style={styles.cellTopic}>
        {slot.lesson_number ? `${slot.lesson_number}. ` : ""}
        {slot.topic}
      </Text>
      <View style={styles.cellBadge}>
        <Text style={[styles.badge, { backgroundColor: badgeColors.background, color: badgeColors.color }]}>
          {slot.activity_type}
        </Text>
      </View>
      <View style={styles.cellNotes}>
        <TextWithLinks text={slot.instructor_notes} style={styles.cellNotesText} />
        {catalogItem && (
          <View style={[styles.catalogRow, { marginTop: 2 }]}>
            <Text style={styles.catalogTag}>מהקטלוג</Text>
            <Link src={catalogSearchUrl(catalogItem)} style={[styles.cellNotesText, styles.link]}>
              {catalogSearchLabel(catalogItem)}
            </Link>
          </View>
        )}
      </View>
    </View>
  );
}

function SupplementaryBlock({ day }: { day: ScheduleResult["days"][number] }) {
  const items: { label: string; type: "video" | "article" | "activity" }[] = [
    { label: "וידאו", type: "video" },
    { label: "מאמר", type: "article" },
    { label: "פעילות", type: "activity" },
  ];
  return (
    <View style={styles.suppBlock} wrap={false}>
      <Text style={styles.suppTitle}>תוכן משלים</Text>
      {items.map(({ label, type }) => {
        const item = day.supplementary[type];
        const link = suppSearchLink(item, type);
        const showSearch = link && (link.fromCatalog || !segmentLinks(item.description).some((s) => s.url));
        return (
          <View key={type} style={styles.suppItem} wrap={false}>
            <View style={styles.catalogRow}>
              {link?.fromCatalog && <Text style={styles.catalogTag}>מהקטלוג</Text>}
              <Text style={styles.suppItemLabel}>{`${label}: ${item.title}`}</Text>
            </View>
            <TextWithLinks text={item.description} style={styles.suppItemDesc} />
            {link && showSearch && (
              <Link src={link.href} style={[styles.suppItemDesc, styles.link]}>
                {link.label}
              </Link>
            )}
          </View>
        );
      })}
    </View>
  );
}

// Glyphs missing from the embedded Heebo subset (arrows, emoji) don't just disappear —
// they corrupt the letters that follow them. Map arrows to a dash and drop anything else unsupported.
const PDF_UNSUPPORTED = /[^\n\u0020-\u007E\u00A0-\u00FF\u0590-\u05FF\u200C-\u200F\u2013\u2014\u2018-\u201E\u2022\u2026\u20AA\u20AC\uFB1D-\uFB4F]/gu;

function pdfSafe<T>(value: T): T {
  if (typeof value === "string") {
    return value.replace(/[→←⇐⇒➜➔]/g, "–").replace(PDF_UNSUPPORTED, "") as T;
  }
  if (Array.isArray(value)) return value.map(pdfSafe) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, pdfSafe(v)])) as T;
  }
  return value;
}

export function buildSchedulePdfDocument(rawResult: ScheduleResult, rawZoomSessions?: string) {
  registerFonts();
  const result = pdfSafe(rawResult);
  const zoomSessions = pdfSafe(rawZoomSessions);
  const zoomLines = zoomSessions?.trim()
    ? zoomSessions.trim().split("\n").filter((l) => l.trim())
    : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>לו״ז – Luz Creator</Text>

        <View style={styles.rationale} wrap={false}>
          <Text style={styles.rationaleText}>{result.rationale}</Text>
        </View>

        {zoomLines.length > 0 && (
          <View style={styles.zoomBanner} wrap={false}>
            <Text style={styles.zoomLabel}>מפגשי זום</Text>
            {zoomLines.map((line, i) => (
              <TextWithLinks key={i} text={line} style={styles.zoomLine} />
            ))}
          </View>
        )}

        {result.days.map((day, di) => (
          <View key={di}>
            <View style={styles.dayHeader} wrap={false}>
              <Text style={styles.dayHeaderText}>{day.day}</Text>
            </View>
            {day.slots.map((slot, si) => (
              <SlotRow key={si} slot={slot} />
            ))}
            <SupplementaryBlock day={day} />
          </View>
        ))}

        <Text style={styles.footer} fixed render={({ pageNumber, totalPages }) =>
          `Luz Creator © ${new Date().getFullYear()} — עמוד ${pageNumber} מתוך ${totalPages}`
        } />
      </Page>
    </Document>
  );
}
