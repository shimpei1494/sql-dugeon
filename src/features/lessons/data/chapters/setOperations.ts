import type { Chapter, LessonDefinition } from "../../types";
import { customersTable, ordersTable } from "../ecDataset";

export const setOperationsChapter: Chapter = {
  id: "set-operations",
  title: "集合演算",
  description: "UNION / INTERSECT / EXCEPT で複数のクエリ結果を集合として組み合わせます。",
  order: 10,
};

export const setOperationsLessons: LessonDefinition[] = [
  {
    id: "set-union-customers",
    chapterId: "set-operations",
    title: "2 つの条件の顧客リストを 1 つにまとめる",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    summary: "UNION で 2 つのクエリ結果を重複なく結合します。",
    tags: ["UNION"],
    task: "「city が Tokyo の顧客」と「age が 30 以上の顧客」の name を UNION で 1 つのリストにまとめてください（両方に該当する顧客は 1 回だけ）。",
    learningPoint: {
      syntax:
        "SELECT 列 FROM テーブル名 WHERE 条件1\nUNION\nSELECT 列 FROM テーブル名 WHERE 条件2;",
      description:
        "UNION は 2 つの SELECT の結果を縦に連結し、重複行を取り除きます。列の数と順序は両方のクエリで揃える必要があります。",
    },
    schema: [customersTable],
    starterSql: "SELECT name\nFROM customers\nWHERE city = 'Tokyo'\nUNION\n;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "UNION",
        message: "この課題では UNION で 2 つのクエリ結果をまとめるのが目標です。",
      },
    ],
    hints: [
      "UNION の下にもう 1 つの SELECT 文を書きます。",
      "両方に該当する Kai Ito は UNION の重複除去により 1 回だけ現れます。",
    ],
    solutionSql:
      "SELECT name\nFROM customers\nWHERE city = 'Tokyo'\nUNION\nSELECT name\nFROM customers\nWHERE age >= 30;",
    explanation:
      "この例は OR でも書けますが、UNION は「別々のテーブルや別々の形のクエリの結果」もまとめられるのが強みです。",
    counterexamples: [
      {
        sql: "SELECT name\nFROM customers\nWHERE city = 'Tokyo'\nUNION ALL\nSELECT name\nFROM customers\nWHERE age >= 30;",
        reason: "UNION ALL は重複を取り除かないため、両方に該当する顧客が 2 回現れる",
      },
    ],
  },
  {
    id: "set-union-all-customers",
    chapterId: "set-operations",
    title: "重複を残したまま結合する",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    summary: "UNION ALL は重複を取り除かず、その分高速です。",
    tags: ["UNION ALL"],
    task: "前のレッスンと同じ 2 つのリスト（Tokyo の顧客 / 30 歳以上の顧客の name）を、今度は重複を取り除かずすべて取得してください。",
    learningPoint: {
      syntax:
        "SELECT 列 FROM テーブル名 WHERE 条件1\nUNION ALL\nSELECT 列 FROM テーブル名 WHERE 条件2;",
      description:
        "UNION ALL は重複除去を行わずに結果を連結します。重複が問題にならない場面では、除去処理が無い分 UNION より高速です。",
    },
    schema: [customersTable],
    starterSql: "SELECT name\nFROM customers\nWHERE city = 'Tokyo'\n\n;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "UNION ALL",
        message:
          "この課題では UNION ALL で重複を残したまま結合するのが目標です。UNION だけだと重複が取り除かれてしまいます。",
      },
    ],
    hints: [
      "UNION の代わりに UNION ALL と書きます。",
      "両方に該当する Kai Ito が 2 回現れれば成功です。",
    ],
    solutionSql:
      "SELECT name\nFROM customers\nWHERE city = 'Tokyo'\nUNION ALL\nSELECT name\nFROM customers\nWHERE age >= 30;",
    explanation:
      "「重複があり得ないと分かっている」「件数を正確に数えたい」場合は UNION ALL を選びます。UNION の重複除去は暗黙のソートを伴うためコストがあります。",
    counterexamples: [
      {
        sql: "SELECT name\nFROM customers\nWHERE city = 'Tokyo'\nUNION\nSELECT name\nFROM customers\nWHERE age >= 30;",
        reason: "UNION は重複を取り除くため、両方に該当する顧客が 1 回しか現れない",
      },
    ],
  },
  {
    id: "set-intersect-customers",
    chapterId: "set-operations",
    title: "両方の条件に該当する顧客だけを取り出す",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    summary: "INTERSECT で 2 つの結果の共通部分を取得します。",
    tags: ["INTERSECT"],
    task: "「city が Tokyo の顧客」と「age が 30 以上の顧客」の両方に該当する顧客の name を、INTERSECT を使って取得してください（WHERE で AND を使うのは禁止です）。",
    learningPoint: {
      syntax:
        "SELECT 列 FROM テーブル名 WHERE 条件1\nINTERSECT\nSELECT 列 FROM テーブル名 WHERE 条件2;",
      description: "INTERSECT は 2 つのクエリ結果の共通部分（両方に存在する行）だけを返します。",
    },
    schema: [customersTable],
    starterSql: "SELECT name\nFROM customers\nWHERE city = 'Tokyo'\n\n;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "INTERSECT",
        message: "この課題では INTERSECT で 2 つの結果の共通部分を取るのが目標です。",
      },
    ],
    forbiddenConstructs: [
      {
        keyword: "AND",
        message:
          "WHERE 条件1 AND 条件2 でも解けますが、この課題では INTERSECT で「集合の共通部分」として考えるのが目標です。",
      },
    ],
    hints: [
      "2 つの SELECT を INTERSECT でつなぎます。",
      "共通部分に残るのは Tokyo かつ 30 歳以上の Kai Ito だけです。",
    ],
    solutionSql:
      "SELECT name\nFROM customers\nWHERE city = 'Tokyo'\nINTERSECT\nSELECT name\nFROM customers\nWHERE age >= 30;",
    explanation:
      "同じテーブルなら AND で十分ですが、INTERSECT は「別々のクエリ結果の突き合わせ」に使えます。例えば 2 つの期間それぞれで購入した顧客の共通部分などです。",
  },
  {
    id: "set-except-customers",
    chapterId: "set-operations",
    title: "注文したことの無い顧客を差集合で探す",
    difficulty: "intermediate",
    estimatedMinutes: 12,
    summary: "EXCEPT で「片方にしか無い行」を取得します。",
    tags: ["EXCEPT"],
    task: "customers の全顧客 id から、注文したことのある顧客 id（orders の customer_id）を EXCEPT で取り除き、注文したことの無い顧客の id を取得してください。",
    learningPoint: {
      syntax: "SELECT 列 FROM テーブルA\nEXCEPT\nSELECT 列 FROM テーブルB;",
      description:
        "EXCEPT は最初のクエリ結果から、2 番目のクエリ結果に存在する行を取り除きます（差集合）。",
    },
    schema: [customersTable, ordersTable],
    starterSql: "SELECT id\nFROM customers\n\n;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "EXCEPT",
        message: "この課題では EXCEPT で差集合を取るのが目標です。",
      },
    ],
    hints: [
      "EXCEPT の下に SELECT customer_id FROM orders を書きます。",
      "LEFT JOIN + IS NULL や NOT EXISTS と同じ結果を、集合の引き算として表現できます。",
    ],
    solutionSql: "SELECT id\nFROM customers\nEXCEPT\nSELECT customer_id\nFROM orders;",
    explanation:
      "「注文していない顧客」は LEFT JOIN + IS NULL、NOT EXISTS、EXCEPT の 3 通りで書けます。EXCEPT は最も宣言的ですが、取得できる列が両クエリで揃えた列に限られます。",
  },
];
