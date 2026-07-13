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

function localAnswer(message) {
  const query = message.toLowerCase();

  if (/starton|נוער|youth|подрост|מרחב|גיימינג/.test(query)) {
    return {
      answer: 'StartOn הוא חזון למרחבי טכנולוגיה, יצירה ושייכות לנוער. המודל מחבר Play, Learn ו-Belong, אך האתר אינו מציג פיילוט, שותפות או תוצאה כעובדה בלי מקור.',
      links: [LINKS.starton, LINKS.evidence, LINKS.contact],
    };
  }

  if (/מערכ|system|oracle|ledger|provenance|מרקל|merkle|pass|seeds/.test(query)) {
    return {
      answer: '7YA כולל Public Identity OS, Evidence Wall, AI Guide, Radar ומסלולי פיתוח כמו Evidence Oracle ו-StartOn Seeds. כל רכיב מסומן לפי מצבו: בנוי, אבטיפוס, תכנון או נתיב שמור.',
      links: [LINKS.systems, LINKS.evidence, LINKS.work],
    };
  }

  if (/ראי|evidence|proof|מקור|דоказ|אימות|verified/.test(query)) {
    return {
      answer: 'Evidence Wall מפריד בין VERIFIED, DOCUMENTED, SELF-ATTESTED, PENDING ו-PRIVATE. קישור מוכיח שקיים תוכן; הוא לא בהכרח מוכיח היקף, תוצאה, שותפות או סמכות.',
      links: [LINKS.evidence, LINKS.radar],
    };
  }

  if (/צבא|משטר|ביטחון|service|police|army|служб/.test(query)) {
    return {
      answer: 'עמוד השירות הציבורי מרכז את הביוגרפיה הציבורית של איגור בצה״ל, אבטחה, משטרה ושירות מוניציפלי. עד להצמדת מסמכים ישירים, הפרטים מסומנים כתיאור עצמי ואין באתר מידע מבצעי.',
      links: [LINKS.service, LINKS.journey, LINKS.evidence],
    };
  }

  if (/מוזיק|music|song|שיר|рэп|hip.?hop/.test(query)) {
    return {
      answer: 'המוזיקה היא חלק מהזהות היצירתית של איגור. הארכיון מזכיר יצירות ושיתופי פעולה, אך קרדיטים, זכויות ומספרי השמעות אינם מוצגים ללא מקור ישיר.',
      links: [LINKS.music, LINKS.influence, LINKS.evidence],
    };
  }

  if (/איגור|igor|кто|מי אתה|journey|מסע|ביוגר/.test(query)) {
    return {
      answer: 'איגור ופרצקי הוא יזם חברתי, יוצר ובונה מערכות ציבוריות. 7YA מחבר את המסע שלו, StartOn, שירות, מדיה, מוזיקה, AI וראיות למפה ציבורית אחת.',
      links: [LINKS.identity, LINKS.journey, LINKS.work],
    };
  }

  if (/הרצאה|ראיון|פודקאסט|speaker|interview|contact|קשר|панел/.test(query)) {
    return {
      answer: 'לראיון, הרצאה, פאנל, שותפות או שיחה על StartOn ו-7YA, עברו לעמוד הבמה או ליצירת קשר. ערוץ הקשר הרשמי הוא hello@7ya.io.',
      links: [LINKS.speaker, LINKS.contact],
    };
  }

  if (/ai|בינה|искусствен|openai/.test(query)) {
    return {
      answer: 'ב-7YA, AI הוא כלי לניווט, בהירות, איתור פערים ובניית מערכות. הוא אינו הגיבור, אינו מתחזה לאיגור ואינו רשאי להמציא הישגים, נתונים, שותפים או תפקידים.',
      links: [LINKS.systems, LINKS.evidence, LINKS.work],
    };
  }

  return {
    answer: 'אני מדריך 7YA. אפשר לשאול על איגור, המסע, StartOn, השירות הציבורי, מערכות 7YA, ראיות, מדיה, מוזיקה, הרצאות או AI.',
    links: [LINKS.work, LINKS.identity, LINKS.evidence],
  };
}

function extractOutputText(data) {
  if (typeof data.output_text === 'string' && data.output_text.trim()) return data.output_text.trim();
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === 'output_text' && content.text) return content.text.trim();
    }
  }
  return '';
}

module.exports = async (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');

  if (request.method !== 'POST') {
    response.statusCode = 405;
    response.setHeader('Allow', 'POST');
    response.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  const message = typeof request.body?.message === 'string' ? request.body.message.trim() : '';
  const currentPath = typeof request.body?.path === 'string' ? request.body.path : '/';

  if (!message || message.length > 1600) {
    response.statusCode = 422;
    response.end(JSON.stringify({ error: 'message must be 1-1600 characters' }));
    return;
  }

  const fallback = localAnswer(message);
  if (!process.env.OPENAI_API_KEY) {
    response.statusCode = 200;
    response.end(JSON.stringify({ ...fallback, mode: 'local-guide' }));
    return;
  }

  try {
    const instructions = [
      'You are 7YA AI, the public guide for Igor Vepretski, StartOn and 7YA.',
      'Answer in the visitor language and remain concise, direct and human-first.',
      'Never claim to be Igor, never speak on his behalf, and never claim to be ChatGPT.',
      'Never invent achievements, metrics, partners, political positions, official roles, credentials, dates or outcomes.',
      'Distinguish verified facts from documented material, self-attested biography, plans and pending claims.',
      'Do not reveal family, minors, finances, legal matters, medical data, addresses, credentials, secrets or operational security information.',
      'Use only public routes in this site and recommend at most three.',
      'Core principle: people are the mission; AI is a tool; evidence comes before amplification.',
    ].join(' ');

    const apiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.6',
        store: false,
        instructions,
        input: `Current public route: ${currentPath}\nVisitor: ${message}`,
        max_output_tokens: 420,
      }),
    });

    const data = await apiResponse.json();
    if (!apiResponse.ok) throw new Error(data?.error?.message || 'OpenAI request failed');
    const answer = extractOutputText(data);
    if (!answer) throw new Error('Empty model response');

    response.statusCode = 200;
    response.end(JSON.stringify({
      answer,
      links: fallback.links,
      mode: 'openai',
      model: process.env.OPENAI_MODEL || 'gpt-5.6',
    }));
  } catch (error) {
    console.error('7YA AI fallback', error?.message);
    response.statusCode = 200;
    response.end(JSON.stringify({ ...fallback, mode: 'local-fallback' }));
  }
};
