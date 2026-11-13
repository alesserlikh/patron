# PATRON

Одностраничный сайт на Next.js 16 и React 19. Действующая страница: `app/page.tsx` → `app/components/patron/PatronPage.tsx`.

## Где менять тексты

Весь контент действующего интерфейса находится в `content/patron/`:

- `ui.ts` — меню, футер, контакты, логотип и общие служебные подписи.
- `hero.ts` — первый экран.
- `lead.ts` — экран заявки, попап и все состояния формы.
- `about.ts` — манифест и принципы раздела «О нас».
- `stats.ts` — экран статистики.
- `servises.ts` — услуги, обзор и все направления от «Стратегия» до «Аналитика».
- `cases.ts` — карточки кейсов и их попапы.
- `process.ts` — процесс и попапы этапов.
- `visitor.ts` — геолокация, часы и cookies.
- `seo.ts` — поиск, метатеги, карточки ссылок и данные организации.
- `types.ts` — общие типы данных.

Подробная карта экспортов, примеры импортов и места отображения: [content/patron/README.md](content/patron/README.md).

Прежние `copy.ts`, `site.ts`, `services.ts`, `phases.ts` заменены новой структурой и удалены. Старые компоненты `Hero.tsx`, `PatronHome.tsx` и словари `app/lib/content.ts`, `app/lib/ui-texts.ts` не используются текущей главной страницей.

## Локальный запуск

```bash
npm install
npm run dev
```

Адрес: http://localhost:3000.

## Проверки и сборка

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run start
```

Сверка контента с интерфейсом: `node scripts/patron-copy-check.cjs`. Проверка использует Playwright из локального npm-кэша; другой путь задаётся через `PATRON_PLAYWRIGHT`, адрес сайта — через `PATRON_BASE_URL`. Отчёт: [docs/patron-copy/README.md](docs/patron-copy/README.md).

Геолокация и сохранённый город: [docs/patron-city/README.md](docs/patron-city/README.md). Панель cookies: [docs/patron-cookie-banner/README.md](docs/patron-cookie-banner/README.md).

SEO и превью: [docs/patron-seo/README.md](docs/patron-seo/README.md). Пересборка бейджа и иконок — `npm run seo:assets`, проверка метатегов на работающем сайте — `npm run seo:check`.
