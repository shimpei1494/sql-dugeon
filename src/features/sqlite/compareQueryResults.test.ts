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

  it("rejects row order differences in ordered mode", () => {
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
      message: "1 行目の値が期待結果と違います。",
      ok: false,
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
      message: "列が違います。1 列目は id を期待しています。",
      ok: false,
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
      message: "期待結果にない行が含まれています。",
      ok: false,
    });
  });
});
