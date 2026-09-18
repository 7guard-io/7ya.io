# 7YA Humanize Pass — visitor-facing language (2026-09-18)

## Diagnosis

The live personal album (AppDeploy app 697a008fddc309b142) carries deeply
personal Hebrew content, but nearly every label, badge and chip around that
content is English audit language (PUBLIC RECORD, VERIFIED, METRIC DISPUTED,
CANON · SOURCE, VERIFIED_MULTI_NODE...). Visitors meet a compliance document
before they meet the person. Full inventory captured live in-browser on
2026-09-18 from https://7ya.io/.

## Scope rules

- Change display labels only. Do not change content, numbers, links, URLs,
  data structures or verification semantics.
- Keep proper nouns: StartOn, 7YA, BIZZI, NRG, mynet, ישראל ביתנו, platform
  names (Instagram, TikTok, YouTube, LinkedIn, Facebook, X, Threads, Telegram).
- Where a label becomes Hebrew, remove its dir='ltr' so it renders RTL.
- After the pass the site must load with 0 frontend errors.

## Glossary (English label -> Hebrew label)

### Chrome
- PUBLIC RECORD -> אלבום חיים
- PERSONAL ALBUM / IGOR VEPRETSKI -> האלבום האישי · איגור ופרצקי
- AGE → PLACE → PEOPLE → MOMENT → MEDIA → RESPONSE → CONSEQUENCE → REFLECTION -> גיל → מקום → אנשים → רגע → מדיה → תגובה → מה קרה אחר כך → מה אני מבין היום
- " · LIFE CONSEQUENCE" -> "" (remove the English tail after מה קרה אחר כך)
- SOURCE ↗ -> המקור ↗
- #7YA🥷 / LIFE THROUGHLINE · 1990 → NOW -> #7YA🥷 · רצף החיים · 1990 → היום
- IGOR VEPRETSKI · LIFE → MEMORY → PEOPLE → CONSEQUENCE → NEXT MOVE -> איגור ופרצקי · חיים → זיכרון → אנשים → מה נשאר → הצעד הבא
- LIFE ATLAS · SOURCE-LINKED RECOVERY -> אטלס החיים · כל פרט מחובר למקור
- LIFE MEDIA / 18 SOURCE-LINKED MOMENTS -> מדיה של חיים · 18 רגעים מקושרים למקור
- IDEAS / RESEARCH / BUILD -> רעיונות · מחקר · בנייה
- PERSON FIRST · SOURCE ALWAYS OPEN -> קודם האדם · המקור תמיד פתוח

### Source chips
- OWNED PUBLIC MEMORY · WEB VERIFIED -> זיכרון אישי · מקור מאומת
- OWNED PUBLIC VIDEO · VERIFIED -> וידאו אישי · מקור מאומת
- OWNED PUBLIC POST · WEB VERIFIED -> פוסט אישי · מקור מאומת
- OWNED POLITICAL POST · WEB VERIFIED -> פוסט ציבורי · מקור מאומת
- ARCHIVE PUBLISHER RECORD · PERIOD SOURCE · PHOTO CREDIT IDF SPOKESPERSON -> מקור מהתקופה · קרדיט צילום: דובר צה״ל
- OFFICIAL U.S. GOVERNMENT RECORD · PERIOD DOCUMENT · DUTIES NOT INFERRED -> מסמך ממשלתי אמריקאי מהתקופה · ללא פרשנות על התפקידים
- PUBLISHER PAGE · VERIFIED -> מקור עיתונאי מאומת
- PUBLISHER PAGE · VERIFIED · METRIC DISPUTED -> מקור עיתונאי מאומת · המספרים שנויים במחלוקת
- TV INTERVIEW · VERIFIED -> ראיון טלוויזיה מאומת
- THIRD-PARTY ARTICLE · VERIFIED -> כתבה חיצונית מאומתת
- BROADCAST RECORD · VERIFIED -> שידור מאומת
- LONG FORM VIDEO · VERIFIED -> שיחה ארוכה · מקור מאומת
- THIRD-PARTY PODCAST · ORIGINAL SOURCE · VERIFIED -> פודקאסט חיצוני · המקור המקורי
- OFFICIAL PUBLIC VIDEO · CO-CREATION · VERIFIED -> קליפ רשמי · שיתוף פעולה
- OWNER INSIGHTS · CANONICAL REEL · 01.08.2026 -> נתוני בעלים · הריל הקנוני · 01.08.2026
- EXTERNAL CREATOR SOURCE · VERIFIED · NOT OWNED REACH -> מקור של יוצר חיצוני · לא בבעלותי

### Facebook / distribution strip
- FACEBOOK · LIVE GRAPH API · ARCHIVE FALLBACK -> Facebook · נתונים חיים · גיבוי ארכיון
- FACEBOOK · EXTERNAL REPOST -> Facebook · שיתוף חיצוני
- FACEBOOK · PARTY DISTRIBUTION · INDEXED -> Facebook · הפצה מפלגתית · באינדקס
- FACEBOOK · DISTRIBUTION INSTANCE -> Facebook · מופע הפצה
- FACEBOOK · VIRAL VIDEO · INDEXED -> Facebook · וידאו ויראלי · באינדקס
- CANON · SOURCE -> המאגר · המקור

### Cluster / narrative eyebrows
- POSTS AS MEMORY / VIRAL UNIVERSE -> פוסטים כזיכרון · היקום הוויראלי
- LIFE → POST → PEOPLE → CONSEQUENCE -> חיים → פוסט → אנשים → מה נשאר
- FATHERHOOD → FACEBOOK → LINKEDIN → MEDIA -> אבהות → Facebook → LinkedIn → מדיה
- POST / SOURCE · ARCHIVE VERIFIED_CROSS_PLATFORM -> פוסט / מקור · אומת דרך כמה פלטפורמות
- IDENTITY → IMMIGRATION → REPOSTS → PROFESSIONAL MIRROR -> זהות → עלייה → שיתופים → ראי מקצועי
- LIFE DECISION → COMMENTS → PRESS → BROADCAST → BUILD -> החלטה → תגובות → עיתונות → שידור → בנייה
- TREND → CREATOR CROSSOVER → SONG → VIDEO -> טרנד → מעבר בין יוצרים → שיר → וידאו
- VERIFIED_MULTI_NODE -> אומת מכמה מקורות
- VERIFIED_MIXED_EXTERNAL -> אומת חלקית · מקורות חיצוניים
- BROADCAST / LIVE UNIVERSE -> שידור · היקום החי
- ANCHOR / 2018–2023 · LEGACY CREATOR / RUSSIAN CULTURE -> עוגן · 2018–2023 · יוצר מורשת · תרבות רוסית
- ANCHOR / 2023 · FATHERHOOD → PEOPLE -> עוגן · 2023 · אבהות → אנשים
- ANCHOR / 2022–NOW · STARTON / BUILD -> עוגן · 2022 עד היום · StartOn · בנייה
- ANCHOR / 2020–2026 · CROSS-CREATOR VIRALITY / FEATURES -> עוגן · 2020–2026 · ויראליות בשיתוף יוצרים

## Verification

After the pass is applied in AppDeploy, re-render 7ya.io in a real browser and
confirm: no English audit labels remain on the homepage, all source links
still open, site loads with 0 errors, RTL renders correctly.
