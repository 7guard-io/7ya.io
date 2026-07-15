import type { Locale } from '@/lib/i18n';

const siteUrl = 'https://7ya.io';

export function personSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}/igor-vepretski/#person`,
    name: 'Igor Vepretski',
    alternateName: ['איגור ופרצקי', 'Игорь Вепрецкий'],
    url: `${siteUrl}/igor-vepretski/`,
    mainEntityOfPage: `${siteUrl}/igor-vepretski/`,
    description: locale === 'he'
      ? 'יזם חברתי, יוצר ציבורי, מייסד StartOn ובונה 7YA.'
      : locale === 'ru'
        ? 'Социальный предприниматель, публичный автор, основатель StartOn и создатель 7YA.'
        : 'Social entrepreneur, public creator, founder of StartOn and builder of 7YA.',
    knowsLanguage: ['he', 'en', 'ru'],
    affiliation: { '@id': `${siteUrl}/starton/#organization` },
    sameAs: [
      'https://www.linkedin.com/in/vepretski/',
      'https://linktr.ee/igor.vepretski',
      'https://open.spotify.com/artist/0fgRoQ6PoCHlVCIr8a5d6u'
    ]
  };
}

export function startonSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/starton/#organization`,
    name: 'StartOn',
    url: 'https://starton.org.il/',
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'Israeli Amuta Number',
      value: '580752814'
    },
    founder: { '@id': `${siteUrl}/igor-vepretski/#person` },
    description: locale === 'he'
      ? 'עמותה חברתית־טכנולוגית לבניית מרחבי Training, Community ו־Experience עבור נוער.'
      : locale === 'ru'
        ? 'Социально-технологическая организация, создающая пространства Training, Community и Experience для молодежи.'
        : 'A social-technology non-profit building Training, Community and Experience spaces for youth.',
    areaServed: { '@type': 'Country', name: 'Israel' },
    knowsAbout: ['Youth development', 'Technology education', 'Community', 'Digital creation']
  };
}
