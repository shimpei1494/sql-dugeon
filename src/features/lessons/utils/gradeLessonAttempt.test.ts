import { describe, expect, it } from "vite-plus/test";

import type { Lesson } from "../types";
import { gradeLessonAttempt } from "./gradeLessonAttempt";

const lesson: Lesson = {
  id: "filter-customer-name-like",
  chapterId: "filtering",
  title: "名前のパターンで探す",
  difficulty: "beginner",
  estimatedMinutes: 8,
  summary: "LIKE を使って文字列のパターンに一致する行を探します。",
  tags: ["WHERE", "LIKE"],
  task: "name が Mio で始まる顧客の id と name を取得してください。",
  learningPoint: {
    syntax: "SELECT 列\nFROM テーブル名\nWHERE 列 LIKE 'パターン%';",
    description: "LIKE はパターン一致です。",
  },
  schema: [
    {
      name: "customers",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "name", type: "TEXT" },
      ],
      rows: [
        { id: 1, name: "Mio Suzuki" },
        { id: 2, name: "Ren Sato" },
      ],
    },
  ],
  starterSql: "SELECT id, name\nFROM customers\nWHERE name LIKE ;",
  expectedResult: {
    columns: ["id", "name"],
    rows: [{ id: 1, name: "Mio Suzuki" }],
  },
  compareMode: "unordered",
  allowedStatements: ["select"],
  requiredConstructs: [{ keyword: "LIKE", message: "この課題では LIKE を使うのが目標です。" }],
  hints: [],
  solutionSql: "SELECT id, name\nFROM customers\nWHERE name LIKE 'Mio%';",
  explanation: "LIKE は前方一致に使えます。",
};

describe("gradeLessonAttempt", () => {
  it("accepts a correct answer that uses the required construct", () => {
    const grading = gradeLessonAttempt(
      lesson,
      "SELECT id, name FROM customers WHERE name LIKE 'Mio%'",
      lesson.expectedResult,
    );

    expect(grading).toEqual({ ok: true });
  });

  it("rejects a matching result that bypasses the required construct", () => {
    const grading = gradeLessonAttempt(
      lesson,
      "SELECT id, name FROM customers WHERE name = 'Mio Suzuki'",
      lesson.expectedResult,
    );

    expect(grading).toMatchObject({
      ok: false,
      kind: "construct",
      message: "実行結果は期待どおりですが、この課題では LIKE を使うのが目標です。",
    });

    if (!grading.ok) {
      expect(grading.rowDiff).toBeUndefined();
    }
  });

  it("prioritizes construct feedback when both construct and result are wrong", () => {
    const grading = gradeLessonAttempt(lesson, "SELECT id, name FROM customers WHERE name = 'X'", {
      columns: ["id", "name"],
      rows: [],
    });

    expect(grading).toMatchObject({
      ok: false,
      kind: "construct",
      message: "この課題では LIKE を使うのが目標です。",
    });

    if (!grading.ok) {
      expect(grading.rowDiff).toBeDefined();
    }
  });

  it("reports a result mismatch when the construct is used", () => {
    const grading = gradeLessonAttempt(
      lesson,
      "SELECT id, name FROM customers WHERE name LIKE 'R%'",
      {
        columns: ["id", "name"],
        rows: [{ id: 2, name: "Ren Sato" }],
      },
    );

    expect(grading).toMatchObject({ ok: false, kind: "result" });
  });
});
