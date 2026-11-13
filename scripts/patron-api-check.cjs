/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const ts = require("typescript");
const compiled = ts.transpileModule(
  fs.readFileSync("app/api/lead/route.ts", "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
function handler(
  env = {},
  fetchImpl = () => {
    throw new Error("unexpected network call");
  },
) {
  const sandbox = {
    exports: {},
    process: { env },
    Request,
    Response,
    AbortSignal,
    fetch: fetchImpl,
    console: {
      log: () => {
        throw new Error("PII logging in strict delivery path");
      },
      error: () => {
        throw new Error("unexpected provider logging");
      },
    },
  };
  vm.runInNewContext(compiled, sandbox);
  return sandbox.exports.POST;
}
const input = {
  name: "Local test",
  contact: "@local_test",
  company: "Local company",
  task: "Local task",
  format: ["Фестиваль"],
  scale: "до 300",
  consent: true,
  requireDelivery: true,
};
const request = (body) =>
  new Request("http://local/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
(async () => {
  const results = [];
  for (const [name, fn] of [
    [
      "strict missing transport returns 503",
      async () => assert.equal((await handler()(request(input))).status, 503),
    ],
    [
      "strict missing consent returns 422",
      async () =>
        assert.equal(
          (await handler()(request({ ...input, consent: false }))).status,
          422,
        ),
    ],
    [
      "required fields return 422",
      async () =>
        assert.equal(
          (await handler()(request({ ...input, name: "" }))).status,
          422,
        ),
    ],
    [
      "bad JSON returns 400",
      async () =>
        assert.equal(
          (
            await handler()(
              new Request("http://local/api/lead", {
                method: "POST",
                body: "{",
              }),
            )
          ).status,
          400,
        ),
    ],
    [
      "confirmed provider receipt and company payload",
      async () => {
        let sent;
        const fn = handler(
          {
            TELEGRAM_BOT_TOKEN: "LOCAL_TEST_ONLY",
            TELEGRAM_CHAT_ID: "LOCAL_TEST_ONLY",
          },
          async (_, options) => {
            sent = JSON.parse(options.body);
            return Response.json({ ok: true });
          },
        );
        const r = await fn(request(input));
        const body = await r.json();
        assert.equal(r.status, 200);
        assert.equal(body.delivered, true);
        assert.equal(body.ok, true);
        assert.ok(body.id);
        assert.ok(sent.text.includes("Local company"));
      },
    ],
    [
      "provider HTTP 200 without ok is rejected",
      async () => {
        const r = await handler(
          { TELEGRAM_BOT_TOKEN: "TEST", TELEGRAM_CHAT_ID: "TEST" },
          async () => Response.json({ ok: false }),
        )(request(input));
        assert.equal(r.status, 502);
      },
    ],
    [
      "provider network failure returns 502",
      async () => {
        const r = await handler(
          { TELEGRAM_BOT_TOKEN: "TEST", TELEGRAM_CHAT_ID: "TEST" },
          async () => {
            throw new Error("offline");
          },
        )(request(input));
        assert.equal(r.status, 502);
      },
    ],
  ]) {
    try {
      await fn();
      results.push({ name, status: "PASS" });
    } catch (e) {
      results.push({ name, status: "FAIL", error: e.message });
    }
  }
  fs.writeFileSync(
    "docs/patron-migration/api-results.json",
    JSON.stringify(results, null, 2),
  );
  console.log(results);
  if (results.some((x) => x.status === "FAIL")) process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
