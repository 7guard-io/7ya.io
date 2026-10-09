// One primary navigation shared by every generated language and public route.
const labels = {
  he:['ניווט ראשי','ראשי','הסיפור שלי','העשייה','נושאים','מדיה','דברו איתי'],
  en:['Primary navigation','Home','My story','Work','Topics','Media','Contact'],
  ru:['Основная навигация','Главная','Моя история','Дела','Темы','Медиа','Связаться'],
  ar:['التنقل الرئيسي','الرئيسية','قصتي','العمل','المواضيع','الوسائط','تواصل معي'],
};
const locales=['he','en','ru','ar'];
const routePath=(locale,route='')=>(locale==='he'?'/':`/${locale}/`)+(route?`${route}/`:'');
export function primaryNavigation(locale,route='') {
  const c=labels[locale]||labels.he;
  const home=routePath(locale);
  const destinations=[home,routePath(locale,'igor-vepretski'),home+'#work',home+'#topics',routePath(locale,'media'),routePath(locale,'contact')];
  const links=destinations.map((href,index)=>`<a href="${href}"${index===5?' class="seven-human-nav-cta"':''}${(!route&&index===0)||(route==='igor-vepretski'&&index===1)||(route==='media'&&index===4)||(route==='contact'&&index===5)?' aria-current="page"':''}>${c[index+1]}</a>`).join('');
  const languageLinks=locales.map(lang=>`<a href="${routePath(lang,route)}" lang="${lang}" dir="${lang==='he'||lang==='ar'?'rtl':'ltr'}"${lang===locale?' aria-current="true"':''}>${{he:'עברית',en:'EN',ru:'RU',ar:'العربية'}[lang]}</a>`).join('');
  return `<nav class="seven-human-nav" data-seven-human-nav aria-label="${c[0]}">${links}<span class="seven-language-switch" data-seven-languages>${languageLinks}</span></nav>`;
}
