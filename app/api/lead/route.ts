/**
 * Приём заявок с формы на сайте.
 *
 * Если заданы переменные окружения TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID,
 * заявка отправляется в Telegram-чат продюсеров. Иначе — только пишется в лог сервера.
 * Сюда же можно подключить CRM (amoCRM, Bitrix24) или почту.
 */

type Lead = {
  name?: string;
  company?: string;
  contact?: string;
  date?: string;
  task?: string;
  website?: string;
  format?: string[];
  scale?: string;
  budget?: string;
  consent?: boolean;
  requireDelivery?: boolean;
};

const clean = (v: unknown, max = 2000) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(request: Request) {
  let body: Lead;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  // honeypot — боты заполняют скрытое поле
  if (clean(body.website)) return Response.json({ ok: true });

  const lead = {
    name: clean(body.name, 200),
    company: clean(body.company, 200),
    contact: clean(body.contact, 200),
    date: clean(body.date, 200),
    task: clean(body.task),
    format: Array.isArray(body.format)
      ? body.format.map((f) => clean(f, 60)).filter(Boolean)
      : [],
    scale: clean(body.scale, 60),
    budget: clean(body.budget, 60),
  };

  if (!lead.name || !lead.contact) {
    return Response.json({ ok: false, error: "required" }, { status: 422 });
  }

  // The migrated form must never report receipt for the legacy log-only fallback.
  if (body.requireDelivery && body.consent !== true) {
    return Response.json({ ok: false, error: "consent" }, { status: 422 });
  }
  if (
    body.requireDelivery &&
    (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID)
  ) {
    return Response.json(
      { ok: false, error: "delivery_unavailable" },
      { status: 503 },
    );
  }

  const id = `PTR-${Date.now().toString(36).toUpperCase()}`;
  const text = [
    `Новая заявка ${id}`,
    `Имя: ${lead.name}`,
    lead.company && `Компания: ${lead.company}`,
    `Контакт: ${lead.contact}`,
    lead.format.length > 0 && `Формат: ${lead.format.join(", ")}`,
    lead.scale && `Гостей: ${lead.scale}`,
    lead.budget && `Бюджет: ${lead.budget}`,
    lead.date && `Сроки: ${lead.date}`,
    lead.task && `Задача: ${lead.task}`,
  ]
    .filter(Boolean)
    .join("\n");

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    let res: Response;
    try {
      res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      return Response.json({ ok: false, error: "delivery" }, { status: 502 });
    }
    const result = await res.json().catch(() => null);
    if (!res.ok || result?.ok !== true) {
      return Response.json({ ok: false, error: "delivery" }, { status: 502 });
    }
  } else {
    console.log("[lead]\n" + text);
  }

  return Response.json({ ok: true, id, delivered: Boolean(token && chatId) });
}
