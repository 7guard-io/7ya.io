'use strict';

const LINKS = {
  identity: { label: 'איגור ופרצקי', href: '/igor-vepretski/' },
  journey: { label: 'המסע', href: '/journey/' },
  work: { label: 'מפת העשייה', href: '/work/' },
  starton: { label: 'StartOn', href: '/starton/' },
  systems: { label: 'מערכות 7YA', href: '/systems/' },
  service: { label: 'שירות ציבורי', href: '/public-service/' },
  evidence: { label: 'Evidence Wall', href: '/evidence/' },
  influence: { label: 'מדיה והשפעה', href: '/influence/' },
  music: { label: 'מוזיקה', href: '/music/' },
  speaker: { label: 'הרצאות ובמה', href: '/speaker/' },
  contact: { label: 'יצירת קשר', href: '/contact/' },
  radar: { label: '7YA Radar', href: '/radar/' },
};

function answer(message) {
  const query = message.toLowerCase();

  if (/starton|נוער|youth|מרחב|גיימינג/.test(query)) {
    return {
      answer: 'StartOn הוא החזון החברתי של איגור למרחבי טכנולוגיה, יצירה ושייכות לנוער. האתר מפריד בין מודל, פיילוט, מקור ותוצאה.',
      links: [LINKS.starton, LINKS.evidence, LINKS.contact],
    };
  }
  if (/ראי|evidence|proof|מקור|אימות|verified/.test(query)) {
    return {
      answer: 'Evidence Wall מפריד בין VERIFIED, DOCUMENTED, SOURCE PENDING ו-PRIVATE. קישור אינו מוכיח אוטומטית היקף, תוצאה או שותפות.',
      links: [LINKS.evidence, LINKS.radar],
    };
  }
  if (/מערכ|system|oracle|ledger|provenance|merkle|pass|seeds/.test(query)) {
    return {
      answer: '7YA היא המערכת המארגנת: זהות ציבורית, ראיות, provenance, AI וניווט. איגור הוא הליבה האנושית ו-StartOn היא השליחות.',
      links: [LINKS.systems, LINKS.evidence, LINKS.work],
    };
  }
  if (/צבא|משטר|ביטחון|service|police|army/.test(query)) {
    return {
      answer: 'עמוד השירות הציבורי מציג ביוגרפיה ציבורית ללא מידע מבצעי. פרטים ללא מסמך צמוד נשארים כתיאור עצמי.',
      links: [LINKS.service, LINKS.journey, LINKS.evidence],
    };
  }
  if (/מוזיק|music|song|שיר|hip.?hop/.test(query)) {
    return {
      answer: 'המוזיקה היא חלק מהזהות היצירתית של איגור. קרדיטים ומדדים מוצגים רק כאשר קיים מקור ישיר.',
      links: [LINKS.music, LINKS.influence, LINKS.evidence],
    };
  }
  if (/איגור|igor|מסע|journey|ביוגר/.test(query)) {
    return {
      answer: 'איגור ופרצקי הוא יזם חברתי, יוצר ובונה מערכות ציבוריות. 7YA מחבר את המסע, StartOn, השירות, המדיה והראיות.',
      links: [LINKS.identity, LINKS.journey, LINKS.work],
    };
  }
  if (/הרצאה|ראיון|speaker|interview|contact|קשר|פאנל/.test(query)) {
    return {
      answer: 'להרצאה, ראיון, פאנל או שיחה עברו לעמוד הבמה או ליצירת קשר.',
      links: [LINKS.speaker, LINKS.contact],
    };
  }
  if (/ai|בינה|openai/.test(query)) {
    return {
      answer: 'ב-7YA, AI הוא כלי לניווט ובהירות. הוא אינו הגיבור, אינו מתחזה לאיגור ואינו ממציא הישגים.',
      links: [LINKS.systems, LINKS.evidence, LINKS.work],
    };
  }

  return {
    answer: 'אני מדריך 7YA. אפשר לשאול על איגור, המסע, StartOn, שירות, מערכות, ראיות, מדיה, מוזיקה, הרצאות או AI.',
    links: [LINKS.work, LINKS.identity, LINKS.evidence],
  };
}

module.exports = (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');

  if (request.method !== 'POST') {
    response.statusCode = 405;
    response.setHeader('Allow', 'POST');
    response.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  const message = typeof request.body?.message === 'string'
    ? request.body.message.trim()
    : '';

  if (!message || message.length > 1600) {
    response.statusCode = 422;
    response.end(JSON.stringify({ error: 'message must be 1-1600 characters' }));
    return;
  }

  response.statusCode = 200;
  response.end(JSON.stringify({ ...answer(message), mode: 'local-evidence-guide' }));
};
