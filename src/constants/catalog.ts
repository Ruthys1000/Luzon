// Internal free-course catalog for remote learning. Items have no direct URLs —
// links are built as targeted searches on each item's platform.

export type CatalogPlatform =
  | "campus"
  | "youtube"
  | "spotify"
  | "darca"
  | "decisionlab"
  | "alison"
  | "webguy"
  | "madrasa"
  | "book";

export interface CatalogItem {
  id: string;
  title: string;
  provider?: string;
  platform: CatalogPlatform;
  chapter: number;
  topic: string;
  duration?: string;
  audience?: string;
  summary: string;
  /** Clean search string — no platform names or noise words */
  query: string;
}

const PLATFORMS: Record<CatalogPlatform, { name: string; searchLabel: string; domain?: string }> = {
  campus: { name: "קמפוס IL", searchLabel: "חפש בקמפוס IL", domain: "campus.gov.il" },
  youtube: { name: "YouTube", searchLabel: "חפש ביוטיוב" },
  spotify: { name: "Spotify", searchLabel: "חפש בספוטיפיי" },
  darca: { name: "Darca Connect", searchLabel: "חפש ב-Darca Connect", domain: "darcaconnect.org.il" },
  decisionlab: { name: "The Decision Lab", searchLabel: "חפש ב-The Decision Lab", domain: "thedecisionlab.com" },
  alison: { name: "Alison", searchLabel: "חפש ב-Alison", domain: "alison.com" },
  webguy: { name: "Webguy", searchLabel: "חפש ב-Webguy", domain: "webguy.co.il" },
  madrasa: { name: "מדרסה", searchLabel: "חפש במדרסה", domain: "madrasafree.com" },
  book: { name: "ספר", searchLabel: "חפש בגוגל" },
};

export const CATALOG_CHAPTERS: Record<number, string> = {
  1: "חוסן, רווחה אישית והתמודדות עם מצבי אי־ודאות",
  2: "תקשורת, השפעה והנעת אנשים",
  3: "ניהול, מנהיגות ופיתוח תפקיד ניהולי",
  4: "פרודוקטיביות, ניהול זמן וחשיבה ביקורתית",
  5: "ניהול פרויקטים, תהליכים וממשקי עבודה",
  6: "טכנולוגיה, מיומנויות דיגיטליות ובינה מלאכותית",
  7: "פדגוגיה, הדרכה ולמידה מרחוק",
  8: "שפות, העשרה ולמידה עצמאית",
};

export const CATALOG: CatalogItem[] = [
  // ── פרק 1 ──
  {
    id: "c01", title: "פדגוגיה של חוסן", provider: "חמדת הדרום", platform: "campus", chapter: 1, topic: "חוסן",
    duration: "9 יחידות של שעתיים", audience: "מנהלי הדרכה וחניכים",
    summary: "תיאוריות וכלים יישומיים לחוסן ולצמיחה ממשבר, ושילובם בהוראה ובהורות",
    query: "פדגוגיה של חוסן חמדת הדרום",
  },
  {
    id: "c02", title: "מיינדפולנס ובודהיזם: פרקטיקה ותיאוריה אז והיום", provider: "אוניברסיטת תל אביב", platform: "campus", chapter: 1, topic: "חוסן",
    duration: "3 שעות", audience: "מנהלי הדרכה וחניכים",
    summary: "חוסן רגשי וחברתי, כלים להתמודדות עם לחץ וחרדה, והקשר בין המקורות הבודהיסטים למיינדפולנס המודרני",
    query: "מיינדפולנס ובודהיזם פרקטיקה ותיאוריה אז והיום",
  },
  {
    id: "c03", title: "ממשבר לצמיחה: כלים להתמודדות עם חרדה במצבי דחק", provider: "משרד הבריאות", platform: "campus", chapter: 1, topic: "חוסן",
    audience: "מנהלי הדרכה, חניכים",
    summary: "הרגעת חרדה במצבי דחק, חיזוק אינטליגנציה רגשית וכלים לסיוע עצמי ומשפחתי",
    query: "ממשבר לצמיחה כלים להתמודדות עם חרדה במצבי דחק",
  },
  {
    id: "c04", title: "סרטוני הדרכה בנושאי חוסן", platform: "darca", chapter: 1, topic: "חוסן",
    audience: "מנהלי הדרכה וחניכים",
    summary: "סרטוני הדרכה קצרים בנושא חוסן",
    query: "חוסן סרטוני הדרכה",
  },
  {
    id: "c05", title: "לעולם חוסן: מתיאוריה לפרקטיקה – סיוע נפשי ראשוני במצבי חירום", provider: "משרד הבריאות", platform: "campus", chapter: 1, topic: "חוסן",
    duration: "3 שעות", audience: "מנהלי הדרכה וחניכים",
    summary: "כלים פרקטיים לסיוע נפשי ראשוני ומיידי במצבי מצוקה וחירום",
    query: "לעולם חוסן סיוע נפשי ראשוני במצבי חירום",
  },
  {
    id: "c06", title: "Simon Sinek's Guide to Cultivating Psychological Safety at Work", provider: "Simon Sinek", platform: "youtube", chapter: 1, topic: "ביטחון פסיכולוגי",
    duration: "סרטון קצר", audience: "מנהלים, מנהלי הדרכה",
    summary: "ביטחון פסיכולוגי וצוות מבוסס אמון — להודות בטעויות ולבקש עזרה (באנגלית)",
    query: "Simon Sinek Cultivating Psychological Safety at Work",
  },

  // ── פרק 2 ──
  {
    id: "c07", title: "סדנת סגנונות תקשורת: הקדמה", provider: "איציק לוי", platform: "youtube", chapter: 2, topic: "סגנונות תקשורת",
    duration: "4 סרטונים, 7 דק' כל אחד", audience: "מנהלי הדרכה",
    summary: "קורס דיגיטלי קצר לתקשורת אפקטיבית וחיובית",
    query: "סדנת סגנונות תקשורת איציק לוי",
  },
  {
    id: "c08", title: "סגנונות תקשורת — הכלי האפקטיבי ביותר להנעה, הנאה ויצירת מערכות יחסים טובות", provider: "אילנית", platform: "youtube", chapter: 2, topic: "סגנונות תקשורת",
    duration: "16 דק'", audience: "מנהלי הדרכה",
    summary: "היכרות חווייתית עם 4 סגנונות התקשורת והיחסים ביניהם",
    query: "סגנונות תקשורת הכלי האפקטיבי ביותר להנעה הנאה ויצירת מערכות יחסים טובות",
  },
  {
    id: "c09", title: "סגנונות תקשורת ואיך להשתמש בהם", provider: "מיכאל מלמדוב", platform: "youtube", chapter: 2, topic: "סגנונות תקשורת",
    duration: "47 דק'", audience: "מנהלי הדרכה, חניכים, מנהלים",
    summary: "ללמוד לתקשר, להכיל ולזהות סגנונות כדי לבנות צוות וסביבה תומכת",
    query: "סגנונות תקשורת ואיך להשתמש בהם מיכאל מלמדוב",
  },
  {
    id: "c10", title: "סגנונות תקשורת", provider: "רן אלוס", platform: "youtube", chapter: 2, topic: "סגנונות תקשורת",
    duration: "2.14 שעות", audience: "מנהלי הדרכה, חניכים, מנהלים",
    summary: "היכרות עצמית מעמיקה כדי להבין את האחר, להשפיע ולשכנע",
    query: "סגנונות תקשורת רן אלוס",
  },
  {
    id: "c11", title: "סטוריטלינג: כוחו של סיפור בעולם העבודה", provider: "משרד העבודה", platform: "campus", chapter: 2, topic: "הנעת עובדים",
    duration: "3 שעות", audience: "מנהלי הדרכה, מנהלים",
    summary: "אומנות הסטוריטלינג — מותג אישי, הנעת אנשים לפעולה והעברת מסרים",
    query: "סטוריטלינג כוחו של סיפור בעולם העבודה",
  },
  {
    id: "c12", title: "להניע ולהשפיע – כיצד ליצור מוטיבציה אצל עובדים ועובדות?", provider: "משרד החינוך", platform: "campus", chapter: 2, topic: "הנעת עובדים",
    duration: "שעתיים", audience: "מנהלי הדרכה, מנהלים",
    summary: "מתוך תוכנית 'חדר כושר ניהולי' — כלים להנעה והשפעה על צוות",
    query: "להניע ולהשפיע כיצד ליצור מוטיבציה אצל עובדים ועובדות",
  },
  {
    id: "c13", title: "הנעת עובדים למוטיבציה ומחוברות ארגונית (פודקאסט)", provider: "גלי גופר ואיתי הל-אור", platform: "spotify", chapter: 2, topic: "הנעת עובדים",
    duration: "45 דקות", audience: "מנהלים",
    summary: "מה חשוב באמת לעובד, מגבירי מוטיבציה נפוצים ואיך מייצרים מחוברות ואכפתיות",
    query: "הנעת עובדים למוטיבציה ומחוברות ארגונית גלי גופר",
  },
  {
    id: "c14", title: "יצירתיות ככלי להנעת עובדים וניהול משברים", provider: "מוטי אייזן", platform: "youtube", chapter: 2, topic: "הנעת עובדים",
    duration: "32 דק'", audience: "מנהלים, מנהלי הדרכה",
    summary: "מה מונע מארגונים להיות יצירתיים ואיך מפתחים ומטפחים יצירתיות בארגון",
    query: "יצירתיות ככלי להנעת עובדים וניהול משברים מוטי אייזן",
  },

  // ── פרק 3 ──
  {
    id: "c15", title: "ניהול עובדים מרחוק ובעבודה משולבת", provider: "משרד העבודה", platform: "campus", chapter: 3, topic: "ניהול מרחוק",
    duration: "3 שעות", audience: "מנהלי הדרכה, מנהלים",
    summary: "כלים ועקרונות לניהול עובדים מרחוק ובעבודה היברידית, כולל סגנונות תקשורת עם עובדים",
    query: "ניהול עובדים מרחוק ובעבודה משולבת",
  },
  {
    id: "c16", title: "פיתוח מנהלים – כלים למנהל המתחיל", provider: "משרד העבודה", platform: "campus", chapter: 3, topic: "פיתוח מנהלים",
    duration: "10 שעות", audience: "מנהלי הדרכה, מנהלים",
    summary: "כלים וכישורים לבניית תשתית חזקה בתחילת הדרך הניהולית",
    query: "פיתוח מנהלים כלים למנהל המתחיל",
  },
  {
    id: "c17", title: "ניהול צוות – איך עושים את זה?", platform: "campus", chapter: 3, topic: "ניהול צוות",
    duration: "שעתיים", audience: "מנהלים, מנהלי הדרכה",
    summary: "סוגי צוותים, שלבי התפתחות צוות, שגרות לחיזוק הצוות וישיבות צוות אפקטיביות",
    query: "ניהול צוות איך עושים את זה",
  },
  {
    id: "c18", title: "תפיסת תפקיד ניהולית בזמן מלחמה", provider: "ניר גולן וחלי נחמה עוזרי", platform: "youtube", chapter: 3, topic: "תפיסת תפקיד",
    duration: "31 דק'", audience: "מנהלים, מנהלי הדרכה",
    summary: "מה התפקיד של מנהלות ומנהלים בתקופה מורכבת ובזמן חירום",
    query: "תפיסת תפקיד ניהולית בזמן מלחמה ניר גולן חלי נחמה עוזרי",
  },
  {
    id: "c19", title: "מנטורינג – איך עושים את זה נכון (פודקאסט)", platform: "youtube", chapter: 3, topic: "מנטורינג",
    duration: "23 דק'", audience: "מנהלים, מנהלי הדרכה",
    summary: "העברת ידע ארגוני בתהליכי מנטורינג וההבדל בין מנטורינג לחניכה",
    query: "מנטורינג איך עושים את זה נכון פודקאסט",
  },
  {
    id: "c20", title: "חדר כושר ניהולי", platform: "campus", chapter: 3, topic: "אומץ ניהולי",
    duration: "6 שעות", audience: "מנהלים, מנהלי הדרכה",
    summary: "התמקצעות ניהולית — סטנדרטים, מדידה ואוריינטציה לתוצאות, עם דגש על המגזר הציבורי",
    query: "חדר כושר ניהולי",
  },
  {
    id: "c21", title: "מנהיגות בעולם העבודה", platform: "campus", chapter: 3, topic: "מנהיגות",
    duration: "שעתיים", audience: "מנהלים, מנהלי הדרכה",
    summary: "סגנונות מנהיגות בניהול ודרכים לשפר כישורי מנהיגות",
    query: "מנהיגות בעולם העבודה",
  },
  {
    id: "c22", title: "מיהו מנהיג אמיתי ואיך להפוך למנהיג?", provider: "גל צחייק", platform: "youtube", chapter: 3, topic: "מנהיגות ערכית",
    duration: "23 דק'", audience: "מנהלים, מנהלי הדרכה",
    summary: "מהי מנהיגות ואיך כל אחד יכול לפתח מנהיגות והשפעה חיובית",
    query: "מיהו מנהיג אמיתי ואיך להפוך למנהיג גל צחייק",
  },
  {
    id: "c23", title: "ניהול מתוך חוזקות", provider: "לילך זוהר", platform: "youtube", chapter: 3, topic: "מנהיגות ערכית",
    duration: "15 דק'", audience: "מנהלים, מנהלי הדרכה",
    summary: "הרצאה קצרה על ניהול צוות מתוך זיהוי ומינוף חוזקות",
    query: "ניהול מתוך חוזקות לילך זוהר",
  },

  // ── פרק 4 ──
  {
    id: "c24", title: "להיות ״על זה״: פרודוקטיביות, דחיינות וניהול עצמי", provider: "יהודית כץ ויאיר יונה", platform: "youtube", chapter: 4, topic: "ניהול זמן",
    duration: "שעה", audience: "מנהלי הדרכה, חניכים",
    summary: "קיפאון מול משימות ודחיינות — מה קורה במוח ואיך יוצאים מזה",
    query: "להיות על זה פרודוקטיביות דחיינות וניהול עצמי",
  },
  {
    id: "c25", title: "ניהול עומס, זמן ואנרגיה בעידן של אי ודאות", provider: "אוריה שלג", platform: "youtube", chapter: 4, topic: "ניהול זמן",
    duration: "44 דק'", audience: "מנהלים, מנהלי הדרכה, חניכים",
    summary: "השפעת עומס מנטלי על החלטות וביצועים, כלים לניהול זמן ומיקוד וחיזוק חוסן אישי",
    query: "ניהול עומס זמן ואנרגיה בעידן של אי ודאות אוריה שלג",
  },
  {
    id: "c26", title: "לשלוט בזמן – פוקוס מנטלי בעידן מורכב", provider: "נורית גנדלמן", platform: "youtube", chapter: 4, topic: "ניהול זמן",
    duration: "14 דק'", audience: "מנהלים, מנהלי הדרכה, חניכים",
    summary: "אתגרי ניהול זמן, מודל BANI וכלים פרקטיים לפוקוס בעולם מלא גירויים",
    query: "לשלוט בזמן פוקוס מנטלי בעידן מורכב נורית גנדלמן",
  },
  {
    id: "c27", title: "חשיבה ביקורתית – עקרונות הטיעון", platform: "campus", chapter: 4, topic: "חשיבה ביקורתית",
    duration: "13 מפגשים של 4 שעות", audience: "מנהלים, מנהלי הדרכה, חניכים",
    summary: "מבוא לחשיבה ביקורתית — זיהוי, פירוש, הערכה ובניית טיעונים",
    query: "חשיבה ביקורתית עקרונות הטיעון",
  },
  {
    id: "c28", title: "4 טיפים לפתח את כישורי החשיבה הביקורתית (TEDx)", provider: "Steve Pearlman", platform: "youtube", chapter: 4, topic: "חשיבה ביקורתית",
    duration: "18 דק'", audience: "מנהלים, מנהלי הדרכה, חניכים",
    summary: "מה זו חשיבה ביקורתית ואיך מפתחים אותה (באנגלית)",
    query: "Steve Pearlman critical thinking TEDx",
  },
  {
    id: "c29", title: "Cognitive Biases – A list of the most relevant biases in behavioral economics", platform: "decisionlab", chapter: 4, topic: "הטיות חשיבה",
    duration: "קריאה – כ-4 שעות", audience: "מנהלים, מנהלי הדרכה, חניכים",
    summary: "מאות הטיות חשיבה מוסברות בפשטות עם דוגמאות מהחיים (באנגלית)",
    query: "cognitive biases list",
  },
  {
    id: "c30", title: "Thinking, Fast and Slow – סיכום באנימציה", platform: "youtube", chapter: 4, topic: "הטיות חשיבה",
    duration: "37 דק'", audience: "מנהלים, מנהלי הדרכה, חניכים",
    summary: "סיכום מונפש של ספרו של כהנמן — הטיות נסתרות שמעוותות שיפוט והחלטות (באנגלית)",
    query: "Thinking Fast and Slow animated book summary",
  },
  {
    id: "c31", title: "לחשוב מהר, לחשוב לאט (ספר)", provider: "דניאל כהנמן", platform: "book", chapter: 4, topic: "קבלת החלטות באי ודאות",
    summary: "ספר יסוד להבנת הטיות חשיבה וקבלת החלטות בתנאי אי־ודאות",
    query: "לחשוב מהר לחשוב לאט דניאל כהנמן",
  },

  // ── פרק 5 ──
  {
    id: "c32", title: "ניהול פרויקטים – מרעיון לביצוע", provider: "משרד העבודה", platform: "campus", chapter: 5, topic: "ניהול פרויקטים",
    duration: "32 שעות", audience: "מנהלי הדרכה, מנהלים ועובדים",
    summary: "ניהול פרויקט מתכנון ועד סיכום, עם דילמות אמיתיות מהיום־יום",
    query: "ניהול פרויקטים מרעיון לביצוע",
  },
  {
    id: "c33", title: "Stakeholder Relationship Management", platform: "alison", chapter: 5, topic: "ניהול ממשקים",
    duration: "1.5–3 שעות", audience: "מנהלים",
    summary: "בניית קשרים חיוביים עם בעלי עניין; חינמי, דורש רישום (באנגלית)",
    query: "Stakeholder Relationship Management",
  },
  {
    id: "c34", title: "ניהול ממשקים ואסטרטגיות השפעה (פודקאסט)", provider: "גלי גופר ואיתי הל-אור", platform: "youtube", chapter: 5, topic: "ניהול ממשקים",
    duration: "36 דק'", audience: "מנהלים, מנהלי הדרכה",
    summary: "איך מפצחים ממשק בין יחידות שלא עובד ומחליפים מאבקי כוח בעבודה משותפת",
    query: "ניהול ממשקים ואסטרטגיות השפעה גלי גופר איתי הל אור",
  },

  // ── פרק 6 ──
  {
    id: "c35", title: "אקסל למתחילים", provider: "מערך הדיגיטל הלאומי", platform: "campus", chapter: 6, topic: "מיומנויות מחשב",
    duration: "4 שעות", audience: "מנהלי הדרכה, חניכים",
    summary: "מיומנויות בסיס בעבודה עם גיליון אלקטרוני וארגון נתונים",
    query: "אקסל למתחילים מערך הדיגיטל הלאומי",
  },
  {
    id: "c36", title: "אקסל למתקדמים", provider: "מערך הדיגיטל הלאומי", platform: "campus", chapter: 6, topic: "מיומנויות מחשב",
    duration: "5 שעות", audience: "מנהלי הדרכה, חניכים",
    summary: "נוסחאות מתקדמות, ארגון מידע וגרפים; נדרש ידע בסיסי",
    query: "אקסל למתקדמים מערך הדיגיטל הלאומי",
  },
  {
    id: "c37", title: "Excel (אקסל): נוסחת VLOOKUP", provider: "מערך הדיגיטל הלאומי", platform: "campus", chapter: 6, topic: "מיומנויות מחשב",
    duration: "שעה", audience: "מנהלי הדרכה, חניכים",
    summary: "טעימה מהקורס למתקדמים — אחת הנוסחאות הפופולריות באקסל",
    query: "אקסל נוסחת VLOOKUP",
  },
  {
    id: "c38", title: "Data.SQL – יסודות וכלים לשליפת נתונים", provider: "מערך הסייבר הלאומי", platform: "campus", chapter: 6, topic: "מיומנויות מחשב",
    duration: "20 שעות", audience: "מנהלי הדרכה, חניכים",
    summary: "יסודות שפת SQL, תחביר ופקודות לשליפת נתונים",
    query: "Data.SQL יסודות וכלים לשליפת נתונים",
  },
  {
    id: "c39", title: "לעבוד חכם עם AI", provider: "מערך הדיגיטל הלאומי", platform: "campus", chapter: 6, topic: "כלי בינה מלאכותית",
    duration: "2.5 שעות", audience: "כולם",
    summary: "שימוש נכון בכלי AI בעבודה — שיפור ביצועים, ייעול תהליכים ובניית סוכנים אוטומטיים",
    query: "לעבוד חכם עם AI",
  },
  {
    id: "c40", title: "10 קורסים על בינה מלאכותית מאת גוגל", platform: "webguy", chapter: 6, topic: "כלי בינה מלאכותית",
    summary: "ריכוז קורסים חינמיים של גוגל בבינה מלאכותית (באנגלית)",
    query: "10 קורסים על בינה מלאכותית מאת גוגל",
  },
  {
    id: "c41", title: "AI לחדשנות מעשית", provider: "לילך זוהר", platform: "youtube", chapter: 6, topic: "כלי בינה מלאכותית",
    duration: "16 דק'", audience: "כולם",
    summary: "תהליך החדשנות — חקר בעיה, רעיונות ופתרונות — בעזרת בינה מלאכותית",
    query: "AI לחדשנות מעשית לילך זוהר",
  },
  {
    id: "c42", title: "AI למנהלים – בינה מלאכותית, בינה ניהולית (וובינר)", platform: "youtube", chapter: 6, topic: "AI ככלי ניהולי",
    duration: "55 דק'", audience: "מנהלים, מנהלי הדרכה",
    summary: "כלי AI לקבלת החלטות, ייעול תהליכים וחיזוק הצוות, ואיך הופכים AI לנכס אסטרטגי",
    query: "AI למנהלים בינה מלאכותית בינה ניהולית וובינר",
  },
  {
    id: "c43", title: "מהפכת ה-Generative AI למנהלים: איך להפוך ל״סופר־מנהל״", provider: "חנן לב", platform: "youtube", chapter: 6, topic: "AI ככלי ניהולי",
    duration: "3 שעות", audience: "מנהלים",
    summary: "הרצאה מתוכנית פיתוח מנהלים של אוניברסיטת חיפה על שימוש ב-GenAI בניהול",
    query: "מהפכת ה Generative AI למנהלים סופר מנהל חנן לב",
  },

  // ── פרק 7 ──
  {
    id: "c44", title: "למידה מרחוק II: היבטים פדגוגיים", provider: "משרד החינוך", platform: "campus", chapter: 7, topic: "למידה מרחוק",
    duration: "6 שעות", audience: "מנהלי הדרכה",
    summary: "למידה סינכרונית וא־סינכרונית, תכנון שיעורים ושיקולי בחירת פעילות",
    query: "למידה מרחוק II היבטים פדגוגיים",
  },
  {
    id: "c45", title: "רתימת הלומדים ללמידה מרחוק", provider: "משרד החינוך", platform: "campus", chapter: 7, topic: "למידה מרחוק",
    duration: "3 שעות", audience: "מנהלי הדרכה",
    summary: "עקרונות פדגוגיים לרתימת לומדים ומעורבות בלמידה מרחוק",
    query: "רתימת הלומדים ללמידה מרחוק",
  },
  {
    id: "c46", title: "טכנולוגיות למידה: עדכון גרסה", provider: "מכון HIT ואוניברסיטת תל אביב", platform: "campus", chapter: 7, topic: "למידה מרחוק",
    duration: "27 שעות (9 שיעורים של 3 שעות, אפשר לבחור פרקים)", audience: "מנהלי הדרכה",
    summary: "שילוב טכנולוגיות בהוראה, מודלים חינוכיים ומיומנויות המאה ה-21",
    query: "טכנולוגיות למידה עדכון גרסה",
  },
  {
    id: "c47", title: "אסטרטגיות למידה – ללמד איך ללמוד", provider: "משרד העבודה", platform: "campus", chapter: 7, topic: "למידה מרחוק",
    duration: "8 מפגשים של 4 שעות", audience: "מנהלי הדרכה, חניכים",
    summary: "כלים ללמד לומדים איך ללמוד — המיומנות הנדרשת ביותר בעולם העבודה",
    query: "אסטרטגיות למידה ללמד איך ללמוד",
  },
  {
    id: "c48", title: "הדרכה הפוכה", platform: "campus", chapter: 7, topic: "ניהול הדרכה",
    duration: "10 שעות", audience: "מנהלי הדרכה",
    summary: "מודל ההדרכה ההפוכה — רצף בין מפגשים, מעורבות המודרכים ותכנון מפגש",
    query: "הדרכה הפוכה",
  },

  // ── פרק 8 ──
  {
    id: "c49", title: "ערבית מדוברת — מדרסה", platform: "madrasa", chapter: 8, topic: "ערבית",
    audience: "כולם",
    summary: "קורס חינמי לערבית מדוברת",
    query: "ערבית מדוברת",
  },
  {
    id: "c50", title: "ערבית מדוברת – מתחילים", platform: "campus", chapter: 8, topic: "ערבית",
    duration: "15 מפגשים של 4 שעות", audience: "כולם",
    summary: "מעל 500 מילים בסיסיות, שיחה פשוטה ודקדוק לתקשורת יום־יומית",
    query: "ערבית מדוברת מתחילים",
  },
];

const CATALOG_BY_ID = new Map(CATALOG.map((item) => [item.id, item]));

export function getCatalogItem(id?: string): CatalogItem | undefined {
  return id ? CATALOG_BY_ID.get(id.trim()) : undefined;
}

export function catalogSearchUrl(item: CatalogItem): string {
  const { domain } = PLATFORMS[item.platform];
  if (item.platform === "youtube") {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(item.query)}`;
  }
  if (item.platform === "spotify") {
    return `https://open.spotify.com/search/${encodeURIComponent(item.query)}`;
  }
  const q = domain ? `site:${domain} ${item.query}` : item.query;
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}

export function catalogSearchLabel(item: CatalogItem): string {
  return PLATFORMS[item.platform].searchLabel;
}

/** Remove catalog IDs the model leaked into text: "(c25)" → "", "(c26, 14 דק')" → "(14 דק')" */
export function stripCatalogIds(text: string): string {
  return text
    .replace(/\s*[(\[]\s*c\d+(?:\s*,\s*c\d+)*\s*[)\]]/g, "")
    .replace(/([(\[])\s*c\d+\s*,\s*/g, "$1")
    .replace(/\s*,\s*c\d+\s*([)\]])/g, "$1")
    .replace(/ {2,}/g, " ")
    .trim();
}

/** Compact catalog listing for the system prompt */
export function catalogPromptText(): string {
  return Object.entries(CATALOG_CHAPTERS)
    .map(([num, name]) => {
      const items = CATALOG.filter((item) => item.chapter === Number(num))
        .map((item) =>
          [
            `[${item.id}] ${item.title}`,
            item.provider,
            PLATFORMS[item.platform].name,
            item.duration && `משך: ${item.duration}`,
            item.audience && `קהל: ${item.audience}`,
            item.summary,
          ]
            .filter(Boolean)
            .join(" | ")
        )
        .join("\n");
      return `פרק ${num}: ${name}\n${items}`;
    })
    .join("\n\n");
}
