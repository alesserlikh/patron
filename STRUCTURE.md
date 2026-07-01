# PATRON Сайт — Структура проекта

## Общая структура

Прото-сайт создан на основе HTML файла `patron_hero (1).html` и перенесен в Next.js 16 с React 19.

### Основные папки

```
app/
├── components/          # React компоненты
│   ├── Hero.tsx         # Hero секция
│   ├── Hero.module.css  # Стили Hero
│   ├── Navigation.tsx   # Навигация
│   ├── Navigation.module.css  # Стили навигации
│   └── index.ts         # Экспорты компонентов
│
├── lib/                 # Утилиты и константы
│   ├── ui-texts.ts      # Все текусты для UI
│   └── index.ts         # Экспорты утилит
│
├── globals.css          # Глобальные стили и переменные
├── layout.tsx           # Root layout
└── page.tsx             # Home page
```

## Использование текстов

Все тексты хранятся в файле [app/lib/ui-texts.ts](app/lib/ui-texts.ts) и импортируются в компоненты:

```typescript
import { uiTexts } from '@/app/lib/ui-texts';

// Использование в компоненте
const navTexts = uiTexts.nav;
const heroTexts = uiTexts.hero;
```

### Структура ui-texts

```typescript
uiTexts = {
  nav: {
    logo: string
    links: Array<{ label: string; href: string }>
    cta: string
  },
  hero: {
    eyebrow: string
    headline: { lines: Array<...>, accentWord: string }
    descriptors: Array<{ label: string; text: string }>
    buttons: { primary: string; secondary: string }
    stats: Array<{ value: string; label: string }>
    scrollHint: string
    bgTagline: string
  }
}
```

## Компоненты

### Navigation
Фиксированная навигация с логотипом, ссылками и CTA кнопкой.

**Props:** нет (использует `uiTexts.nav`)

**Файлы:**
- [app/components/Navigation.tsx](app/components/Navigation.tsx)
- [app/components/Navigation.module.css](app/components/Navigation.module.css)

### Hero
Основная hero секция с заголовком, описанием, статистикой.

**Props:** нет (использует `uiTexts.hero`)

**Файлы:**
- [app/components/Hero.tsx](app/components/Hero.tsx)
- [app/components/Hero.module.css](app/components/Hero.module.css)

## Цветовая схема

Переменные определены в [app/globals.css](app/globals.css):

```css
--bg:            #0D0C0A;           /* Фон */
--bg-2:          #141210;           /* Фон вторичный */
--accent:        #9092D4;           /* Акцентный цвет */
--accent-dim:    rgba(144,146,212,0.12);
--accent-line:   rgba(144,146,212,0.28);
--text-primary:  #F0EDE6;           /* Основной текст */
--text-secondary: #7A7670;          /* Вторичный текст */
--text-tertiary:  #3E3C38;          /* Третичный текст */
--border:        rgba(240,237,230,0.06);
```

## Шрифты

Используются Google Fonts:
- **Inter** (300, 400, 500, 800, 900) — для заголовков и ключевых элементов
- **DM Sans** (300, 400) — для основного текста

## Запуск

```bash
npm run dev
# Сайт будет доступен на http://localhost:3000
```

## Как расширять

### Добавить новые тексты
1. Отредактировать [app/lib/ui-texts.ts](app/lib/ui-texts.ts)
2. Добавить новое свойство в `uiTexts`
3. Импортировать в компоненте и использовать

### Добавить новый компонент
1. Создать `NewComponent.tsx` в `app/components/`
2. Создать `NewComponent.module.css` для стилей
3. Экспортировать из `app/components/index.ts`
4. Импортировать в `page.tsx` или другом компоненте

### Изменить стили
CSS модули находятся рядом с компонентами. Редактируйте соответствующий `.module.css` файл.

Глобальные стили и переменные в [app/globals.css](app/globals.css).
