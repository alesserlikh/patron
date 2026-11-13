import type { ContactInfo, SiteNavigationItem } from "./types";

export const sectionLabels = {
  agency: "О нас",
  services: "Услуги",
  cases: "Кейсы",
  process: "Рабочий процесс",
};
export const contacts: ContactInfo = {
  email: "hello@ptrn.pro",
  telegram: "@patron_pro",
  telegramUrl: "https://t.me/patron_pro",
  phone: null,
  privacyUrl: null,
  consentUrl: null,
};
export const navigation: SiteNavigationItem[] = [
  { id: "agency", label: sectionLabels.agency },
  { id: "services", label: sectionLabels.services },
  { id: "cases", label: sectionLabels.cases },
  { id: "process", label: sectionLabels.process },
];

export const imageDimensions: Record<
  string,
  { width: number; height: number }
> = {
  "/patron/new/028484740663e9f594f00d4e2a70bcf9.jpg": {
    width: 2000,
    height: 1125,
  },
  "/patron/new/18f1d1d4a3e0375513ea54207d867afc.jpg": {
    width: 1751,
    height: 984,
  },
  "/patron/new/d0841e8978d2e7c5bad046ddf53d741a.jpg": {
    width: 1664,
    height: 936,
  },
};

// Общие элементы: меню, футер, логотип, контакты и служебные подписи.
export const ui = {
  homeLabel: "PATRON — в начало страницы",
  logo: " PATRON ",
  navigationLabel: "Разделы страницы",
  discussProject: "Обсудить проект",
  discussShort: "Обсудить",
  diagonalArrow: "↗",
  menu: "Меню",
  discussProjectSpaced: "Обсудить проект ",
  telegramLabel: `Telegram ${contacts.telegram}`,
  phoneUnavailable: "Телефон уточняется",
  tagline: "Стратегия · События · Продакшн",
  dash: "—",
  arrow: "→",
  closeSymbol: "✕",
  space: " ",
  backArrow: "←",
  counterSeparator: " / ",
  metaSeparator: " · ",
  titleSeparator: " — ",
  playSymbol: "▶",
  contactHeading: "Связаться",
  sectionsHeading: "Разделы",
  documentsHeading: "Документы",
  privacy: "Политика конфиденциальности",
  consent: "Согласие на обработку данных",
  backToTop: "Наверх",
  upArrow: "↑",
  brand: "PATRON",
  copyright: "© 2026 PATRON · Москва",
  close: "Закрыть",
  check: "✓",
  menuOpen: "Открыть меню",
  menuClose: "Закрыть меню",
  privacyUnavailable: "Документ ожидает подтверждения",
};
