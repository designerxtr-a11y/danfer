import { test } from "node:test";
import assert from "node:assert/strict";
import { isSpamInquiry, looksRandom, dottedGmail } from "./spam.ts";

test("flags the bot pattern seen in Consultas", () => {
  assert.equal(isSpamInquiry({ name: "hDjjimGMlblKBsfJPZxf", email: "y.uc.os.i.le.m.ef.i85@gmail.com", message: "VgzNZtqWqANYkHuiw" }), true);
  assert.equal(isSpamInquiry({ name: "OUpNYVSYPorYeHyVcWaXH", email: "n.o.a.hl.p.k.k.c.yf.o.qhm.ur.p.h.y@gmail.com", message: "usAPOamcyQxsGuEpNppwZ" }), true);
});

test("flags random name + one-word message", () => {
  assert.equal(isSpamInquiry({ name: "vaqAxlNKWJeIqDHtJpSEoTH", email: "amyd.cccvc6.1@gmail.com", message: "SYlirnkjzLssnhgq" }), true);
});

test("keeps real inquiries", () => {
  assert.equal(isSpamInquiry({ name: "Elizabeth Ogren", email: "elizogren@gmail.com", message: "Hola, estoy planeando un viaje a Cusco para junio/julio" }), false);
  assert.equal(isSpamInquiry({ name: "Heidi", email: "heidirktoepfer@gmail.com", message: "Trip for 4 adults around July 6-7" }), false);
  assert.equal(isSpamInquiry({ name: "5038777008", email: "heidirktoepfer@gmail.com", message: "Hello! I am interested" }), false);
  assert.equal(isSpamInquiry({ name: "Alba Torres", email: "alba@touristcenters.com", message: "Hi there" }), false);
});

test("helpers", () => {
  assert.equal(looksRandom("McDonald"), false);
  assert.equal(looksRandom("JuanCarlosPerez"), false); // 2 mayúsculas internas
  assert.equal(dottedGmail("j.p.mart@gmail.com"), false);
  assert.equal(dottedGmail("a.b.c.d.e@gmail.com"), true);
});
