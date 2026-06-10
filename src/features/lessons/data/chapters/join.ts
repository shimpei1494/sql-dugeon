import type { Chapter, LessonDefinition } from "../../types";
import { customersTable, ordersTable } from "../ecDataset";

export const joinChapter: Chapter = {
  id: "join",
  title: "JOIN",
  description: "複数のテーブルを結合して、関連するデータをまとめて取得します。",
  order: 5,
};

export const joinLessons: LessonDefinition[] = [
  {
    id: "join-orders-with-customer-names",
    chapterId: "join",
    title: "注文に顧客名を付ける",
    difficulty: "intermediate",
    estimatedMinutes: 12,
    summary: "INNER JOIN で 2 つのテーブルを結合します。",
    tags: ["INNER JOIN", "ON"],
    task: "orders と customers を customer_id で結合し、注文の id、顧客の name、total_amount を取得してください。",
    learningPoint: {
      syntax: "SELECT 列\nFROM テーブルA\nINNER JOIN テーブルB ON 結合条件;",
      description:
        "JOIN は 2 つのテーブルの行を条件で結び付けます。INNER JOIN は結合条件を満たす行だけを返します。列は テーブル名.列名 の形で指定できます。",
    },
    schema: [ordersTable, customersTable],
    starterSql:
      "SELECT orders.id, customers.name, orders.total_amount\nFROM orders\nINNER JOIN customers ON ;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "JOIN",
        message: "この課題では JOIN で 2 つのテーブルを結合するのが目標です。",
      },
      {
        keyword: "ON",
        message: "JOIN には ON で「どの列同士を結び付けるか」の条件が必要です。",
      },
    ],
    hints: [
      "結合条件は customers.id = orders.customer_id です。",
      "どのテーブルの列かを明確にするため、テーブル名.列名 の形で書きます。",
    ],
    solutionSql:
      "SELECT orders.id, customers.name, orders.total_amount\nFROM orders\nINNER JOIN customers ON customers.id = orders.customer_id;",
    explanation:
      "INNER JOIN は両方のテーブルに対応する行があるものだけを返します。orders.customer_id と customers.id のように、外部キーと主キーを ON で結び付けるのが基本形です。",
  },
  {
    id: "join-customers-without-orders",
    chapterId: "join",
    title: "注文していない顧客を探す",
    difficulty: "intermediate",
    estimatedMinutes: 12,
    summary: "LEFT JOIN と IS NULL で関連データが無い行を見つけます。",
    tags: ["LEFT JOIN", "IS NULL"],
    task: "customers と orders を LEFT JOIN で結合し、注文が 1 件も無い顧客の id と name を取得してください。",
    learningPoint: {
      syntax:
        "SELECT 列\nFROM 左テーブル\nLEFT JOIN 右テーブル ON 結合条件\nWHERE 右テーブルの列 IS NULL;",
      description:
        "LEFT JOIN は左テーブルの行をすべて残し、対応する右テーブルの行が無ければ NULL で埋めます。その NULL を条件にすると「関連が無い行」を探せます。",
    },
    schema: [customersTable, ordersTable],
    starterSql:
      "SELECT customers.id, customers.name\nFROM customers\nLEFT JOIN orders ON \nWHERE ;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "LEFT JOIN",
        message:
          "この課題では LEFT JOIN を使うのが目標です。INNER JOIN では注文の無い顧客の行が結果から消えてしまいます。",
      },
      {
        keyword: "IS NULL",
        message:
          "LEFT JOIN で対応する注文が無い顧客は orders 側の列が NULL になります。IS NULL で絞り込みましょう。",
      },
    ],
    hints: [
      "結合条件は orders.customer_id = customers.id です。",
      "注文が無い顧客は orders.id IS NULL で見つけられます。",
    ],
    solutionSql:
      "SELECT customers.id, customers.name\nFROM customers\nLEFT JOIN orders ON orders.customer_id = customers.id\nWHERE orders.id IS NULL;",
    explanation:
      "LEFT JOIN + IS NULL は「片方にしか存在しないデータ」を探す定番パターンです。未注文の顧客、未配達の注文などの抽出に使えます。",
    counterexamples: [
      {
        sql: "SELECT customers.id, customers.name\nFROM customers\nINNER JOIN orders ON orders.customer_id = customers.id\nWHERE orders.id IS NULL;",
        reason: "INNER JOIN は結合相手がいる行しか返さないため、注文の無い顧客が見つからない",
      },
    ],
  },
  {
    id: "join-sales-per-customer",
    chapterId: "join",
    title: "顧客ごとの合計金額を名前付きで集計する",
    difficulty: "intermediate",
    estimatedMinutes: 14,
    summary: "JOIN と GROUP BY を組み合わせて、結合結果を集計します。",
    tags: ["INNER JOIN", "GROUP BY", "SUM"],
    task: "customers と orders を結合し、顧客ごとに name と注文金額の合計（total_spent という列名）を取得してください。",
    learningPoint: {
      syntax:
        "SELECT 列, SUM(列) AS 列名\nFROM テーブルA\nINNER JOIN テーブルB ON 結合条件\nGROUP BY 列;",
      description:
        "JOIN した結果も 1 つの表として扱えるため、そのまま GROUP BY で集計できます。実務で最もよく使う組み合わせの 1 つです。",
    },
    schema: [customersTable, ordersTable],
    starterSql:
      "SELECT customers.name, \nFROM customers\nINNER JOIN orders ON orders.customer_id = customers.id\nGROUP BY ;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "JOIN",
        message: "この課題では JOIN で顧客名と注文を結び付けるのが目標です。",
      },
      {
        keyword: "GROUP BY",
        message: "この課題では GROUP BY で顧客ごとにグループ化するのが目標です。",
      },
      {
        keyword: "SUM",
        message: "この課題では SUM でグループごとの合計金額を集計するのが目標です。",
      },
    ],
    hints: [
      "SUM(orders.total_amount) AS total_spent で合計に名前を付けます。",
      "GROUP BY customers.name で顧客ごとのグループになります。",
    ],
    solutionSql:
      "SELECT customers.name, SUM(orders.total_amount) AS total_spent\nFROM customers\nINNER JOIN orders ON orders.customer_id = customers.id\nGROUP BY customers.name;",
    explanation:
      "JOIN → GROUP BY → 集計関数の流れは「関連テーブルの情報を付けてから集計する」実務の定番です。INNER JOIN なので注文の無い顧客は結果に含まれません。",
  },
];
