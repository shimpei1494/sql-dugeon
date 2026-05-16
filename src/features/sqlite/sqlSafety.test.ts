import { describe, expect, it } from "vite-plus/test";

import type { Lesson } from "../lessons/types";
import { validateExecutableSql } from "./sqlSafety";

const selectOnly = ["select"] satisfies Lesson["allowedStatements"];
const selectAndWith = ["select", "with"] satisfies Lesson["allowedStatements"];

describe("validateExecutableSql", () => {
  it("allows a single SELECT statement", () => {
    expect(validateExecutableSql("SELECT * FROM customers;", selectOnly)).toEqual({
      normalizedSql: "SELECT * FROM customers",
      ok: true,
    });
  });

  it("allows WITH when the lesson permits it", () => {
    expect(
      validateExecutableSql("WITH picked AS (SELECT 1) SELECT * FROM picked;", selectAndWith),
    ).toEqual({
      normalizedSql: "WITH picked AS (SELECT 1) SELECT * FROM picked",
      ok: true,
    });
  });

  it("rejects empty SQL", () => {
    expect(validateExecutableSql("  ", selectOnly)).toEqual({
      message: "SQL を入力してください。",
      ok: false,
    });
  });

  it("rejects multiple statements", () => {
    expect(
      validateExecutableSql("SELECT * FROM customers; SELECT * FROM orders;", selectOnly),
    ).toEqual({
      message: "Phase 2 では 1 つの SQL 文だけ実行できます。",
      ok: false,
    });
  });

  it("rejects mutating statements", () => {
    expect(validateExecutableSql("DROP TABLE customers;", selectOnly)).toEqual({
      message: "Phase 2 では SELECT / WITH 系の SQL だけ実行できます。",
      ok: false,
    });
  });

  it("rejects WITH when the lesson does not permit it", () => {
    expect(
      validateExecutableSql("WITH picked AS (SELECT 1) SELECT * FROM picked;", selectOnly),
    ).toEqual({
      message: "この Lesson で許可されている SQL は SELECT です。",
      ok: false,
    });
  });

  it("ignores SQL comments before checking the statement", () => {
    expect(validateExecutableSql("-- comment\nSELECT * FROM customers;", selectOnly)).toEqual({
      normalizedSql: "SELECT * FROM customers",
      ok: true,
    });
  });
});
