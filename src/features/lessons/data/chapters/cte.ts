import type { Chapter, LessonDefinition } from "../../types";
import { customersTable, ordersTable } from "../ecDataset";

export const cteChapter: Chapter = {
  id: "cte",
  title: "CTE（WITH 句）",
  description: "WITH 句で名前付きの中間結果を作り、複雑なクエリを読みやすく組み立てます。",
  order: 8,
};

export const cteLessons: LessonDefinition[] = [
  {
    id: "cte-high-orders",
    chapterId: "cte",
    title: "高額注文を CTE にまとめる",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    summary: "WITH 句で名前付きの中間結果（CTE）を定義します。",
    tags: ["WITH", "CTE"],
    task: "9000 円以上の注文を high_orders という名前の CTE として定義し、そこから id と total_amount を金額の高い順に取得してください。",
    learningPoint: {
      syntax: "WITH CTE名 AS (\n  SELECT ...\n)\nSELECT 列\nFROM CTE名;",
      description:
        "WITH 句で定義した結果（CTE）は、その後の SELECT でテーブルのように使えます。条件に名前が付くことでクエリの意図が読みやすくなります。",
    },
    schema: [ordersTable],
    starterSql:
      "WITH high_orders AS (\n  \n)\nSELECT id, total_amount\nFROM high_orders\nORDER BY ;",
    compareMode: "ordered",
    allowedStatements: ["select", "with"],
    requiredConstructs: [
      {
        keyword: "WITH",
        message: "この課題では WITH 句で CTE を定義するのが目標です。",
      },
    ],
    hints: [
      "CTE の中身は SELECT * FROM orders WHERE total_amount >= 9000 です。",
      "外側の SELECT では high_orders を普通のテーブルのように使えます。",
    ],
    solutionSql:
      "WITH high_orders AS (\n  SELECT * FROM orders WHERE total_amount >= 9000\n)\nSELECT id, total_amount\nFROM high_orders\nORDER BY total_amount DESC;",
    explanation:
      "CTE はサブクエリを FROM に直接書くより読みやすく、同じ中間結果を複数回参照することもできます。",
  },
  {
    id: "cte-customer-totals",
    chapterId: "cte",
    title: "集計してから絞り込む",
    difficulty: "intermediate",
    estimatedMinutes: 12,
    summary: "集計を CTE に分離し、その結果を WHERE で絞り込みます。",
    tags: ["WITH", "GROUP BY", "SUM"],
    task: "顧客ごとの合計注文金額（customer_id と、SUM を total_spent という列名で）を customer_totals という CTE で集計し、合計が 10000 円以上の顧客だけを取得してください。",
    learningPoint: {
      syntax:
        "WITH CTE名 AS (\n  SELECT 列, SUM(列) AS 列名\n  FROM テーブル名\n  GROUP BY 列\n)\nSELECT 列\nFROM CTE名\nWHERE 集計列 >= 値;",
      description:
        "集計を CTE に分けると、集計結果への条件を HAVING ではなく普通の WHERE で書けます。「集計 → 絞り込み」の 2 段階が見た目どおりになります。",
    },
    schema: [ordersTable],
    starterSql:
      "WITH customer_totals AS (\n  SELECT customer_id, \n  FROM orders\n  GROUP BY \n)\nSELECT customer_id, total_spent\nFROM customer_totals\nWHERE ;",
    compareMode: "unordered",
    allowedStatements: ["select", "with"],
    requiredConstructs: [
      {
        keyword: "WITH",
        message: "この課題では WITH 句で集計を CTE に分離するのが目標です。",
      },
      {
        keyword: "GROUP BY",
        message: "CTE の中で GROUP BY を使って顧客ごとに集計しましょう。",
      },
      {
        keyword: "SUM",
        message: "CTE の中で SUM を使って合計金額を集計しましょう。",
      },
    ],
    hints: [
      "CTE の中身は顧客ごとの SUM(total_amount) AS total_spent の集計です。",
      "外側では WHERE total_spent >= 10000 と、列名でそのまま絞り込めます。",
    ],
    solutionSql:
      "WITH customer_totals AS (\n  SELECT customer_id, SUM(total_amount) AS total_spent\n  FROM orders\n  GROUP BY customer_id\n)\nSELECT customer_id, total_spent\nFROM customer_totals\nWHERE total_spent >= 10000;",
    explanation:
      "HAVING SUM(...) >= 10000 と同じ結果ですが、CTE 方式は集計式を 1 回だけ書けばよく、段階を追って読めるため複雑な集計で特に有効です。",
  },
  {
    id: "cte-multiple",
    chapterId: "cte",
    title: "複数の CTE を組み合わせる",
    difficulty: "advanced",
    estimatedMinutes: 14,
    summary: "カンマ区切りで複数の CTE を定義し、結合します。",
    tags: ["WITH", "JOIN"],
    task: "東京の顧客（id と name）を tokyo_customers、5000 円以上の注文を big_orders という 2 つの CTE で定義し、両者を結合して顧客の name と注文の total_amount を取得してください。",
    learningPoint: {
      syntax:
        "WITH CTE名1 AS (\n  SELECT ...\n),\nCTE名2 AS (\n  SELECT ...\n)\nSELECT 列\nFROM CTE名1\nINNER JOIN CTE名2 ON 結合条件;",
      description:
        "CTE はカンマ区切りで複数定義でき、後の CTE から前の CTE を参照することもできます。複雑な処理を段階ごとに分解できます。",
    },
    schema: [customersTable, ordersTable],
    starterSql:
      "WITH tokyo_customers AS (\n  \n),\nbig_orders AS (\n  \n)\nSELECT tokyo_customers.name, big_orders.total_amount\nFROM tokyo_customers\nINNER JOIN big_orders ON ;",
    compareMode: "unordered",
    allowedStatements: ["select", "with"],
    requiredConstructs: [
      {
        keyword: "WITH",
        message: "この課題では WITH 句で 2 つの CTE を定義するのが目標です。",
      },
      {
        keyword: "JOIN",
        message: "2 つの CTE を JOIN で結合しましょう。CTE はテーブルと同じように結合できます。",
      },
    ],
    hints: [
      "2 つ目の CTE は WITH を繰り返さず、カンマで続けて 名前 AS (...) と書きます。",
      "結合条件は big_orders.customer_id = tokyo_customers.id です。",
    ],
    solutionSql:
      "WITH tokyo_customers AS (\n  SELECT id, name FROM customers WHERE city = 'Tokyo'\n),\nbig_orders AS (\n  SELECT * FROM orders WHERE total_amount >= 5000\n)\nSELECT tokyo_customers.name, big_orders.total_amount\nFROM tokyo_customers\nINNER JOIN big_orders ON big_orders.customer_id = tokyo_customers.id;",
    explanation:
      "CTE を使うと「対象の絞り込み」と「組み合わせ」を分けて考えられます。1 つの巨大なクエリよりも、変更やデバッグがしやすくなります。",
  },
];
