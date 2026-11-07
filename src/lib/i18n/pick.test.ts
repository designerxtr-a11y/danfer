import { test } from "node:test";
import assert from "node:assert/strict";
import { L } from "./pick.ts";
import { t, tList } from "../../types/database.ts";

test("L picks ja, falls back to en", () => {
  assert.equal(L("ja", { es: "a", en: "b", ja: "c" }), "c");
  assert.equal(L("ja", { es: "a", en: "b" }), "b");
  assert.equal(L("es", { es: "a", en: "b", ja: "c" }), "a");
  assert.equal(L("en", { es: "a", en: "b" }), "b");
});

test("t chain ja -> en -> es", () => {
  assert.equal(t({ es: "a", en: "b", ja: "c" }, "ja"), "c");
  assert.equal(t({ es: "a", en: "b" }, "ja"), "b");
  assert.equal(t({ es: "a" }, "ja"), "a");
  assert.equal(t({ es: "a" }, "en"), "a");
});

test("tList chain", () => {
  assert.deepEqual(tList({ es: ["a"], en: ["b"], ja: [] }, "ja"), ["b"]);
  assert.deepEqual(tList({ es: ["a"], ja: ["c"] }, "ja"), ["c"]);
  assert.deepEqual(tList(["x"], "ja"), ["x"]);
});
