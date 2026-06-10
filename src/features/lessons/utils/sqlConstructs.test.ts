import { describe, expect, it } from "vite-plus/test";

import { findMissingConstructs, findUsedConstructs } from "./sqlConstructs";

const likeConstruct = { keyword: "LIKE", message: "LIKE を使いましょう。" };
const orderByConstruct = { keyword: "ORDER BY", message: "ORDER BY を使いましょう。" };
const selectStarConstruct = { keyword: "SELECT *", message: "SELECT * を使いましょう。" };

describe("findMissingConstructs", () => {
  it("returns nothing when all constructs are used", () => {
    expect(
      findMissingConstructs("SELECT id FROM customers WHERE name LIKE 'Mio%'", [likeConstruct]),
    ).toEqual([]);
  });

  it("matches keywords case-insensitively", () => {
    expect(
      findMissingConstructs("select id from customers where name like 'Mio%'", [likeConstruct]),
    ).toEqual([]);
  });

  it("returns missing constructs", () => {
    expect(
      findMissingConstructs("SELECT id FROM customers WHERE name = 'Mio Suzuki'", [likeConstruct]),
    ).toEqual([likeConstruct]);
  });

  it("matches multi-word keywords across whitespace and newlines", () => {
    expect(
      findMissingConstructs("SELECT * FROM orders ORDER\n  BY total_amount DESC", [
        orderByConstruct,
      ]),
    ).toEqual([]);
  });

  it("does not match keywords inside longer words", () => {
    expect(
      findMissingConstructs("SELECT name FROM customers WHERE city IN ('Tokyo')", [
        { keyword: "IN", message: "IN を使いましょう。" },
      ]),
    ).toEqual([]);

    // income の "in" や INSTR の "IN" には一致しない
    expect(
      findMissingConstructs("SELECT income FROM customers", [
        { keyword: "IN", message: "IN を使いましょう。" },
      ]),
    ).toEqual([{ keyword: "IN", message: "IN を使いましょう。" }]);
  });

  it("ignores keywords inside string literals and comments", () => {
    expect(
      findMissingConstructs(
        "-- LIKE はコメント\nSELECT id FROM customers WHERE name = 'LIKE' /* LIKE */",
        [likeConstruct],
      ),
    ).toEqual([likeConstruct]);
  });

  it("matches symbol keywords such as SELECT *", () => {
    expect(findMissingConstructs("SELECT *\nFROM customers", [selectStarConstruct])).toEqual([]);
    expect(findMissingConstructs("SELECT id, name FROM customers", [selectStarConstruct])).toEqual([
      selectStarConstruct,
    ]);
  });
});

describe("findUsedConstructs", () => {
  const joinConstruct = { keyword: "JOIN", message: "JOIN は使わずに解きましょう。" };

  it("returns forbidden constructs that appear in the SQL", () => {
    expect(
      findUsedConstructs(
        "SELECT name FROM customers INNER JOIN orders ON orders.customer_id = customers.id",
        [joinConstruct],
      ),
    ).toEqual([joinConstruct]);
  });

  it("returns nothing when the forbidden construct is absent", () => {
    expect(
      findUsedConstructs(
        "SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders)",
        [joinConstruct],
      ),
    ).toEqual([]);
  });

  it("ignores forbidden keywords inside strings and comments", () => {
    expect(
      findUsedConstructs("-- JOIN しない\nSELECT name FROM customers WHERE name = 'JOIN'", [
        joinConstruct,
      ]),
    ).toEqual([]);
  });
});
