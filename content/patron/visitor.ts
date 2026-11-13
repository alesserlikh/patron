export type VisitorLocation = {
  city: string;
  timeZone: string;
  country: string;
};
export const locationCityVersion = 2;
export const defaultLocation: VisitorLocation = {
  city: "Москва",
  timeZone: "Europe/Moscow",
  country: "RU",
};
export const visitorCopy = {
  cookiesLabel: "Cookies",
  cookiesDismiss: "Закрыть, оставить только необходимые cookies",
  settings: "Местоположение и cookies",
  locationTitle: "Время вашего города",
  locationLead:
    "Разрешите определить ваш город, чтобы показывать местное время.",
  locationPrivacy:
    "Браузер запросит доступ к геолокации. Координаты используются только для определения города на сервере: мы не сохраняем их и не передаём внешним сервисам.",
  locationFallback:
    "Без разрешения или при ошибке показываем Москву и московское время.",
  locate: "Определить мой город",
  locating: "Определяем город…",
  useMoscow: "Показывать Москву",
  retry: "Попробовать ещё раз",
  currentCity: "Сейчас показываем: ",
  close: "Закрыть",
  denied:
    "Доступ к геолокации запрещён. Разрешение можно изменить в настройках браузера. Пока показываем Москву и московское время.",
  unavailable:
    "Не удалось определить город. Пока показываем Москву и московское время. Можно повторить попытку.",
  timeout:
    "Не удалось определить город вовремя. Пока показываем Москву и московское время.",
  unsupported:
    "Геолокация недоступна в этом браузере или соединении. Показываем Москву и московское время.",
  found: "Город определён. Показываем местное время.",
  attribution: "Справочник городов: GeoNames · CC BY",
  cookiesLead: "Необходимые cookies сохраняют ваш выбор настроек.",
  cookiesDetail:
    "Рекламные и аналитические cookies не подключены. Разрешение cookies не даёт доступ к геолокации — его запросим отдельно.",
  cookiesAllow: "Разрешить запоминание",
  cookiesNecessary: "Только необходимые",
};
