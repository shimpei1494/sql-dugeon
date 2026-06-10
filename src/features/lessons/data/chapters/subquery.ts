import type { Chapter, LessonDefinition } from "../../types";
import { categoriesTable, customersTable, ordersTable, productsTable } from "../ecDataset";

export const subqueryChapter: Chapter = {
  id: "subquery",
  title: "サブクエリ",
  description: "クエリの中に別のクエリを埋め込み、IN / EXISTS / スカラー値として使います。",
  order: 7,
};

export const subqueryLessons: LessonDefinition[] = [
  {
    id: "subquery-in-customers-with-orders",
    chapterId: "subquery",
    title: "注文したことのある顧客を探す（IN）",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    summary: "IN (サブクエリ) で別テーブルの結果を条件に使います。",
    tags: ["サブクエリ", "IN"],
    task: "customers テーブルから、注文したことのある顧客の name を取得してください。JOIN は使わず、IN とサブクエリで解いてください。",
    learningPoint: {
      syntax: "SELECT 列\nFROM テーブルA\nWHERE 列 IN (SELECT 列 FROM テーブルB);",
      description:
        "IN の候補リストは値の列挙だけでなく、サブクエリの結果でも指定できます。「別テーブルに存在する行」の絞り込みに使えます。",
    },
    schema: [customersTable, ordersTable],
    starterSql: "SELECT name\nFROM customers\nWHERE id IN ();",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "IN",
        message: "この課題では IN (サブクエリ) で「注文した顧客の id」を条件にするのが目標です。",
      },
    ],
    forbiddenConstructs: [
      {
        keyword: "JOIN",
        message:
          "JOIN でも解けますが、この課題ではサブクエリ（IN）で解くのが目標です。同じ結果を複数の書き方で出せるようになると、状況に応じた使い分けができます。",
      },
    ],
    hints: [
      "注文した顧客の id は SELECT customer_id FROM orders で取れます。",
      "id IN (SELECT customer_id FROM orders) のように括弧の中にサブクエリを書きます。",
    ],
    solutionSql: "SELECT name\nFROM customers\nWHERE id IN (SELECT customer_id FROM orders);",
    explanation:
      "サブクエリは内側から先に評価されるイメージで読みます。IN (サブクエリ) は重複があっても問題ありません。",
  },
  {
    id: "subquery-scalar-above-average",
    chapterId: "subquery",
    title: "平均より高い注文を探す",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    summary: "1 つの値を返すスカラーサブクエリを比較に使います。",
    tags: ["サブクエリ", "AVG"],
    task: "orders テーブルから、total_amount が全体の平均より高い注文の id と total_amount を取得してください。",
    learningPoint: {
      syntax: "SELECT 列\nFROM テーブル名\nWHERE 列 > (SELECT AVG(列) FROM テーブル名);",
      description:
        "1 行 1 列だけを返すサブクエリ（スカラーサブクエリ）は、普通の値のように比較演算子と組み合わせられます。",
    },
    schema: [ordersTable],
    starterSql: "SELECT id, total_amount\nFROM orders\nWHERE total_amount > ();",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "AVG",
        message:
          "この課題では平均をサブクエリ内の AVG で計算するのが目標です。平均値を手で計算して直接書くと、データが変わったときに使えない SQL になります。",
      },
    ],
    hints: [
      "平均は SELECT AVG(total_amount) FROM orders で計算できます。",
      "WHERE total_amount > (サブクエリ) の形にします。",
    ],
    solutionSql:
      "SELECT id, total_amount\nFROM orders\nWHERE total_amount > (SELECT AVG(total_amount) FROM orders);",
    explanation:
      "WHERE 句では集計関数を直接使えないため（WHERE total_amount > AVG(...) はエラー）、平均との比較はスカラーサブクエリで書きます。",
  },
  {
    id: "subquery-exists-customers",
    chapterId: "subquery",
    title: "注文したことのある顧客を探す（EXISTS）",
    difficulty: "intermediate",
    estimatedMinutes: 12,
    summary: "EXISTS で「対応する行が存在するか」を判定します。",
    tags: ["サブクエリ", "EXISTS"],
    task: "customers テーブルから、注文したことのある顧客の name を取得してください。今回は IN や JOIN ではなく EXISTS で解いてください。",
    learningPoint: {
      syntax:
        "SELECT 列\nFROM テーブルA\nWHERE EXISTS (\n  SELECT 1 FROM テーブルB WHERE テーブルB.列 = テーブルA.列\n);",
      description:
        "EXISTS はサブクエリが 1 行でも返せば真になります。サブクエリの中から外側のテーブルの列を参照する（相関サブクエリ）のが特徴です。",
    },
    schema: [customersTable, ordersTable],
    starterSql: "SELECT name\nFROM customers\nWHERE EXISTS ();",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "EXISTS",
        message: "この課題では EXISTS で「注文が存在するか」を判定するのが目標です。",
      },
    ],
    forbiddenConstructs: [
      {
        keyword: "IN",
        message:
          "前のレッスンの IN でも解けますが、この課題では EXISTS と相関サブクエリを練習するのが目標です。",
      },
      {
        keyword: "JOIN",
        message: "JOIN でも解けますが、この課題では EXISTS で解くのが目標です。",
      },
    ],
    hints: [
      "EXISTS (SELECT 1 FROM orders WHERE orders.customer_id = customers.id) の形です。",
      "サブクエリの SELECT に書く値は何でもよいため、慣習的に 1 を書きます。",
    ],
    solutionSql:
      "SELECT name\nFROM customers\nWHERE EXISTS (\n  SELECT 1 FROM orders WHERE orders.customer_id = customers.id\n);",
    explanation:
      "IN と EXISTS は多くの場合書き換え可能ですが、EXISTS は「1 行見つかった時点で打ち切れる」ため、対応行が多いときに効率的なことがあります。",
  },
  {
    id: "subquery-not-exists-empty-category",
    chapterId: "subquery",
    title: "商品が 1 つも無いカテゴリを探す",
    difficulty: "advanced",
    estimatedMinutes: 12,
    summary: "NOT EXISTS で関連が存在しない行を探します。NOT IN の罠も学びます。",
    tags: ["サブクエリ", "NOT EXISTS", "NULL"],
    task: "categories テーブルから、商品が 1 つも登録されていないカテゴリの name を取得してください。NOT EXISTS を使って解いてください。",
    learningPoint: {
      syntax:
        "SELECT 列\nFROM テーブルA\nWHERE NOT EXISTS (\n  SELECT 1 FROM テーブルB WHERE テーブルB.列 = テーブルA.列\n);",
      description:
        "NOT EXISTS は「対応する行が無い」ことを判定します。NOT IN でも書けそうですが、サブクエリの結果に NULL が含まれると NOT IN は 1 行も返さなくなる罠があります。",
    },
    schema: [categoriesTable, productsTable],
    starterSql: "SELECT name\nFROM categories\nWHERE NOT EXISTS ();",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "NOT EXISTS",
        message:
          "この課題では NOT EXISTS を使うのが目標です。products.category_id には NULL があるため、NOT IN では正しい結果になりません。",
      },
    ],
    hints: [
      "NOT EXISTS (SELECT 1 FROM products WHERE products.category_id = categories.id) の形です。",
      "NOT IN (SELECT category_id FROM products) を試すと、NULL の影響で 1 行も返りません。",
    ],
    solutionSql:
      "SELECT name\nFROM categories\nWHERE NOT EXISTS (\n  SELECT 1 FROM products WHERE products.category_id = categories.id\n);",
    explanation:
      "NOT IN のリストに NULL が含まれると「等しくないことを確定できない」ため全行が除外されます。否定条件では NOT EXISTS（または NOT IN + WHERE 列 IS NOT NULL）を使うのが安全です。",
    counterexamples: [
      {
        sql: "SELECT name\nFROM categories\nWHERE id NOT IN (SELECT category_id FROM products);",
        reason:
          "products.category_id に NULL があるため NOT IN は 1 行も返さない（NOT IN + NULL の罠）",
      },
    ],
  },
  {
    id: "subquery-correlated-max-order",
    chapterId: "subquery",
    title: "各顧客の最高額の注文を探す",
    difficulty: "advanced",
    estimatedMinutes: 14,
    summary: "相関サブクエリで「グループごとの最大の行」を取得します。",
    tags: ["サブクエリ", "相関", "MAX"],
    task: "orders テーブルから、各顧客（customer_id）ごとに最も金額が高い注文の id、customer_id、total_amount を取得してください。",
    learningPoint: {
      syntax:
        "SELECT 列\nFROM テーブル名 AS 別名\nWHERE 列 = (\n  SELECT MAX(列) FROM テーブル名 WHERE 列 = 別名.列\n);",
      description:
        "外側の行ごとにサブクエリが評価される形を相関サブクエリと呼びます。「グループ内で最大の行そのもの」を取る定番パターンです。",
    },
    schema: [ordersTable],
    starterSql: "SELECT id, customer_id, total_amount\nFROM orders AS o\nWHERE total_amount = ();",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "MAX",
        message: "この課題ではサブクエリ内の MAX で顧客ごとの最高額を求めるのが目標です。",
      },
    ],
    hints: [
      "外側のテーブルに AS o と別名を付け、サブクエリから o.customer_id を参照します。",
      "サブクエリは SELECT MAX(total_amount) FROM orders WHERE customer_id = o.customer_id です。",
    ],
    solutionSql:
      "SELECT id, customer_id, total_amount\nFROM orders AS o\nWHERE total_amount = (\n  SELECT MAX(total_amount) FROM orders WHERE customer_id = o.customer_id\n);",
    explanation:
      "GROUP BY では「最大値」は取れても「最大の行の他の列（id など）」は取れません。相関サブクエリ（または後で学ぶウィンドウ関数）がこの問題の定番解です。",
  },
];
