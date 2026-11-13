'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import Image from 'next/image';
import styles from './PatronHome.module.css';
import { agency, brief, cases, contacts, hero, marquee, nav, process, services } from '@/app/lib/content';

/* ───────────────────────── helpers ───────────────────────── */

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 64;
  window.scrollTo({ top, behavior: 'smooth' });
}

function Mark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 154.9 90.3" aria-hidden="true" fill="currentColor">
      <path d="M8,41.8c0,19.5,26.2,35.2,58.6,35.2v-20.9c-21.7,0-39.2-10.6-39.2-23.6s17.6-23.6,39.2-23.6v-2.4C34.2,6.6,8,22.3,8,41.8h0Z" />
      <path d="M87.5,6.6v2.4c21.7,0,39.2,10.6,39.2,23.6s-17.6,23.6-39.2,23.6v20.9c32.4,0,58.6-15.8,58.6-35.2S119.9,6.6,87.5,6.6h0Z" />
    </svg>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <span className={styles.label}>[ {children} ]</span>;
}

/* ───────────────────────── page ───────────────────────── */

export function PatronHome() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>('');
  const [service, setService] = useState(0);
  const [caseIdx, setCaseIdx] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  /* header state + active section */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    nav.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  /* reveal on scroll */
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.shown);
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* hero light follows pointer */
  useEffect(() => {
    const el = heroRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const target = { x: 0.7, y: 0.6 };
    const cur = { x: 0.7, y: 0.6 };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = e.clientY / window.innerHeight;
    };
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.05;
      cur.y += (target.y - cur.y) * 0.05;
      el.style.setProperty('--mx', cur.x.toFixed(3));
      el.style.setProperty('--my', cur.y.toFixed(3));
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* lock body when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const go = useCallback((id: string) => {
    setMenuOpen(false);
    scrollToId(id);
  }, []);

  const total = cases.length;
  const prevCase = () => setCaseIdx((i) => (i - 1 + total) % total);
  const nextCase = () => setCaseIdx((i) => (i + 1) % total);
  const current = cases[caseIdx];

  return (
    <main className={styles.page}>
      <div className={styles.grain} aria-hidden="true" />

      {/* ───────── HEADER ───────── */}
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
        <button className={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="PATRON — наверх">
          <Mark className={styles.logoMark} />
          <span>PATRON</span>
        </button>
        <nav className={styles.nav} aria-label="Разделы">
          {nav.map((n) => (
            <button key={n.id} onClick={() => go(n.id)} className={active === n.id ? styles.navActive : ''}>
              {n.label}
            </button>
          ))}
        </nav>
        <button className={styles.cta} onClick={() => go('brief')}>
          Обсудить проект
        </button>
        <button
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={menuOpen}
        >
          <i />
          <i />
        </button>
      </header>

      <div className={`${styles.menu} ${menuOpen ? styles.menuOpen : ''}`} aria-hidden={!menuOpen}>
        <nav>
          {nav.map((n, i) => (
            <button key={n.id} onClick={() => go(n.id)} tabIndex={menuOpen ? 0 : -1}>
              <small>{String(i + 1).padStart(2, '0')}</small>
              {n.label}
            </button>
          ))}
        </nav>
        <div className={styles.menuFoot}>
          <a href={`mailto:${contacts.email}`} tabIndex={menuOpen ? 0 : -1}>{contacts.email}</a>
          <a href={contacts.telegramUrl} tabIndex={menuOpen ? 0 : -1}>Telegram</a>
          <a href={contacts.phoneHref} tabIndex={menuOpen ? 0 : -1}>{contacts.phone}</a>
        </div>
      </div>

      {/* ───────── HERO ───────── */}
      <section ref={heroRef} className={styles.hero} id="top">
        <div className={styles.heroLight} aria-hidden="true" />
        <div className={styles.heroArc} aria-hidden="true" />
        <div className={styles.heroGrid} aria-hidden="true">
          <i /><i /><i /><i />
        </div>

        <div className={styles.heroTop}>
          <h1 className={styles.heroStatement}>
            {hero.statement.map((l) => <span key={l}>{l}</span>)}
            {hero.statementDim.map((l) => <span key={l} className={styles.dim}>{l}</span>)}
          </h1>

          <div className={styles.heroMeta}>
            <span>{hero.meta}</span>
            <span>© 2026 · {contacts.city}</span>
            <button className={styles.textLink} onClick={() => go('cases')}>Наши кейсы <b>↘</b></button>
          </div>

          <button className={styles.heroCard} onClick={() => go('cases')} aria-label="Перейти к кейсам">
            <div className={styles.heroCardImg}>
              <Image src={hero.featured.image} alt="" fill sizes="(max-width: 900px) 90vw, 30vw" priority />
            </div>
            <div className={styles.heroCardBody}>
              <Label>{hero.featured.label}</Label>
              <strong>{hero.featured.value}</strong>
              <span>{hero.featured.caption}</span>
              <em>{hero.featured.title}</em>
            </div>
          </button>
        </div>

        <div className={styles.heroBottom}>
          <div className={styles.heroTagline}>
            <span>· Strategy · Events · Production ·</span>
            <span className={styles.heroTaglineRight}>From brief<br />to business metrics</span>
          </div>
          <div className={styles.wordmark} aria-label="PATRON">PATRON</div>
        </div>
      </section>

      {/* ───────── MARQUEE ───────── */}
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[0, 1].map((k) => (
            <div key={k} className={styles.marqueeGroup}>
              {marquee.map((w) => (
                <span key={w + k}>
                  {w}
                  <Mark className={styles.marqueeMark} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ───────── AGENCY ───────── */}
      <section id="agency" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead} data-reveal>
            <Label>01 · Агентство</Label>
          </div>

          <h2 className={styles.manifesto} data-reveal>
            <span>{agency.lines[0]}</span>
            <span className={styles.accent}>{agency.lines[1]}</span>
          </h2>

          <div className={styles.agencyRow}>
            <p className={styles.lead} data-reveal>{agency.lead}</p>
            <div className={styles.principles}>
              {agency.principles.map((p, i) => (
                <article key={p.n} data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
                  <span>[{p.n}]</span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.stats}>
            {agency.stats.map((s, i) => (
              <div key={s.label} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── SERVICES ───────── */}
      <section id="services" className={`${styles.section} ${styles.sectionBlue}`}>
        <div className={styles.container}>
          <div className={styles.sectionHead} data-reveal>
            <Label>02 · Услуги</Label>
            <h2 className={styles.h2}>Полный цикл —<br />от идеи до отчёта</h2>
          </div>

          <div className={styles.services} data-reveal>
            <div className={styles.serviceTabs} role="tablist" aria-label="Услуги">
              {services.map((s, i) => (
                <button
                  key={s.n}
                  role="tab"
                  aria-selected={service === i}
                  className={service === i ? styles.tabActive : ''}
                  onClick={() => setService(i)}
                  onMouseEnter={() => setService(i)}
                >
                  <span>[{s.n}]</span>
                  <strong>{s.title}</strong>
                  <em>{s.en}</em>
                </button>
              ))}
            </div>

            <div className={styles.servicePanel} role="tabpanel" key={service}>
              <Mark className={styles.serviceMark} />
              <p className={styles.serviceLead}>{services[service].lead}</p>
              <ul>
                {services[service].items.map((it) => <li key={it}>{it}</li>)}
              </ul>
              <button className={styles.textLink} onClick={() => go('brief')}>Обсудить задачу <b>→</b></button>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── CASES ───────── */}
      <section id="cases" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.casesHead} data-reveal>
            <div>
              <Label>03 · Кейсы</Label>
              <h2 className={styles.h2}>Проекты</h2>
            </div>
            <div className={styles.caseNav}>
              <span className={styles.counter}>
                <b>{String(caseIdx + 1).padStart(2, '0')}</b> / {String(total).padStart(2, '0')}
              </span>
              <button onClick={prevCase} aria-label="Предыдущий кейс">←</button>
              <button onClick={nextCase} aria-label="Следующий кейс">→</button>
            </div>
          </div>

          <article className={styles.case} key={caseIdx}>
            <div className={styles.caseMedia}>
              {current.image ? (
                <>
                  <Image src={current.image} alt={current.imageAlt || current.title} fill sizes="(max-width: 900px) 100vw, 60vw" />
                  {current.secondImage && (
                    <div className={styles.caseInset}>
                      <Image src={current.secondImage} alt="" fill sizes="20vw" />
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.caseAbstract}>
                  <Mark className={styles.caseAbstractMark} />
                  <span className={styles.live}><i />Live</span>
                </div>
              )}
              <div className={styles.caseTags}>
                {current.tags.map((t) => <span key={t}>{t}</span>)}
              </div>
            </div>

            <div className={styles.caseBody}>
              <div className={styles.caseMeta}>
                <span>{current.client}</span>
                <span>{current.year}</span>
              </div>
              <h3>{current.title}</h3>
              <span className={styles.casePlace}>{current.place}</span>
              <p>{current.text}</p>
              <div className={styles.caseNumbersLabel}>{current.numbersLabel}</div>
              <div className={styles.caseNumbers}>
                {current.numbers.map((n) => (
                  <div key={n.label}>
                    <strong>{n.value}</strong>
                    <span>{n.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <div className={styles.caseList}>
            {cases.map((c, i) => (
              <button key={c.title} onClick={() => setCaseIdx(i)} className={i === caseIdx ? styles.caseListActive : ''}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <strong>{c.title}</strong>
                <em>{c.client} · {c.year}</em>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── PROCESS ───────── */}
      <section id="process" className={`${styles.section} ${styles.sectionDeep}`}>
        <div className={styles.container}>
          <div className={styles.sectionHead} data-reveal>
            <Label>04 · Процесс</Label>
            <h2 className={styles.h2}>Пять этапов,<br />одна команда</h2>
          </div>
          <ol className={styles.process}>
            {process.map((s, i) => (
              <li key={s.n} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                <span className={styles.processN}>[{s.n}]</span>
                <h3>{s.title}</h3>
                <em>{s.time}</em>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── BRIEF FORM ───────── */}
      <section id="brief" className={`${styles.section} ${styles.briefSection}`}>
        <div className={styles.container}>
          <div className={styles.briefLayout}>
            <div className={styles.briefIntro} data-reveal>
              <Label>05 · Заявка</Label>
              <h2 className={styles.h2}>Есть задача?<br /><span className={styles.accent}>Обсудим.</span></h2>
              <p>Расскажите коротко о проекте — продюсер ответит в течение рабочего дня и предложит 30 минут на звонок.</p>
              <dl className={styles.directContacts}>
                <div><dt>Почта</dt><dd><a href={`mailto:${contacts.email}`}>{contacts.email}</a></dd></div>
                <div><dt>Telegram</dt><dd><a href={contacts.telegramUrl}>{contacts.telegram}</a></dd></div>
                <div><dt>Телефон</dt><dd><a href={contacts.phoneHref}>{contacts.phone}</a><small>{contacts.hours}</small></dd></div>
              </dl>
            </div>
            <div data-reveal><BriefForm /></div>
          </div>
        </div>
      </section>

      {/* ───────── FOOTER ───────── */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerCols}>
            <div>
              <small>Навигация</small>
              {nav.map((n) => <button key={n.id} onClick={() => go(n.id)}>{n.label}</button>)}
            </div>
            <div>
              <small>Для быстрой связи</small>
              <a href={contacts.telegramUrl}>Telegram</a>
              <a href={contacts.phoneHref}>{contacts.phone}</a>
              <span>{contacts.hours}</span>
            </div>
            <div>
              <small>Хотите сделать что-то вместе</small>
              <a href={`mailto:${contacts.email}`}>{contacts.email} ↗</a>
            </div>
            <div className={styles.footerUp}>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Наверх ↑</button>
            </div>
          </div>
        </div>
        <div className={styles.footerWord} aria-hidden="true">PATRON</div>
        <div className={`${styles.container} ${styles.footerBottom}`}>
          <span>© 2026 PATRON · Продюсерский центр</span>
          <span>· Strategy · Events · Production ·</span>
        </div>
      </footer>
    </main>
  );
}

/* ───────────────────────── form ───────────────────────── */

type Status = 'idle' | 'sending' | 'sent' | 'error';

function Chips({ name, options, value, onChange, multi }: {
  name: string;
  options: readonly string[];
  value: string[];
  onChange: (v: string[]) => void;
  multi?: boolean;
}) {
  return (
    <div className={styles.chips} role="group" aria-label={name}>
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button
            type="button"
            key={o}
            aria-pressed={on}
            className={on ? styles.chipOn : ''}
            onClick={() => onChange(multi ? (on ? value.filter((v) => v !== o) : [...value, o]) : on ? [] : [o])}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function BriefForm() {
  const [format, setFormat] = useState<string[]>([]);
  const [scale, setScale] = useState<string[]>([]);
  const [budget, setBudget] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get('name') || '').trim(),
      company: String(fd.get('company') || '').trim(),
      contact: String(fd.get('contact') || '').trim(),
      date: String(fd.get('date') || '').trim(),
      task: String(fd.get('task') || '').trim(),
      website: String(fd.get('website') || ''),
      format,
      scale: scale[0] || '',
      budget: budget[0] || '',
    };
    if (!payload.name || !payload.contact) {
      setError('Укажите имя и контакт для связи');
      setStatus('error');
      return;
    }
    if (!fd.get('consent')) {
      setError('Нужно согласие на обработку данных');
      setStatus('error');
      return;
    }
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      form.reset();
      setFormat([]);
      setScale([]);
      setBudget([]);
    } catch {
      setError(`Не получилось отправить. Напишите нам напрямую: ${contacts.email}`);
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className={styles.formDone}>
        <Mark className={styles.formDoneMark} />
        <h3>Заявка у продюсера</h3>
        <p>Ответим в течение рабочего дня. Если задача срочная — напишите в Telegram {contacts.telegram}.</p>
        <button className={styles.submit} onClick={() => setStatus('idle')}>Отправить ещё одну</button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.formRow}>
        <label className={styles.field}>
          <span>Имя *</span>
          <input name="name" autoComplete="name" placeholder="Анна" required />
        </label>
        <label className={styles.field}>
          <span>Компания</span>
          <input name="company" autoComplete="organization" placeholder="Название компании" />
        </label>
      </div>
      <div className={styles.formRow}>
        <label className={styles.field}>
          <span>Email или Telegram *</span>
          <input name="contact" autoComplete="email" placeholder="anna@company.ru" required />
        </label>
        <label className={styles.field}>
          <span>Сроки</span>
          <input name="date" placeholder="Например, март 2027" />
        </label>
      </div>

      <fieldset className={styles.fieldset}>
        <legend>Формат</legend>
        <Chips name="Формат" options={brief.formats} value={format} onChange={setFormat} multi />
      </fieldset>
      <fieldset className={styles.fieldset}>
        <legend>Гостей</legend>
        <Chips name="Масштаб" options={brief.scale} value={scale} onChange={setScale} />
      </fieldset>
      <fieldset className={styles.fieldset}>
        <legend>Бюджет</legend>
        <Chips name="Бюджет" options={brief.budget} value={budget} onChange={setBudget} />
      </fieldset>

      <label className={styles.field}>
        <span>Задача</span>
        <textarea name="task" rows={3} placeholder="Что должно измениться после события?" />
      </label>

      {/* honeypot */}
      <input className={styles.hp} name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className={styles.formFoot}>
        <label className={styles.consent}>
          <input type="checkbox" name="consent" defaultChecked />
          <span>Согласен на обработку персональных данных</span>
        </label>
        <button className={styles.submit} type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
          <b>→</b>
        </button>
      </div>
      {status === 'error' && <p className={styles.formError} role="alert">{error}</p>}
    </form>
  );
}
