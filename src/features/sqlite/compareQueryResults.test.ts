import { describe, expect, it } from "vite-plus/test";

import type { QueryResult } from "../lessons/types";
import { compareQueryResults } from "./compareQueryResults";

const expected = {
  columns: ["id", "name"],
  rows: [
    { id: 1, name: "Aoi" },
    { id: 2, name: "Ren" },
  ],
} satisfies QueryResult;

describe("compareQueryResults", () => {
  it("accepts identical ordered results", () => {
    expect(compareQueryResults(expected, expected, "ordered")).toEqual({ ok: true });
  });

  it("rejects row order differences in ordered mode and explains it is an ordering issue", () => {
    expect(
      compareQueryResults(
        expected,
        {
          columns: ["id", "name"],
          rows: [
            { id: 2, name: "Ren" },
            { id: 1, name: "Aoi" },
          ],
        },
        "ordered",
      ),
    ).toEqual({
      ok: false,
      message: "値は揃っていますが、行の並び順が期待結果と違います。",
      rowDiff: {
        expectedRowFlags: [true, true],
        actualRowFlags: [true, true],
      },
    });
  });

  it("accepts row order differences in unordered mode", () => {
    expect(
      compareQueryResults(
        expected,
        {
          columns: ["id", "name"],
          rows: [
            { id: 2, name: "Ren" },
            { id: 1, name: "Aoi" },
          ],
        },
        "unordered",
      ),
    ).toEqual({ ok: true });
  });

  it("requires matching column order", () => {
    expect(
      compareQueryResults(
        expected,
        {
          columns: ["name", "id"],
          rows: [
            { id: 1, name: "Aoi" },
            { id: 2, name: "Ren" },
          ],
        },
        "unordered",
      ),
    ).toEqual({
      ok: false,
      message: "列が違います。1 列目は id を期待していますが、実際は name でした。",
    });
  });

  it("reports both column lists when the column count differs", () => {
    expect(
      compareQueryResults(
        expected,
        {
          columns: ["id"],
          rows: [{ id: 1 }, { id: 2 }],
        },
        "unordered",
      ),
    ).toEqual({
      ok: false,
      message: "列数が違います。期待: 2 列（id, name）/ 実際: 1 列（id）",
    });
  });

  it("compares duplicate rows as a multiset in unordered mode", () => {
    expect(
      compareQueryResults(
        {
          columns: ["city"],
          rows: [{ city: "Tokyo" }, { city: "Tokyo" }],
        },
        {
          columns: ["city"],
          rows: [{ city: "Tokyo" }, { city: "Osaka" }],
        },
        "unordered",
      ),
    ).toEqual({
      ok: false,
      message: "1 行が期待結果と一致しません。",
      rowDiff: {
        expectedRowFlags: [false, true],
        actualRowFlags: [false, true],
      },
    });
  });

  it("flags only mismatching rows when the row count differs", () => {
    expect(
      compareQueryResults(
        expected,
        {
          columns: ["id", "name"],
          rows: [{ id: 1, name: "Aoi" }],
        },
        "unordered",
      ),
    ).toEqual({
      ok: false,
      message: "行数が違います。期待: 2 行 / 実際: 1 行",
      rowDiff: {
        expectedRowFlags: [false, true],
        actualRowFlags: [false],
      },
    });
  });

  it("flags trailing rows in ordered mode when actual has extra rows", () => {
    expect(
      compareQueryResults(
        expected,
        {
          columns: ["id", "name"],
          rows: [
            { id: 1, name: "Aoi" },
            { id: 2, name: "Ren" },
            { id: 3, name: "Mio" },
          ],
        },
        "ordered",
      ),
    ).toEqual({
      ok: false,
      message: "行数が違います。期待: 2 行 / 実際: 3 行",
      rowDiff: {
        expectedRowFlags: [false, false],
        actualRowFlags: [false, false, true],
      },
    });
  });
});
