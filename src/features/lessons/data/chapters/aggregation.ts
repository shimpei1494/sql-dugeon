import type { Chapter, LessonDefinition } from "../../types";
import { ordersTable } from "../ecDataset";

export const aggregationChapter: Chapter = {
  id: "aggregation",
  title: "集計",
  description: "COUNT や SUM などの集計関数と GROUP BY でデータをまとめます。",
  order: 4,
};

export const aggregationLessons: LessonDefinition[] = [
  {
    id: "aggregate-count-orders",
    chapterId: "aggregation",
    title: "注文の件数を数える",
    difficulty: "beginner",
    estimatedMinutes: 7,
    summary: "COUNT(*) でテーブルの行数を数えます。",
    tags: ["COUNT", "AS"],
    task: "orders テーブルの注文件数を、order_count という列名で取得してください。",
    learningPoint: {
      syntax: "SELECT COUNT(*) AS 列名\nFROM テーブル名;",
      description:
        "COUNT(*) は行数を数える集計関数です。AS を使うと結果の列にわかりやすい名前を付けられます。",
    },
    schema: [ordersTable],
    starterSql: "SELECT \nFROM orders;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "COUNT",
        message: "この課題では COUNT で件数を集計するのが目標です。",
      },
    ],
    hints: ["COUNT(*) はすべての行を数えます。", "COUNT(*) AS order_count で列名を付けます。"],
    solutionSql: "SELECT COUNT(*) AS order_count\nFROM orders;",
    explanation:
      "集計関数はたくさんの行を 1 つの値にまとめます。COUNT(*) は行数、COUNT(列) はその列が NULL でない行数を数えます。",
  },
  {
    id: "aggregate-sum-sales",
    chapterId: "aggregation",
    title: "売上の合計を求める",
    difficulty: "beginner",
    estimatedMinutes: 7,
    summary: "SUM で数値列の合計を計算します。",
    tags: ["SUM", "AS"],
    task: "orders テーブルの total_amount の合計を、total_sales という列名で取得してください。",
    learningPoint: {
      syntax: "SELECT SUM(列) AS 列名\nFROM テーブル名;",
      description: "SUM は数値列の合計を計算します。平均は AVG、最大は MAX、最小は MIN です。",
    },
    schema: [ordersTable],
    starterSql: "SELECT \nFROM orders;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "SUM",
        message: "この課題では SUM で合計を集計するのが目標です。",
      },
    ],
    hints: ["SUM(total_amount) で金額の合計を計算できます。", "AS total_sales で列名を付けます。"],
    solutionSql: "SELECT SUM(total_amount) AS total_sales\nFROM orders;",
    explanation: "SUM は NULL を無視して合計します。集計関数は SELECT 句の中で使います。",
  },
  {
    id: "aggregate-min-max-amount",
    chapterId: "aggregation",
    title: "最高額と最低額を調べる",
    difficulty: "beginner",
    estimatedMinutes: 8,
    summary: "MAX と MIN で最大値・最小値を取得します。",
    tags: ["MAX", "MIN"],
    task: "orders テーブルから total_amount の最大値を max_amount、最小値を min_amount という列名で取得してください。",
    learningPoint: {
      syntax: "SELECT MAX(列) AS 列名, MIN(列) AS 列名\nFROM テーブル名;",
      description: "複数の集計関数を 1 つの SELECT でまとめて計算できます。",
    },
    schema: [ordersTable],
    starterSql: "SELECT \nFROM orders;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "MAX",
        message: "この課題では MAX で最大値を集計するのが目標です。",
      },
      {
        keyword: "MIN",
        message: "この課題では MIN で最小値を集計するのが目標です。",
      },
    ],
    hints: [
      "MAX(total_amount) と MIN(total_amount) をカンマで並べます。",
      "それぞれ AS max_amount、AS min_amount で列名を付けます。",
    ],
    solutionSql:
      "SELECT MAX(total_amount) AS max_amount, MIN(total_amount) AS min_amount\nFROM orders;",
    explanation:
      "MAX / MIN は数値だけでなく文字列や日付（辞書順）にも使えます。複数の集計を 1 行で取得できます。",
  },
  {
    id: "aggregate-orders-per-customer",
    chapterId: "aggregation",
    title: "顧客ごとの注文数を数える",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    summary: "GROUP BY で行をグループ化し、グループごとに集計します。",
    tags: ["GROUP BY", "COUNT"],
    task: "orders テーブルを customer_id ごとにまとめ、customer_id と注文件数（order_count という列名）を取得してください。",
    learningPoint: {
      syntax:
        "SELECT グループ化する列, COUNT(*) AS 列名\nFROM テーブル名\nGROUP BY グループ化する列;",
      description:
        "GROUP BY は同じ値を持つ行をグループにまとめ、集計関数はグループごとに計算されます。",
    },
    schema: [ordersTable],
    starterSql: "SELECT customer_id, \nFROM orders\nGROUP BY ;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "GROUP BY",
        message: "この課題では GROUP BY で顧客ごとにグループ化するのが目標です。",
      },
      {
        keyword: "COUNT",
        message: "この課題では COUNT でグループごとの件数を集計するのが目標です。",
      },
    ],
    hints: [
      "GROUP BY customer_id で顧客ごとのグループを作ります。",
      "COUNT(*) はグループごとの行数になります。",
    ],
    solutionSql: "SELECT customer_id, COUNT(*) AS order_count\nFROM orders\nGROUP BY customer_id;",
    explanation:
      "GROUP BY を使うと、集計関数はテーブル全体ではなくグループごとに計算されます。SELECT に書ける列は、グループ化した列か集計関数だけです。",
  },
  {
    id: "aggregate-repeat-customers",
    chapterId: "aggregation",
    title: "注文が 2 件以上の顧客を探す",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    summary: "HAVING で集計結果に条件を付けます。",
    tags: ["GROUP BY", "HAVING"],
    task: "orders テーブルを customer_id ごとに集計し、注文が 2 件以上ある顧客の customer_id と件数（order_count という列名）を取得してください。",
    learningPoint: {
      syntax: "SELECT 列, COUNT(*) AS 列名\nFROM テーブル名\nGROUP BY 列\nHAVING COUNT(*) >= 値;",
      description:
        "WHERE は集計前の行を絞り込み、HAVING は集計後のグループを絞り込みます。集計結果への条件は HAVING に書きます。",
    },
    schema: [ordersTable],
    starterSql:
      "SELECT customer_id, COUNT(*) AS order_count\nFROM orders\nGROUP BY customer_id\nHAVING ;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "GROUP BY",
        message: "この課題では GROUP BY で顧客ごとにグループ化するのが目標です。",
      },
      {
        keyword: "HAVING",
        message:
          "この課題では HAVING で「集計した件数」に条件を付けるのが目標です。WHERE は集計前の行にしか使えません。",
      },
    ],
    hints: [
      "HAVING COUNT(*) >= 2 で件数の条件を付けます。",
      "WHERE は集計前、HAVING は集計後の絞り込みです。",
    ],
    solutionSql:
      "SELECT customer_id, COUNT(*) AS order_count\nFROM orders\nGROUP BY customer_id\nHAVING COUNT(*) >= 2;",
    explanation:
      "HAVING は GROUP BY とセットで使い、集計結果（COUNT や SUM の値）を条件にできます。",
    counterexamples: [
      {
        sql: "SELECT customer_id, COUNT(*) AS order_count\nFROM orders\nGROUP BY customer_id;",
        reason: "HAVING が無いと注文 1 件の顧客まで含まれてしまう",
      },
    ],
  },
];
