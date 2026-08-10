'use client';

import { useEffect, useMemo, useState } from 'react';
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

const introCards = [
  ['Позиция', 'Стратегический продюсер - входим до брифа, остаёмся после события, фиксируем KPI на старте.'],
  ['Для кого', 'Технологический бизнес: IT, геймдев, финтех, медтех. Директора по маркетингу и коммуникациям, для кого цена ошибки высока.'],
  ['Результат', 'Событие с измеримым эффектом: аудитория, сделки, восприятие бренда - в Post Event Intelligence Report.'],
];

const stats = [
  ['40+', 'проектов'],
  ['21', 'страна'],
  ['18', 'лет экспертизы'],
  ['60 000', 'гостей на одном событии'],
];

const approachCards = [
  ['01', 'Входим до брифа', 'Начинаем с бизнес-задачи, а не с площадки. Реконструируем цель, аудиторию и метрику до того, как появится смета.'],
  ['02', 'KPI на старте', 'Событие описано в измеримых показателях: охват, лиды, изменение восприятия. Отклонения видны в реальном времени.'],
  ['03', 'Одна команда на цикл', 'Стратег, продюсер и аналитик не меняются между этапами. Ответственность не передаётся по цепочке.'],
  ['04', 'Остаёмся после', 'Post Event Intelligence Report: что сработало, что нет, что переносим в следующий цикл коммуникаций.'],
];

const formats = [
  ['format-conference.png', 'photo 3:2 - conference', 'Конференция', '300 - 3 000 участников', 'Отраслевая площадка с собственной программой, спикерским пулом и деловой частью.'],
  ['format-launch.png', 'photo 3:2 - launch', 'Продуктовый запуск', 'офлайн + трансляция', 'Событие как медиаповод: сценарий, демо, работа с профильной прессой и аналитиками.'],
  ['format-summit.png', 'photo 3:2 - summit', 'Партнёрский саммит', '50 - 400 гостей', 'Закрытый контур для клиентов и партнёров с управляемой воронкой встреч.'],
  ['format-internal.png', 'photo 3:2 - internal', 'Внутреннее событие', 'команды 100 - 5 000', 'Стратегические сессии и корпоративные форумы, влияющие на удержание и вовлечённость.'],
  ['format-roadshow.png', 'photo 3:2 - road show', 'Роуд-шоу', 'серия в 3 - 12 городах', 'Тиражируемый формат с единым ядром и локальной адаптацией под рынок.'],
];

const methodSteps = [
  ['01', 'Диагностика', '2 недели', 'Интервью со стейкхолдерами, аудит прошлых событий, разбор аудитории и конкурентного поля.'],
  ['02', 'Стратегия и KPI', '3 недели', 'Концепция, сценарий пользовательского пути гостя, метрики и способы их измерения.'],
  ['03', 'Продюсирование', '6 - 16 недель', 'Программа, спикеры, партнёры, продакшн и коммуникационная кампания в одном плане.'],
  ['04', 'Реализация', 'день события', 'Оперативный штаб, дежурные сценарии на риски, сбор данных в реальном времени.'],
  ['05', 'Аналитика', '3 недели после', 'Post Event Intelligence Report: факт против плана, качество аудитории, влияние на пайплайн.'],
];

const cases = [
  {
    image: 'case-fintech.jpg',
    meta: 'финтех · конференция',
    title: 'Годовая платформа для рынка',
    text: 'Перевели событие из статуса имиджевого в инструмент продаж за один цикл.',
    numbers: [['2 400', 'участников'], ['74', 'сделки в пайплайне']],
  },
  {
    image: 'case-gamedev.jpg',
    meta: 'геймдев · анонс',
    title: 'Анонс тайтла на стадионе',
    text: 'Событие и трансляция как единый медиапродукт с управляемой волной публикаций.',
    numbers: [['60 000', 'гостей'], ['12 млн', 'охват']],
  },
  {
    image: 'case-medtech.jpg',
    meta: 'медтех · саммит',
    title: 'Закрытый совет для CxO',
    text: 'Малый формат с высокой плотностью решений: каждая встреча спланирована заранее.',
    numbers: [['120', 'CxO'], ['41', 'целевая встреча']],
  },
];

const questions: Question[] = [
  { key: 'task', question: 'Что за задача?', hint: 'Повод, бизнес-цель, что должно измениться после события.', placeholder: 'Например: запуск платформы для 500 партнёров' },
  { key: 'industry', question: 'В какой индустрии работаете?', hint: 'IT, геймдев, финтех, медтех или другое.', placeholder: 'Финтех' },
  { key: 'scale', question: 'Формат и масштаб?', hint: 'Тип события и ожидаемое число участников.', placeholder: 'Конференция, ~800 человек' },
  { key: 'timing', question: 'Сроки и ориентир бюджета?', hint: 'Дата или окно проведения, вилка бюджета.', placeholder: 'Ноябрь 2026, 12-15 млн руб.' },
  { key: 'who', question: 'Как к вам обращаться?', hint: 'Имя и компания.', placeholder: 'Анна, Netcore' },
  { key: 'contact', question: 'Куда отправить ответ?', hint: 'Email или телеграм - продюсер напишет в течение дня.', placeholder: 'anna@company.ru' },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
}

export function PatronHome() {
  const [navCompact, setNavCompact] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<'brief' | 'contacts'>('brief');
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [leadName, setLeadName] = useState('');
  const [leadContact, setLeadContact] = useState('');
  const [sent, setSent] = useState(false);
  const [leadId, setLeadId] = useState('');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    const onScroll = () => setNavCompact(window.scrollY > 150);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      target.x = ((e.clientX / window.innerWidth) - 0.5) * 140;
      target.y = ((e.clientY / window.innerHeight) - 0.5) * 140;
    };
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.055;
      cur.y += (target.y - cur.y) * 0.055;
      document.documentElement.style.setProperty('--mx', `${cur.x.toFixed(2)}px`);
      document.documentElement.style.setProperty('--my', `${cur.y.toFixed(2)}px`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add(styles.revealed);
      });
    }, { threshold: 0.18 });
    document.querySelectorAll('[data-reveal]').forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const progress = useMemo(() => {
    if (sent) return 100;
    if (mode === 'contacts') return 50;
    return Math.round((step / questions.length) * 100);
  }, [mode, sent, step]);

  const current = questions[Math.min(step, questions.length - 1)];
  const isLast = step === questions.length - 1;

  function openAssistant(nextMode: 'brief' | 'contacts' = 'brief') {
    setModalOpen(true);
    setMode(nextMode);
    setSent(false);
    setStep(0);
    setDraft('');
    setAnswers({});
  }

  function finish(kind: 'brief' | 'short', nextAnswers = answers) {
    const id = `PTR-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const payload = { id, at: new Date().toISOString(), kind, answers: nextAnswers, name: leadName || nextAnswers.who || '', contact: leadContact || nextAnswers.contact || '' };
    try {
      const cur = JSON.parse(localStorage.getItem('patron_crm_leads') || '[]');
      cur.push(payload);
      localStorage.setItem('patron_crm_leads', JSON.stringify(cur));
    } catch {
      // Local CRM stub only.
    }
    setLeadId(id);
    setSent(true);
    setSummary(kind === 'short'
      ? 'Заявка передана продюсеру. Ответим в течение рабочего дня и предложим слот на 30 минут.'
      : `Задача: ${nextAnswers.task || '-'}\nИндустрия: ${nextAnswers.industry || '-'}\nФормат: ${nextAnswers.scale || '-'}\nСроки и бюджет: ${nextAnswers.timing || '-'}\n\nБриф передан продюсеру. Ответим в течение рабочего дня.`);
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
        <div className={styles.ambientLayer}><span className={styles.orbA} /></div>
        <div className={styles.ambientLayer}><span className={styles.orbB} /></div>
        <div className={styles.ambientLayer}><span className={styles.orbC} /></div>
        <div className={styles.ambientLayer}><span className={styles.orbD} /></div>
      </div>

      <header className={styles.header}>
        <button className={styles.brandButton} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className={styles.logoSpace} />
          <span>PATRON</span>
        </button>
        <nav className={`${styles.navPill} ${navCompact ? styles.navHidden : ''}`}>
          {navItems.map((item) => <button key={item.id} onClick={() => scrollToSection(item.id)}>{item.label}</button>)}
        </nav>
        <button className={styles.headerCta} onClick={() => openAssistant('brief')}><span />Обсудить задачу</button>
      </header>

      <div className={styles.mark} data-mark="1" aria-hidden="true"><Image src="/patron/patron-mark.svg" alt="" width={200} height={117} priority /></div>

      <section id="hero" className={styles.hero}>
        <div className={styles.markSlot} />
        <div className={styles.heroTitleWrap} data-typo="1"><h1>PATRON</h1></div>
        <div className={styles.kicker}>Продюсерский центр · Технологический бизнес</div>
        <p>Большинство агентств хорошо закрывают продакшн. Мы работаем с теми, кому этого недостаточно.</p>
      </section>

      <div className={styles.scrollHint} data-scrollhint="1" aria-hidden="true"><span><i /></span><b>Листать</b></div>

      <section id="intro" className={styles.intro}>
        <div className={styles.container}>
          <div className={styles.introGrid} data-reveal="1">
            {introCards.map(([label, text]) => <article key={label} className={styles.introCard}><h2>{label}</h2><p>{text}</p></article>)}
          </div>
          <div className={styles.actionRow} data-reveal="1">
            <button className={styles.primaryButton} onClick={() => openAssistant('brief')}>Обсудить задачу</button>
            <button className={styles.secondaryButton} onClick={() => scrollToSection('cases')}>Посмотреть кейсы</button>
          </div>
          <div className={styles.stats} data-reveal="1">
            {stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
          </div>
        </div>
      </section>

      <section id="approach" className={`${styles.section} ${styles.blueSection}`}>
        <div className={styles.container}>
          <SectionHead index="01 / Подход" title="Продюсер, а не подрядчик" text="Мы берём ответственность за результат события целиком: от формулировки бизнес-задачи до отчёта, который читает совет директоров." />
          <div className={styles.cardGrid}>{approachCards.map(([num, title, text]) => <article key={num} className={styles.glassCard} data-reveal="1"><span>{num}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>

      <section id="formats" className={styles.section}>
        <div className={styles.container}>
          <SectionHead index="02 / Форматы" title="Пять типов задач" text="Формат выбирается после диагностики: он следует из задачи, а не наоборот." />
          <div className={styles.formatGrid}>{formats.map(([image, alt, title, meta, text]) => <article key={title} className={styles.formatCard} data-reveal="1"><Image src={`/patron/${image}`} alt={alt} width={800} height={533} sizes="(max-width: 900px) 100vw, 25vw" /><div><h3>{title}</h3><span>{meta}</span><p>{text}</p></div></article>)}</div>
        </div>
      </section>

      <section id="method" className={`${styles.section} ${styles.tealSection}`}>
        <div className={styles.container}>
          <SectionHead index="03 / Методология" title="Пять этапов, один владелец" />
          <div className={styles.timeline}>{methodSteps.map(([num, title, duration, text]) => <article key={num} data-reveal="1"><span>{num}</span><div><h3>{title}</h3><b>{duration}</b><p>{text}</p></div></article>)}</div>
        </div>
      </section>

      <section id="cases" className={styles.section}>
        <div className={styles.container}>
          <SectionHead index="04 / Кейсы" title="Что считаем результатом" />
          <div className={styles.caseGrid}>{cases.map((item) => <article key={item.title} className={styles.caseCard} data-reveal="1"><Image src={`/patron/${item.image}`} alt="case visual 16:9" width={960} height={540} sizes="(max-width: 900px) 100vw, 33vw" /><div className={styles.caseBody}><span>{item.meta}</span><h3>{item.title}</h3><p>{item.text}</p><div className={styles.caseNumbers}>{item.numbers.map(([value, label]) => <div key={label}><strong>{value}</strong><small>{label}</small></div>)}</div></div></article>)}</div>
        </div>
      </section>

      <section id="contacts" className={`${styles.section} ${styles.contactSection}`}>
        <div className={styles.container}>
          <div className={styles.contactLayout} data-reveal="1">
            <div><div className={styles.sectionIndex}>05 / Контакты</div><h2>Обсудим задачу</h2><p>Ассистент задаст четыре вопроса и передаст бриф продюсеру. Если удобнее без брифа - заберите контакты сразу.</p><button className={styles.primaryButton} onClick={() => openAssistant('brief')}>Обсудить задачу</button></div>
            <div className={styles.contactsList}><Contact label="Почта" value="hello@ptrn.pro" href="mailto:hello@ptrn.pro" /><Contact label="Телеграм" value="@patron_pro" href="https://t.me/" /><Contact label="Телефон" value="+7 495 000-00-00" href="tel:+74950000000" /><Contact label="Офис" value="Москва, Пресненская наб., 12" /></div>
          </div>
          <footer className={styles.footer}><div>{[...navItems, { label: 'Контакты', id: 'contacts' }].map((item) => <button key={item.id} onClick={() => scrollToSection(item.id)}>{item.label}</button>)}</div><span>© 2026 PATRON · Продюсерский центр</span></footer>
        </div>
      </section>

      {modalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <button className={styles.modalBackdrop} onClick={() => setModalOpen(false)} aria-label="Закрыть" />
          <div className={styles.modal}>
            <div className={styles.modalTop}><span>{sent ? 'Заявка · CRM' : mode === 'contacts' ? 'Контакты' : 'AI-ассистент · бриф'}</span><button onClick={() => setModalOpen(false)}>Закрыть</button></div>
            <div className={styles.progress}><i style={{ width: `${progress}%` }} /></div>
            {!sent && mode === 'brief' && <div className={styles.questionPane}><h2>{current.question}</h2><p>{current.hint}</p><textarea value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); nextQuestion(); } }} placeholder={current.placeholder} autoFocus /><div className={styles.modalActions}><button className={styles.secondaryButton} onClick={backQuestion}>{step === 0 ? 'Закрыть' : 'Назад'}</button><button className={styles.primaryButton} onClick={nextQuestion}>{isLast ? 'Отправить бриф' : 'Далее'}</button></div><button className={styles.linkButton} onClick={() => setMode('contacts')}>Пропустить - сразу контакты</button><div className={styles.stepLabel}>Шаг {step + 1} из {questions.length}</div></div>}
            {!sent && mode === 'contacts' && <div className={styles.questionPane}><h2>Контакты продюсерского центра</h2><div className={styles.compactContacts}><Contact label="Почта" value="hello@ptrn.pro" href="mailto:hello@ptrn.pro" /><Contact label="Телеграм" value="@patron_pro" href="https://t.me/" /><Contact label="Телефон" value="+7 495 000-00-00" href="tel:+74950000000" /></div><p>Оставьте имя и контакт - продюсер напишет первым, заявка уйдёт в CRM.</p><div className={styles.inputGrid}><input value={leadName} onChange={(e) => setLeadName(e.target.value)} placeholder="Имя и компания" /><input value={leadContact} onChange={(e) => setLeadContact(e.target.value)} placeholder="Email или телеграм" /></div><div className={styles.modalActions}><button className={styles.primaryButton} onClick={() => finish('short')}>Отправить</button><button className={styles.secondaryButton} onClick={() => setMode('brief')}>Всё-таки заполнить бриф</button></div></div>}
            {sent && <div className={styles.questionPane}><h2>Заявка передана в CRM</h2><p className={styles.summary}>{summary}</p><div className={styles.crmRow}><span>CRM · {leadId}</span><a href="mailto:hello@ptrn.pro">hello@ptrn.pro</a><a href="https://t.me/">@patron_pro</a></div><button className={styles.primaryButton} onClick={() => setModalOpen(false)}>Закрыть</button></div>}
          </div>
        </div>
      )}
    </main>
  );
}

function SectionHead({ index, title, text }: { index: string; title: string; text?: string }) {
  return <div className={styles.sectionHead} data-reveal="1"><div><div className={styles.sectionIndex}>{index}</div><h2 data-typo="1">{title}</h2></div>{text && <p>{text}</p>}</div>;
}

function Contact({ label, value, href }: { label: string; value: string; href?: string }) {
  return <div className={styles.contactItem}><small>{label}</small>{href ? <a href={href}>{value}</a> : <span>{value}</span>}</div>;
}
