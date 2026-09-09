import test from "node:test";
import assert from "node:assert/strict";
import { calculateShippingCents } from "./shipping.js";

test("shipping exemption and regular delivery prices", () => {
  const previous = process.env.SHIPPING_TEST_EMAIL;
  delete process.env.SHIPPING_TEST_EMAIL;
  try {
    assert.equal(300 + calculateShippingCents(300, { email: "cmanzatc@gmail.com" }), 300);
    assert.equal(calculateShippingCents(300, { email: "CMANZATC@gmail.com" }), 0);
    assert.equal(calculateShippingCents(300), 1999);
    assert.equal(calculateShippingCents(300, { email: "other@example.com" }), 1999);
    assert.equal(calculateShippingCents(300, { email: "cmanzatc@gmail.com.attacker.com" }), 1999);
    assert.equal(calculateShippingCents(19899), 1999);
    assert.equal(calculateShippingCents(19900), 0);
    process.env.SHIPPING_TEST_EMAIL = "";
    assert.equal(calculateShippingCents(300, { email: "cmanzatc@gmail.com" }), 1999);
  } finally {
    if (previous === undefined) delete process.env.SHIPPING_TEST_EMAIL;
    else process.env.SHIPPING_TEST_EMAIL = previous;
  }
});
