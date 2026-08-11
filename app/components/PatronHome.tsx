'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import styles from './PatronHome.module.css';

type Question = {
  key: 'task' | 'industry' | 'scale' | 'timing' | 'who' | 'contact';
  question: string;
  hint: string;
  placeholder: string;
};

const navItems = [
  { label: 'Подход', id: 'approach' },
  { label: 'Форматы', id: 'formats' },
  { label: 'Методология', id: 'method' },
  { label: 'Кейсы', id: 'cases' },
];

const introLinks = [
  ['01', 'Подход', 'Отвечаем не за площадку и свет, а за то, что рынок начнёт думать о вас иначе.', 'approach'],
  ['02', 'Форматы', 'Конференция, запуск, саммит, роуд-шоу. Форма подчиняется задаче, а не привычке.', 'formats'],
  ['03', 'Методология', 'От диагностики бизнес-задачи до отчёта, который читает правление.', 'method'],
  ['04', 'Кейсы', 'Финтех, геймдев, медтех: что изменилось в воронке после события.', 'cases'],
];

const stats = [
  ['40+', 'реализованных проектов'],
  ['21', 'страна проведения'],
  ['18', 'лет в индустрии'],
  ['60 000', 'гостей на одном событии'],
];

const approachCards = [
  ['01', 'Входим до брифа', 'Бриф — это уже чей-то ответ. Мы начинаем с вопроса: что должно измениться в бизнесе и способно ли событие сделать это быстрее других инструментов.'],
  ['02', 'KPI на старте', 'Событие живёт в тех же метриках, что и весь маркетинг: стоимость контакта, качество лида, сдвиг в восприятии. Мы считаем их до сметы, а не после праздника.'],
  ['03', 'Одна команда на цикл', 'Стратег, продюсер и аналитик остаются с вами от первой встречи до финального отчёта. Никакой передачи дел между отделами и повторных вводных.'],
  ['04', 'Остаёмся после', 'Событие заканчивается, коммуникация — нет. Post Event Intelligence Report превращает один день в аргументированный план на следующий год.'],
];

const formats = [
  ['photo 3:2 — conference', 'Конференция', '300 — 3 000 участников', 'Ваша отраслевая повестка, а не очередной митап: программа, спикерский пул и деловая часть, ради которой возвращаются через год.'],
  ['photo 3:2 — launch', 'Продуктовый запуск', 'офлайн + трансляция', 'День, который задаёт тон всем публикациям о продукте: сценарий, демо, работа с профильной прессой и аналитиками.'],
  ['photo 3:2 — summit', 'Партнёрский саммит', '50 — 400 гостей', 'Закрытый контур для тех, кто приносит выручку. Каждая встреча в расписании собрана под конкретную сделку.'],
  ['photo 3:2 — internal', 'Внутреннее событие', 'команды 100 — 5 000', 'Стратегия, услышанная командой, а не разосланная письмом. На удержание влияет сильнее любого корпоративного портала.'],
  ['photo 3:2 — road show', 'Роуд-шоу', 'серия в 3 — 12 городах', 'Единое ядро и локальная адаптация: рынок видит одну компанию, а не двенадцать разных подрядчиков.'],
];

const methodSteps = [
  ['01', 'Диагностика', '2 недели', 'Интервью со стейкхолдерами, аудит прошлых событий, разбор аудитории и конкурентного поля. На выходе — задача, с которой согласны все.'],
  ['02', 'Стратегия и KPI', '3 недели', 'Концепция, путь гостя по минутам, метрики и способ их снятия. Вы понимаете, за что платите, до подписания сметы.'],
  ['03', 'Продюсирование', '6 — 16 недель', 'Программа, спикеры, партнёры, продакшн и коммуникационная кампания — в одном плане, одном бюджете и одном чате.'],
  ['04', 'Реализация', 'день события', 'Оперативный штаб, готовые сценарии на сбои, данные снимаются в реальном времени. Решения принимаются в моменте, а не на разборе.'],
  ['05', 'Аналитика', '3 недели после', 'Факт против плана, качество аудитории, влияние на пайплайн и приоритеты следующего цикла коммуникаций.'],
];

const cases = [
  {
    meta: 'финтех · конференция',
    title: 'Годовая платформа для рынка',
    text: 'Событие существовало семь лет и считалось имиджевым. Перестроили программу вокруг сделок — окупилось внутри квартала.',
    numbers: [['2 400', 'участников'], ['74', 'сделки в пайплайне']],
  },
  {
    meta: 'геймдев · анонс',
    title: 'Анонс тайтла на стадионе',
    text: 'Стадион и трансляция как один медиапродукт: волна публикаций пошла не после события, а вместе с ним.',
    numbers: [['60 000', 'гостей'], ['12 млн', 'охват']],
  },
  {
    meta: 'медтех · саммит',
    title: 'Закрытый совет для CxO',
    text: '120 человек вместо тысячи. Расписание встреч собрали заранее — каждый разговор вёл к конкретному решению.',
    numbers: [['120', 'CxO'], ['41', 'целевая встреча']],
  },
];

const questions: Question[] = [
  { key: 'task', question: 'Что должно измениться после события?', hint: 'Не повод, а результат: продажи, восприятие, наём, удержание.', placeholder: 'Например: вывести платформу на партнёрский рынок' },
  { key: 'industry', question: 'В какой индустрии работаете?', hint: 'IT, геймдев, финтех, медтех или что-то, чего мы ещё не видели.', placeholder: 'Финтех' },
  { key: 'scale', question: 'Есть ли формат в голове?', hint: 'Если да — какой и на сколько человек. Если нет — так и напишите.', placeholder: 'Конференция примерно на 800 человек' },
  { key: 'timing', question: 'Сроки и порядок бюджета?', hint: 'Даже грубая вилка помогает сразу говорить предметно.', placeholder: 'Ноябрь 2026, 12–15 млн ₽' },
  { key: 'who', question: 'Как к вам обращаться?', hint: 'Имя и компания.', placeholder: 'Анна, Netcore' },
  { key: 'contact', question: 'Куда прислать ответ?', hint: 'Email или телеграм. Продюсер напишет в течение рабочего дня.', placeholder: 'anna@company.ru' },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
}

export function PatronHome() {
  const [navShown, setNavShown] = useState(false);
  const [markShown, setMarkShown] = useState(false);
  const [scrimOn, setScrimOn] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<'brief' | 'contacts'>('brief');
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [leadName, setLeadName] = useState('');
  const [leadContact, setLeadContact] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [leadId, setLeadId] = useState('');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const hero = document.getElementById('hero');
      const past = hero ? y > hero.offsetHeight - 140 : y > 500;
      const mark = document.querySelector('[data-mark]');
      const gone = mark ? mark.getBoundingClientRect().bottom < 62 : past;
      const doc = document.scrollingElement || document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;

      setNavShown(past);
      setMarkShown(gone);
      setScrimOn(y > 40);
      setScrollProgress(max > 0 ? Math.min(1, y / max) : 0);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll, { capture: true });
    };
  }, []);

  useEffect(() => {
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    let lastTick = Date.now();
    const onMove = (e: PointerEvent) => {
      target.x = ((e.clientX / window.innerWidth) - 0.5) * 140;
      target.y = ((e.clientY / window.innerHeight) - 0.5) * 140;
    };
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.055;
      cur.y += (target.y - cur.y) * 0.055;
      const doc = document.scrollingElement || document.documentElement;
      const sp = doc.scrollHeight > window.innerHeight ? (doc.scrollTop || 0) / (doc.scrollHeight - window.innerHeight) : 0;

      document.querySelectorAll<HTMLElement>('[data-mesh]').forEach((el) => {
        const fx = Number(el.dataset.fx || 1);
        const fy = Number(el.dataset.fy || 1);
        const sx = Number(el.dataset.sx || 0);
        const sy = Number(el.dataset.sy || 0);
        const sc = 1 + sp * Number(el.dataset.sc || 0);
        const x = cur.x * fx + sp * sx;
        const y = cur.y * fy + sp * sy;
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${sc.toFixed(3)})`;
      });
      lastTick = Date.now();
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointermove', onMove, { passive: true, capture: true });
    raf = requestAnimationFrame(tick);
    const fallback = window.setInterval(() => {
      if (Date.now() - lastTick > 400) tick();
    }, 200);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointermove', onMove, { capture: true });
      window.clearInterval(fallback);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const typoEls = Array.from(document.querySelectorAll<HTMLElement>('[data-typo]'));
    const navButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-nav]'));
    let frame = 0;
    let lastPaint = Date.now();

    const scanReveals = () => {
      const h = window.innerHeight;
      revealEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < h * 0.9 && rect.bottom > 0;
        if (inView) {
          const delay = Number(el.dataset.delay || 0);
          window.setTimeout(() => el.classList.add(styles.revealed), delay);
        } else if (rect.top > 0) {
          el.classList.remove(styles.revealed);
        }
      });
    };

    const paint = () => {
      const h = window.innerHeight;
      typoEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > h + 200) return;
        const center = (rect.top + rect.height / 2) / h;
        let scale;
        let y;
        if (center > 0.5) {
          const t = Math.min(1, (center - 0.5) / 0.62);
          const eased = 1 - Math.pow(1 - t, 3);
          scale = 1 - 0.13 * eased;
          y = 34 * eased;
        } else {
          const t = Math.min(1, (0.5 - center) / 0.72);
          const eased = 1 - Math.pow(1 - t, 3);
          scale = 1 - 0.16 * eased;
          y = -42 * eased;
        }
        el.style.transform = `scale(${scale.toFixed(4)}) translateY(${y.toFixed(1)}px)`;
      });
      scanReveals();
      lastPaint = Date.now();
      frame = requestAnimationFrame(paint);
    };

    const activeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navButtons.forEach((button) => {
          const active = button.dataset.nav === entry.target.id;
          button.classList.toggle(styles.navActive, active);
        });
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    ['approach', 'formats', 'method', 'cases'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) activeObserver.observe(el);
    });

    frame = requestAnimationFrame(paint);
    const fallback = window.setInterval(() => {
      if (Date.now() - lastPaint > 400) paint();
    }, 200);

    return () => {
      activeObserver.disconnect();
      window.clearInterval(fallback);
      cancelAnimationFrame(frame);
    };
  }, []);

  const progress = useMemo(() => {
    if (sent) return 100;
    if (mode === 'contacts') return 50;
    return Math.round((step / questions.length) * 100);
  }, [mode, sent, step]);

  const current = questions[Math.min(step, questions.length - 1)];
  const isLast = step === questions.length - 1;

  const scrimStyle: CSSProperties = {
    opacity: scrimOn ? 1 : 0,
    backdropFilter: scrimOn ? 'blur(16px)' : 'blur(0px)',
    WebkitBackdropFilter: scrimOn ? 'blur(16px)' : 'blur(0px)',
  };

  function onHint() {
    if (navShown) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    scrollToSection('intro');
  }

  function openAssistant(nextMode: 'brief' | 'contacts' = 'brief') {
    setModalOpen(true);
    setMode(nextMode);
    setSent(false);
    setBusy(false);
    setStep(0);
    setDraft('');
    setAnswers({});
  }

  function saveLead(payload: Record<string, unknown>) {
    const id = `PTR-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    try {
      const cur = JSON.parse(localStorage.getItem('patron_crm_leads') || '[]');
      cur.push({ id, at: new Date().toISOString(), ...payload });
      localStorage.setItem('patron_crm_leads', JSON.stringify(cur));
    } catch {
      // Local CRM stub only.
    }
    return id;
  }

  function finish(kind: 'brief' | 'short', nextAnswers = answers) {
    const id = saveLead({
      kind,
      answers: nextAnswers,
      name: leadName || nextAnswers.who || '',
      contact: leadContact || nextAnswers.contact || '',
    });
    const fallback = kind === 'short'
      ? 'Заявка у продюсера. Ответим в течение рабочего дня и предложим тридцать минут на разговор.'
      : `Задача: ${nextAnswers.task || '—'}\nИндустрия: ${nextAnswers.industry || '—'}\nФормат: ${nextAnswers.scale || '—'}\nСроки и бюджет: ${nextAnswers.timing || '—'}\n\nБриф у продюсера. Ответим в течение рабочего дня.`;

    setLeadId(id);
    setSent(true);
    setBusy(false);
    setSummary(fallback);
  }

  function nextQuestion() {
    const nextAnswers = { ...answers, [current.key]: draft.trim() };
    setAnswers(nextAnswers);
    if (isLast) {
      setLeadName(nextAnswers.who || leadName);
      setLeadContact(nextAnswers.contact || leadContact);
      finish('brief', nextAnswers);
      return;
    }
    const nextStep = step + 1;
    setStep(nextStep);
    setDraft(nextAnswers[questions[nextStep].key] || '');
  }

  function backQuestion() {
    if (step === 0) {
      setModalOpen(false);
      return;
    }
    const prevStep = step - 1;
    setStep(prevStep);
    setDraft(answers[questions[prevStep].key] || '');
  }

  return (
    <main className={styles.page}>
      <div className={styles.ambient} aria-hidden="true">
        <div data-mesh="1" data-fx="1.1" data-fy="0.9" data-sx="-260" data-sy="-420" data-sc="0.35" className={styles.ambientLayer}><span className={styles.orbA} /></div>
        <div data-mesh="1" data-fx="-1.5" data-fy="-1.2" data-sx="320" data-sy="-880" data-sc="0.5" className={styles.ambientLayer}><span className={styles.orbB} /></div>
        <div data-mesh="1" data-fx="0.7" data-fy="-0.5" data-sx="-180" data-sy="-620" data-sc="0.25" className={styles.ambientLayer}><span className={styles.orbC} /></div>
        <div data-mesh="1" data-fx="-0.9" data-fy="1.4" data-sx="420" data-sy="-1100" data-sc="0.6" className={styles.ambientLayer}><span className={styles.orbD} /></div>
      </div>

      <header className={styles.header}>
        <div className={styles.headerScrim} style={scrimStyle} aria-hidden="true" />
        <button className={styles.brandButton} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Image className={`${styles.headMark} ${markShown ? styles.headMarkVisible : ''}`} src="/patron/patron-mark.svg" alt="" width={40} height={24} priority />
          <span>PATRON</span>
        </button>
        <div className={styles.headerCenter}>
          <div className={`${styles.tagline} ${navShown ? styles.taglineHidden : ''}`}>Событие как часть стратегии</div>
          <nav className={`${styles.secNav} ${navShown ? styles.secNavVisible : ''}`}>
            {navItems.map((item) => <button key={item.id} data-nav={item.id} onClick={() => scrollToSection(item.id)}>{item.label}</button>)}
          </nav>
        </div>
        <button className={styles.headerCta} onClick={() => openAssistant('brief')}><span />Обсудить задачу</button>
      </header>

      <section id="hero" className={styles.hero}>
        <div className={styles.markSlot}>
          <Image data-mark="1" src="/patron/patron-mark.svg" alt="" width={330} height={193} priority />
        </div>
        <div className={styles.heroTitleWrap} data-typo="1"><h1>PATRON</h1></div>
        <div className={styles.kicker}>Продюсерский центр</div>
        <p>Одно событие может изменить мнение рынка о компании. Мы делаем такие — и показываем, что именно изменилось.</p>
      </section>

      <button className={styles.scrollHint} data-scrollhint="1" onClick={onHint}>
        <span>
          <i className={styles.hintFill} style={{ height: `${scrollProgress * 100}%` }} />
          <i className={`${styles.hintDot} ${navShown ? styles.hintDotHidden : ''}`} />
          <i className={`${styles.hintArrow} ${navShown ? styles.hintArrowVisible : ''}`} />
        </span>
        <b>{navShown ? 'Наверх' : 'Листать'}</b>
      </button>

      <section id="intro" className={styles.intro}>
        <div className={styles.container}>
          <div className={styles.introKicker} data-reveal="1">Разделы</div>
          <div className={styles.introList}>
            {introLinks.map(([num, title, text, id], index) => (
              <button key={id} className={styles.introLink} data-reveal="1" data-delay={index * 90} onClick={() => scrollToSection(id)}>
                <span>{num}</span>
                <strong>{title}</strong>
                <p>{text}</p>
                <i>→</i>
              </button>
            ))}
          </div>
          <div className={styles.actionRow} data-reveal="1">
            <button className={styles.primaryButton} onClick={() => openAssistant('brief')}><span />Обсудить задачу</button>
            <button className={styles.secondaryButton} onClick={() => scrollToSection('cases')}>Посмотреть кейсы</button>
          </div>
          <div className={styles.stats} data-reveal="1">
            {stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
          </div>
        </div>
      </section>

      <section id="approach" className={`${styles.section} ${styles.blueSection}`}>
        <div className={styles.container}>
          <SectionHead index="01" label="Подход" title={<>Продюсер,<br />а не подрядчик</>} text="Подрядчик исполняет смету. Продюсер отвечает за то, ради чего всё затевалось: мы ведём событие от формулировки бизнес-задачи до цифр в годовом отчёте." />
          <div className={styles.cardGrid}>{approachCards.map(([num, title, text], index) => <article key={num} className={styles.glassCard} data-reveal="1" data-delay={index * 110}><span>{num}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>

      <section id="formats" className={styles.section}>
        <div className={styles.container}>
          <SectionHead index="02" label="Форматы" title="Пять типов задач" text="Формат — следствие диагностики. Иногда честный вывод в том, что событие вам сейчас не нужно; мы говорим об этом на первой встрече." />
          <div className={styles.formatGrid}>{formats.map(([visual, title, meta, text], index) => <article key={title} className={styles.formatCard} data-reveal="1" data-delay={index * 100}><div className={styles.visualPlaceholder}><span>{visual}</span></div><div><h3>{title}</h3><span>{meta}</span><p>{text}</p></div></article>)}</div>
        </div>
      </section>

      <section id="method" className={`${styles.section} ${styles.tealSection}`}>
        <div className={styles.container}>
          <SectionHead index="03" label="Методология" title={<>Пять этапов,<br />один владелец</>} text="Ответственность не передаётся по цепочке: с вами одна команда — от первого вопроса до последней цифры в отчёте." />
          <div className={styles.timeline}>{methodSteps.map(([num, title, duration, text], index) => <article key={num} data-reveal="1" data-delay={index * 90}><span>{num}</span><div><h3>{title}</h3><b>{duration}</b></div><p>{text}</p></article>)}</div>
        </div>
      </section>

      <section id="cases" className={styles.section}>
        <div className={styles.container}>
          <SectionHead index="04" label="Кейсы" title={<>Что считаем<br />результатом</>} text="Не охват ради охвата. Три проекта, где после события изменились цифры, за которые отвечает бизнес." />
          <div className={styles.caseGrid}>{cases.map((item, index) => <article key={item.title} className={styles.caseCard} data-reveal="1" data-delay={index * 120}><div className={styles.caseVisual}><span>case visual 16:9</span></div><div className={styles.caseBody}><span>{item.meta}</span><h3>{item.title}</h3><p>{item.text}</p><div className={styles.caseNumbers}>{item.numbers.map(([value, label]) => <div key={label}><strong>{value}</strong><small>{label}</small></div>)}</div></div></article>)}</div>
        </div>
      </section>

      <section id="contacts" className={`${styles.section} ${styles.contactSection}`}>
        <div className={styles.container}>
          <div className={styles.contactLayout} data-reveal="1">
            <div><div className={styles.sectionIndex}><span>05</span><i /><span>Контакты</span></div><h2>Обсудим задачу</h2><p>Четыре вопроса — и продюсер придёт на встречу, уже понимая задачу. Не любите формы: заберите контакты и напишите напрямую.</p><button className={styles.primaryButton} onClick={() => openAssistant('brief')}><span />Обсудить задачу</button></div>
            <div className={styles.contactsList}><Contact label="Почта" value="hello@ptrn.pro" href="mailto:hello@ptrn.pro" /><Contact label="Телеграм" value="@patron_pro" href="https://t.me/" /><Contact label="Телефон" value="+7 495 000-00-00" href="tel:+74950000000" /><Contact label="Офис" value="Москва, Пресненская наб., 12" /></div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLine} />
        <div className={styles.footerInner}>
          <Image src="/patron/patron-logo.svg" alt="PATRON" width={390} height={159} />
          <div>{[...navItems, { label: 'Контакты', id: 'contacts' }].map((item) => <button key={item.id} onClick={() => scrollToSection(item.id)}>{item.label}</button>)}</div>
          <span>© 2026 PATRON · Продюсерский центр</span>
        </div>
      </footer>

      {modalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <button className={styles.modalBackdrop} onClick={() => setModalOpen(false)} aria-label="Закрыть" />
          <div className={styles.modal}>
            <div className={styles.modalTop}><div><span />{sent ? 'Заявка · CRM' : mode === 'contacts' ? 'Контакты' : 'AI-ассистент · бриф'}</div><button onClick={() => setModalOpen(false)}>×</button></div>
            <div className={styles.progress}><i style={{ width: `${progress}%` }} /></div>
            {!sent && mode === 'brief' && <div className={styles.questionPane}><h2>{current.question}</h2><p>{current.hint}</p><textarea value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); nextQuestion(); } }} placeholder={current.placeholder} autoFocus /><div className={styles.modalActions}><div><button className={styles.modalPrimary} onClick={nextQuestion}>{isLast ? 'Отправить бриф' : 'Далее'}</button><button className={styles.modalSecondary} onClick={backQuestion}>Назад</button></div><button className={styles.linkButton} onClick={() => setMode('contacts')}>Пропустить — сразу контакты</button></div><div className={styles.stepLabel}>Шаг {step + 1} из {questions.length}</div></div>}
            {!sent && mode === 'contacts' && <div className={styles.questionPane}><h2>Контакты продюсерского центра</h2><div className={styles.compactContacts}><Contact label="Почта" value="hello@ptrn.pro" href="mailto:hello@ptrn.pro" /><Contact label="Телеграм" value="@patron_pro" href="https://t.me/" /><Contact label="Телефон" value="+7 495 000-00-00" href="tel:+74950000000" /></div><p>Оставьте имя и контакт — продюсер напишет первым.</p><div className={styles.inputGrid}><input value={leadName} onChange={(e) => setLeadName(e.target.value)} placeholder="Имя и компания" /><input value={leadContact} onChange={(e) => setLeadContact(e.target.value)} placeholder="Email или телеграм" /></div><div className={styles.modalActionsSimple}><button className={styles.modalPrimary} onClick={() => finish('short')}>Отправить</button><button className={styles.modalSecondary} onClick={() => setMode('brief')}>Всё-таки заполнить бриф</button></div></div>}
            {sent && <div className={styles.questionPane}><h2>{busy ? 'Формируем резюме…' : 'Заявка принята'}</h2><p className={styles.summary}>{summary}</p><div className={styles.crmRow}><span>CRM · {leadId}</span><a href="mailto:hello@ptrn.pro">hello@ptrn.pro</a><a href="https://t.me/">@patron_pro</a></div><button className={styles.modalPrimary} onClick={() => setModalOpen(false)}>Закрыть</button></div>}
          </div>
        </div>
      )}
    </main>
  );
}

function SectionHead({ index, label, title, text }: { index: string; label: string; title: ReactNode; text?: string }) {
  return (
    <div className={styles.sectionHead} data-reveal="1" data-typo="1">
      <div className={styles.sectionIndex}><span>{index}</span><i /><span>{label}</span></div>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function Contact({ label, value, href }: { label: string; value: string; href?: string }) {
  return <div className={styles.contactItem}><small>{label}</small>{href ? <a href={href}>{value}</a> : <span>{value}</span>}</div>;
}
