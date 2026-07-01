/**
 * UI текусты для patron сайта
 * Импортируются на страницы и компоненты
 */

export const uiTexts = {
  // ─── NAVIGATION ───
  nav: {
    logo: 'патрон',
    links: [
      { label: 'Подход', href: '#' },
      { label: 'Форматы', href: '#' },
      { label: 'Методология', href: '#' },
      { label: 'Кейсы', href: '#' },
    ],
    cta: 'Обсудить задачу',
  },

  // ─── HERO SECTION ───
  hero: {
    eyebrow: 'Продюсерский центр · Технологический бизнес',
    
    // Headline (разделен на строки для типографики)
    headline: {
      lines: [
        { text: 'Большинство агентств', weight: 'thin', suffix: undefined },
        { text: 'хорошо закрывают продакшн.', weight: 'thin', suffix: undefined },
        { text: 'Мы работаем с теми,', weight: 'bold', suffix: undefined },
        { text: 'кому этого', weight: 'bold', suffix: 'недостаточно.' },
      ],
      accentWord: 'недостаточно.',
    },

    // Descriptor блоки
    descriptors: [
      {
        label: 'Позиция',
        text: 'Стратегический продюсер — входим до брифа, остаёмся после события, фиксируем KPI на старте.',
      },
      {
        label: 'Для кого',
        text: 'Технологический бизнес: IT, геймдев, финтех, медтех. Директора по маркетингу и коммуникациям, для кого цена ошибки высока.',
      },
      {
        label: 'Результат',
        text: 'Событие с измеримым эффектом: аудитория, сделки, восприятие бренда — в Post Event Intelligence Report.',
      },
    ],

    // CTA кнопки
    buttons: {
      primary: 'Обсудить задачу',
      secondary: 'Посмотреть кейсы',
    },

    // Статистика (bottom bar)
    stats: [
      { value: '40+', label: 'проектов' },
      { value: '21', label: 'страна' },
      { value: '18', label: 'лет экспертизы' },
      { value: '60 000', label: 'гостей на одном событии' },
    ],

    // Scroll hint
    scrollHint: 'Листать',

    // Background tagline (vertical text)
    bgTagline: 'PATRON',
  },
} as const;

// Type exports для типизации
export type UITexts = typeof uiTexts;
