import type { Chapter, LessonDefinition } from "../../types";
import { customersTable } from "../ecDataset";

export const selectBasicsChapter: Chapter = {
  id: "select-basics",
  title: "SELECT 基礎",
  description: "テーブルから必要な行と列を取り出す基本を学びます。",
  order: 1,
};

export const selectBasicsLessons: LessonDefinition[] = [
  {
    id: "select-all-customers",
    chapterId: "select-basics",
    title: "顧客をすべて取得する",
    difficulty: "beginner",
    estimatedMinutes: 5,
    summary: "SELECT と FROM を使ってテーブル全体を取得します。",
    tags: ["SELECT", "FROM"],
    task: "customers テーブルのすべての列とすべての行を取得してください。",
    learningPoint: {
      syntax: "SELECT *\nFROM テーブル名;",
      description:
        "SELECT はデータ取得の基本命令です。* は「すべての列」を意味し、FROM で取得元のテーブルを指定します。",
    },
    schema: [customersTable],
    starterSql: "SELECT *\nFROM customers;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "SELECT *",
        message:
          "この課題では SELECT * で「すべての列」を取得するのが目標です。列名をすべて並べても同じ結果になりますが、* を使ってみましょう。",
      },
    ],
    hints: [
      "SELECT * はすべての列を取得します。",
      "FROM customers で取得元のテーブルを指定します。",
    ],
    solutionSql: "SELECT *\nFROM customers;",
    explanation: "SELECT 句で列を選び、FROM 句で対象テーブルを指定します。",
  },
  {
    id: "select-customer-contact",
    chapterId: "select-basics",
    title: "必要な列だけ取得する",
    difficulty: "beginner",
    estimatedMinutes: 6,
    summary: "列名を指定して、必要なデータだけを取り出します。",
    tags: ["SELECT", "columns"],
    task: "customers テーブルから name と email だけを取得してください。",
    learningPoint: {
      syntax: "SELECT 列1, 列2\nFROM テーブル名;",
      description:
        "列名をカンマ区切りで指定すると、必要な列だけを取得できます。列は指定した順番で結果に並びます。",
    },
    schema: [customersTable],
    starterSql: "SELECT\n  \nFROM customers;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    hints: [
      "SELECT name, email のように列名をカンマで並べます。",
      "* を使わないことで必要な列だけ取得できます。",
    ],
    solutionSql: "SELECT name, email\nFROM customers;",
    explanation: "必要な列だけを指定すると、結果が読みやすくなり転送量も抑えられます。",
  },
];
