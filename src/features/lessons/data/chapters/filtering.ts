import type { Chapter, LessonDefinition } from "../../types";
import { customersTable, ordersTable } from "../ecDataset";

export const filteringChapter: Chapter = {
  id: "filtering",
  title: "WHERE 条件",
  description: "WHERE 句で条件に合う行だけを取り出します。",
  order: 2,
};

export const filteringLessons: LessonDefinition[] = [
  {
    id: "filter-customers-age-at-least-30",
    chapterId: "filtering",
    title: "30 歳以上の顧客を取得する",
    difficulty: "beginner",
    estimatedMinutes: 7,
    summary: "WHERE と比較演算子で条件に合う行だけを取得します。",
    tags: ["WHERE", ">="],
    task: "customers テーブルから age が 30 以上の顧客について、すべての列を取得してください。",
    learningPoint: {
      syntax: "SELECT *\nFROM テーブル名\nWHERE 列 >= 値;",
      description:
        "WHERE 句は取得する行の条件を指定します。比較演算子は = / <> / > / >= / < / <= が使えます。",
    },
    schema: [customersTable],
    starterSql: "SELECT *\nFROM customers\nWHERE ;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    hints: ["WHERE は取得する行の条件を指定します。", "30 以上は age >= 30 と書けます。"],
    solutionSql: "SELECT *\nFROM customers\nWHERE age >= 30;",
    explanation: "WHERE 句に比較条件を書くと、条件を満たす行だけが結果に残ります。",
    counterexamples: [
      {
        sql: "SELECT *\nFROM customers\nWHERE age > 30;",
        reason: "ちょうど 30 歳の顧客が漏れる（>= と > の違い）",
      },
      {
        sql: "SELECT *\nFROM customers\nWHERE age > 31;",
        reason: "30〜31 歳の顧客が漏れる",
      },
    ],
  },
  {
    id: "filter-tokyo-customers",
    chapterId: "filtering",
    title: "東京の顧客だけ取得する",
    difficulty: "beginner",
    estimatedMinutes: 7,
    summary: "TEXT 型の値を条件にして行を絞り込みます。",
    tags: ["WHERE", "TEXT"],
    task: "customers テーブルから city が Tokyo の顧客について、name と city を取得してください。",
    learningPoint: {
      syntax: "SELECT 列1, 列2\nFROM テーブル名\nWHERE 列 = '文字列';",
      description:
        "TEXT 型の値を条件にするときは、'Tokyo' のように文字列をシングルクォートで囲みます。",
    },
    schema: [customersTable],
    starterSql: "SELECT name, city\nFROM customers\nWHERE ;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    hints: ["文字列はシングルクォートで囲みます。", "city = 'Tokyo' のように等価条件を書きます。"],
    solutionSql: "SELECT name, city\nFROM customers\nWHERE city = 'Tokyo';",
    explanation: "TEXT 型の列も WHERE で比較できます。文字列リテラルは 'Tokyo' のように書きます。",
  },
  {
    id: "filter-customer-name-like",
    chapterId: "filtering",
    title: "名前のパターンで探す",
    difficulty: "beginner",
    estimatedMinutes: 8,
    summary: "LIKE を使って文字列のパターンに一致する行を探します。",
    tags: ["WHERE", "LIKE"],
    task: "customers テーブルから name が Mio で始まる顧客について、id と name を取得してください。",
    learningPoint: {
      syntax: "SELECT 列\nFROM テーブル名\nWHERE 列 LIKE 'パターン%';",
      description:
        "LIKE は文字列のパターン一致で行を絞り込みます。% は 0 文字以上の任意の文字列、_ は任意の 1 文字に対応します。",
    },
    schema: [customersTable],
    starterSql: "SELECT id, name\nFROM customers\nWHERE name LIKE ;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    hints: ["LIKE では % が任意の文字列に対応します。", "Mio で始まる値は 'Mio%' で表せます。"],
    solutionSql: "SELECT id, name\nFROM customers\nWHERE name LIKE 'Mio%';",
    explanation: "LIKE は部分一致や前方一致の検索に使います。% は 0 文字以上の任意の文字列です。",
    counterexamples: [
      {
        sql: "SELECT id, name\nFROM customers\nWHERE name LIKE '%Mio%';",
        reason: "部分一致になり、名前の途中に Mio を含む顧客まで一致してしまう",
      },
    ],
  },
  {
    id: "filter-customer-city-in",
    chapterId: "filtering",
    title: "複数の都市をまとめて指定する",
    difficulty: "beginner",
    estimatedMinutes: 8,
    summary: "IN を使って複数候補のいずれかに一致する行を取得します。",
    tags: ["WHERE", "IN"],
    task: "customers テーブルから city が Tokyo または Osaka の顧客について、name と city を取得してください。",
    learningPoint: {
      syntax: "SELECT 列\nFROM テーブル名\nWHERE 列 IN (値1, 値2);",
      description:
        "IN は「複数の候補のいずれかに一致する」条件です。同じ列への OR 条件の並びを短く書けます。",
    },
    schema: [customersTable],
    starterSql: "SELECT name, city\nFROM customers\nWHERE city IN ();",
    compareMode: "unordered",
    allowedStatements: ["select"],
    hints: [
      "IN は複数の候補値をカンマ区切りで指定します。",
      "city IN ('Tokyo', 'Osaka') のように書けます。",
    ],
    solutionSql: "SELECT name, city\nFROM customers\nWHERE city IN ('Tokyo', 'Osaka');",
    explanation: "IN を使うと、同じ列に対する複数の等価条件を短く書けます。",
    counterexamples: [
      {
        sql: "SELECT name, city\nFROM customers\nWHERE city = 'Tokyo';",
        reason: "Osaka の顧客が漏れる",
      },
    ],
  },
  {
    id: "filter-orders-over-threshold",
    chapterId: "filtering",
    title: "一定金額以上の注文を探す",
    difficulty: "beginner",
    estimatedMinutes: 8,
    summary: "数値条件で注文データを絞り込みます。",
    tags: ["WHERE", ">="],
    task: "orders テーブルから total_amount が 9000 以上の注文について、id と total_amount を取得してください。",
    learningPoint: {
      syntax: "SELECT 列\nFROM テーブル名\nWHERE 数値の列 >= 数値;",
      description:
        "数値はシングルクォートで囲まずそのまま書きます。文字列と書き方が違う点に注意してください。",
    },
    schema: [ordersTable],
    starterSql: "SELECT id, total_amount\nFROM orders\nWHERE ;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    hints: ["total_amount は数値の列です。", "9000 以上は total_amount >= 9000 と書けます。"],
    solutionSql: "SELECT id, total_amount\nFROM orders\nWHERE total_amount >= 9000;",
    explanation: "数値列に対しても WHERE の比較演算子で条件を指定できます。",
    counterexamples: [
      {
        sql: "SELECT id, total_amount\nFROM orders\nWHERE total_amount > 9000;",
        reason: "ちょうど 9000 円の注文が漏れる（>= と > の違い）",
      },
    ],
  },
];
