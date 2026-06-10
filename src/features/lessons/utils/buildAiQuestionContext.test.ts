import { describe, expect, it } from "vite-plus/test";

import type { Lesson } from "../types";
import { buildAiQuestionContext } from "./buildAiQuestionContext";

const lesson: Lesson = {
  id: "select-all-customers",
  chapterId: "select-basics",
  title: "顧客をすべて取得する",
  difficulty: "beginner",
  estimatedMinutes: 5,
  summary: "SELECT と FROM を使ってテーブル全体を取得します。",
  tags: ["SELECT"],
  task: "customers テーブルのすべての列とすべての行を取得してください。",
  learningPoint: {
    syntax: "SELECT *\nFROM テーブル名;",
    description: "SELECT はデータ取得の基本命令です。",
  },
  schema: [
    {
      name: "customers",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "name", type: "TEXT" },
      ],
      rows: [
        { id: 1, name: "Aoi" },
        { id: 2, name: "Ren" },
      ],
    },
  ],
  starterSql: "SELECT *\nFROM customers;",
  expectedResult: {
    columns: ["id", "name"],
    rows: [
      { id: 1, name: "Aoi" },
      { id: 2, name: "Ren" },
    ],
  },
  compareMode: "unordered",
  allowedStatements: ["select"],
  requiredConstructs: [],
  hints: [],
  solutionSql: "SELECT * FROM customers;",
  explanation: "SELECT 句で列を選びます。",
};

describe("buildAiQuestionContext", () => {
  it("includes the task, DDL, expected output, and user SQL", () => {
    const context = buildAiQuestionContext({
      lesson,
      purpose: "hint",
      sql: "SELECT id FROM customers;",
    });

    expect(context).toContain("答えの SQL を直接教えず");
    expect(context).toContain("# 課題: 顧客をすべて取得する");
    expect(context).toContain("このレッスンで学ぶ構文:");
    expect(context).toContain("SELECT はデータ取得の基本命令です。");
    expect(context).toContain('CREATE TABLE "customers"');
    expect(context).toContain('"id" INTEGER');
    expect(context).toContain("| id | name |");
    expect(context).toContain("| 1 | Aoi |");
    expect(context).toContain("行の順序は問いません。");
    expect(context).toContain("SELECT id FROM customers;");
    expect(context).toContain("まだ SQL を実行していません。");
  });

  it("includes the execution error for the error purpose", () => {
    const context = buildAiQuestionContext({
      lesson,
      purpose: "error",
      sql: "SELECT id FROM customer;",
      executionResult: { ok: false, message: "no such table: customer" },
    });

    expect(context).toContain("実行エラーの原因");
    expect(context).toContain("no such table: customer");
  });

  it("includes the grading message and actual result when incorrect", () => {
    const context = buildAiQuestionContext({
      lesson,
      purpose: "hint",
      sql: "SELECT id FROM customers;",
      executionResult: {
        ok: true,
        result: { columns: ["id"], rows: [{ id: 1 }, { id: 2 }] },
      },
      gradingResult: { ok: false, kind: "result", message: "列数が違います。" },
    });

    expect(context).toContain("まだ正解ではありません");
    expect(context).toContain("列数が違います。");
    expect(context).toContain("| id |");
  });
});
