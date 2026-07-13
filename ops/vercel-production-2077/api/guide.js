const answers = {
  starton: 'StartOn היא יוזמה חברתית־טכנולוגית לנוער. שלבי תכנון ופיילוט מסומנים בנפרד מתוצאות שהושלמו.',
  pass: '7YA Pass הוא נתיב מוצר שמור ואינו תעודה, רישיון או הרשאה מוסדית.',
  evidence: 'Evidence Wall מפריד בין DOCUMENTED, SELF-ATTESTED, SOURCE PENDING, BUILT ו־RESERVED.',
  igor: 'איגור ופרצקי מוצג כיזם חברתי, יוצר ובונה 7YA. טענות ביוגרפיות מסומנות לפי מצב המקור.'
};
module.exports = (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  if (request.method === 'OPTIONS') { response.statusCode = 204; response.end(); return; }
  if (request.method !== 'POST') { response.statusCode = 405; response.end(JSON.stringify({error:'METHOD_NOT_ALLOWED'})); return; }
  const message = String(request.body?.message || '').trim();
  if (!message || message.length > 1600) { response.statusCode = 422; response.end(JSON.stringify({error:'INVALID_MESSAGE'})); return; }
  const q = message.toLowerCase();
  const key = Object.keys(answers).find((candidate) => q.includes(candidate));
  response.statusCode = 200;
  response.end(JSON.stringify({answer:key?answers[key]:'אין למדריך המקומי מקור מספיק לתשובה הזאת. עברו ל־/evidence/ או שלחו תיקון דרך /contact/.',mode:'local-evidence-bounded',citations:key?['/evidence/']:[]}));
};
