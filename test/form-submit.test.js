const { test } = require("node:test");
const assert = require("node:assert/strict");
const form = require("../assets/js/form-submit.js");

test("endpointFor prefers explicit formEndpoint (Resend Worker)", () => {
  assert.equal(
    form.endpointFor({
      formProvider: "resend",
      formEndpoint: "https://dhl-mail-intake.example.workers.dev",
      formspreeId: "ignored"
    }),
    "https://dhl-mail-intake.example.workers.dev"
  );
});

test("endpointFor builds Formspree URL from formspreeId", () => {
  assert.equal(
    form.endpointFor({ formProvider: "formspree", formspreeId: "xyzabcde" }),
    "https://formspree.io/f/xyzabcde"
  );
});

test("endpointFor is empty when unconfigured", () => {
  assert.equal(form.endpointFor({}), "");
  assert.equal(form.endpointFor({ formProvider: "resend" }), "");
  assert.equal(form.endpointFor(null), "");
});

test("endpointFor uses Web3Forms when provider is set", () => {
  assert.equal(
    form.endpointFor({ formProvider: "web3forms" }),
    "https://api.web3forms.com/submit"
  );
});

test("allowHttpsUrl rejects javascript and http", () => {
  assert.equal(form.allowHttpsUrl("javascript:alert(1)"), "");
  assert.equal(form.allowHttpsUrl("http://wise.com/pay"), "");
  assert.equal(
    form.allowHttpsUrl("https://wise.com/pay/me/example"),
    "https://wise.com/pay/me/example"
  );
});

test("allowWiseUrl only allows wise.com", () => {
  assert.equal(form.allowWiseUrl("https://evil.example/pay"), "");
  assert.equal(
    form.allowWiseUrl("https://wise.com/pay/me/example"),
    "https://wise.com/pay/me/example"
  );
});

test("buildPayload drops empty fields and truncates", () => {
  const payload = form.buildPayload({
    name: "Leopold",
    email: "",
    skip: null,
    long: "x".repeat(2500)
  });
  assert.equal(payload.name, "Leopold");
  assert.equal(payload.email, undefined);
  assert.equal(payload.skip, undefined);
  assert.equal(payload.long.length, 2000);
});
