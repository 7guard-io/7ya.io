// Respect reduced motion
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hero = document.querySelector(".hero");

if (!prefersReducedMotion && hero) {
    hero.style.transition = "opacity 1.4s ease-out";
    hero.style.opacity = "0";
    setTimeout(() => {
        hero.style.opacity = "1";
    }, 50);
}

const templates = {
    clarify: [
        "בואו נעשה סדר: {context}. אפשר לא להסכים, אבל לפחות נדייק לפני שמרימים ווליום.",
        "הערה קטנה לפני שהאלגוריתם מוחא כפיים לבלגן: {context}. עכשיו אפשר לדבר עניינית.",
        "אני בעד דעה חופשית, פחות בעד עובדות שעברו עריכה יצירתית. הנקודה שלי: {context}."
    ],
    boundary: [
        "כאן אני עוצר את זה. {context}. ביקורת כן, זלזול לא.",
        "אפשר לדבר איתי חד וברור, אבל לא לדרוך על הגבול. {context}.",
        "אני לא נכנס למשחק של רעש במקום תוכן. אם יש טענה אמיתית — תביאו אותה נקייה."
    ],
    witty: [
        "יפה, כמעט השתכנעתי — רק חסרו עובדות, הקשר, וקשר קל למציאות. {context}.",
        "זה ניסוח עם הרבה ביטחון עצמי ומעט מאוד קבלות. בואו ננסה שוב, הפעם עם תוכן.",
        "אם זו הייתה תחרות בקפיצה למסקנות, היינו כבר בטקס המדליות. {context}."
    ],
    deescalate: [
        "אני מעדיף לסגור את זה בכבוד: {context}. מי שרוצה לדבר עניינית — הדלת פתוחה.",
        "לא חייבים להפוך כל אי-הסכמה לזירת קרב. הבהרה קצרה: {context}.",
        "עוצר כאן לפני שזה נהיה יותר חום מאור. אפשר להמשיך כשיש רצון להבין, לא רק לנצח."
    ]
};

const tonePrefixes = [
    "בנחת:",
    "בקצרה וביובש:",
    "חד וברור:",
    "עם חיוך קטן וסכין מפלסטיק:"
];

const safetyWarnings = [
    { pattern: /כתובת|טלפון|תעודת זהות|איפה הוא גר|משפחה|ילדים/, message: "נראה שיש כאן מידע אישי. עדיף להסיר פרטים מזהים לפני פרסום." },
    { pattern: /איים|איום|לפגוע|להרוס|לנקום|להשמיד/, message: "הניסוח עלול להישמע מאיים. מומלץ לבחור תגובה שמציבה גבול בלי איום." },
    { pattern: /גזע|דת|נכות|מוצא|מגדר|נטייה/, message: "הימנע מתקיפה על זהות או מאפיין אישי. עדיף לתקוף טענה, לא אדם." }
];

function cleanContext(value) {
    const trimmed = value.trim().replace(/\s+/g, " ");
    if (!trimmed) {
        return "הטענה לא הוצגה בצורה שמאפשרת דיון רציני";
    }

    return trimmed.length > 180 ? `${trimmed.slice(0, 177)}...` : trimmed;
}

function buildReplies({ platform, context, goal, tone }) {
    const safeContext = cleanContext(context);
    const selectedTemplates = templates[goal] || templates.clarify;
    const prefix = tonePrefixes[Number(tone)] || tonePrefixes[1];

    return selectedTemplates.map((template) => {
        const reply = template.replace("{context}", safeContext);
        return `${prefix} ${reply}\n\nנכתב עבור ${platform}, לפרסום רק אחרי בדיקת הקשר ועובדות.`;
    });
}

function getWarnings(context) {
    return safetyWarnings
        .filter(({ pattern }) => pattern.test(context))
        .map(({ message }) => message);
}

function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

function renderReplies(replies, warnings) {
    const output = document.querySelector("#replyOutput");
    if (!output) return;

    const warningMarkup = warnings.length
        ? `<div class="warning-box"><strong>בדיקת בטיחות:</strong><ul>${warnings.map((warning) => `<li>${escapeHTML(warning)}</li>`).join("")}</ul></div>`
        : "";

    output.innerHTML = `
        ${warningMarkup}
        ${replies.map((reply, index) => `
            <article class="reply-card">
                <h4>אפשרות ${index + 1}</h4>
                <p>${escapeHTML(reply).replace(/\n/g, "<br>")}</p>
                <button type="button" class="copy-reply" data-reply="${encodeURIComponent(reply)}">העתק</button>
            </article>
        `).join("")}
    `;
}

const replyForm = document.querySelector("#replyForm");

if (replyForm) {
    replyForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(replyForm);
        const data = Object.fromEntries(formData.entries());
        const replies = buildReplies(data);
        const warnings = getWarnings(data.context || "");
        renderReplies(replies, warnings);
    });

    document.addEventListener("click", async (event) => {
        if (!event.target.matches(".copy-reply")) return;

        const button = event.target;
        const reply = decodeURIComponent(button.dataset.reply);

        try {
            await navigator.clipboard.writeText(reply);
            button.textContent = "הועתק";
        } catch {
            button.textContent = "סמן והעתק ידנית";
        }

        setTimeout(() => {
            button.textContent = "העתק";
        }, 1400);
    });
}
