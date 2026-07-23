import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("ships the GrowthOS founder command center", async () => {
  const [app, layout, data, workspaceApi] = await Promise.all([
    readFile(new URL("../app/growth-os.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/workspace/route.ts", import.meta.url), "utf8"),
  ]);
  assert.match(layout, /Turn WhatsApp conversations into revenue/);
  assert.match(app, /Live database/);
  assert.match(app, /Demand to revenue/);
  assert.match(app, /Needs your attention/);
  assert.match(data, /WorkspaceData/);
  assert.doesNotMatch(data, /Aarav|FlowKreative|Asksemble|Vyrical/);
  assert.match(workspaceApi, /lead\.stage/);
  assert.match(workspaceApi, /conversation\.message/);
  assert.match(workspaceApi, /task\.completed/);
  assert.doesNotMatch(app + layout, /codex-preview|Building your site/i);
});

test("ships the public landing page and persistent lead capture", async () => {
  const [landing, contact, endpoint, migration] = await Promise.all([
    readFile(new URL("../app/landing-page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/contact/contact-form.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/contact/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0001_worthless_raider.sql", import.meta.url), "utf8"),
  ]);
  assert.match(landing, /Turn every WhatsApp conversation into/);
  assert.match(landing, /Book your free demo/);
  assert.match(contact, /Book my personalized demo/);
  assert.match(endpoint, /INSERT INTO marketing_leads/);
  assert.match(migration, /CREATE TABLE `marketing_leads`/);
});

test("supports deep-linked CRM routes through the application shell", async () => {
  const [route, app] = await Promise.all([
    readFile(new URL("../app/[...slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/growth-os.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(route, /GrowthOS/);
  assert.match(app, /Sales pipeline/);
  assert.match(app, /open pipeline/);
  assert.match(app, /Kanban/);
  assert.match(app, /Conversations/);
  assert.match(app, /Customer health/);
});

test("ships a consent-aware tracker and product-specific social card", async () => {
  const tracker = await readFile(new URL("../public/tracker.js", import.meta.url), "utf8");
  assert.match(tracker, /GrowthOS/);
  assert.match(tracker, /data-product-key/);
  assert.match(tracker, /idempotency-key/);
  assert.match(tracker, /utm_campaign/);
  assert.match(tracker, /consent/);
  await access(new URL("../public/og.png", import.meta.url));
});

test("ships the generated relational migration", async () => {
  const migration = await readFile(
    new URL("../drizzle/0000_thick_starjammers.sql", import.meta.url),
    "utf8",
  );
  assert.match(migration, /CREATE TABLE `organizations`/);
  assert.match(migration, /CREATE TABLE `products`/);
  assert.match(migration, /CREATE TABLE `leads`/);
  assert.match(migration, /CREATE TABLE `lifecycle_events`/);
  assert.match(migration, /CREATE UNIQUE INDEX `events_idempotency_unique`/);
});
