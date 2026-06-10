import type { Chapter, LessonDefinition } from "../../types";
import { ordersTable, productsTable } from "../ecDataset";

export const windowFunctionsChapter: Chapter = {
  id: "window-functions",
  title: "ウィンドウ関数",
  description: "行をまとめずに、順位・前後の行・累積などを各行に付け加えます。",
  order: 9,
};

export const windowFunctionsLessons: LessonDefinition[] = [
  {
    id: "window-row-number",
    chapterId: "window-functions",
    title: "注文に金額順の連番を振る",
    difficulty: "advanced",
    estimatedMinutes: 12,
    summary: "ROW_NUMBER() OVER で行ごとに連番を付けます。",
    tags: ["ROW_NUMBER", "OVER"],
    task: "orders テーブルの各注文に、total_amount の高い順の連番（row_no という列名）を付けて、id、total_amount、row_no を row_no 順に取得してください。",
    learningPoint: {
      syntax: "SELECT 列, ROW_NUMBER() OVER (ORDER BY 列) AS 列名\nFROM テーブル名;",
      description:
        "ウィンドウ関数は GROUP BY と違い行をまとめません。各行を残したまま、OVER で指定した並び順に基づく値（ここでは連番）を付け加えます。",
    },
    schema: [ordersTable],
    starterSql: "SELECT id, total_amount, \nFROM orders\nORDER BY row_no;",
    compareMode: "ordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "ROW_NUMBER",
        message: "この課題では ROW_NUMBER() で連番を振るのが目標です。",
      },
      {
        keyword: "OVER",
        message: "ウィンドウ関数には OVER (...) で並び順やグループの指定が必要です。",
      },
    ],
    hints: [
      "ROW_NUMBER() OVER (ORDER BY total_amount DESC) AS row_no と書きます。",
      "OVER の中の ORDER BY が連番の基準になります。",
    ],
    solutionSql:
      "SELECT id, total_amount, ROW_NUMBER() OVER (ORDER BY total_amount DESC) AS row_no\nFROM orders\nORDER BY row_no;",
    explanation:
      "OVER の中の ORDER BY は「連番を振る基準」、外側の ORDER BY は「結果の表示順」で、役割が違います。",
  },
  {
    id: "window-rank-products",
    chapterId: "window-functions",
    title: "商品を価格でランキングする",
    difficulty: "advanced",
    estimatedMinutes: 12,
    summary: "RANK() は同じ値に同じ順位を付け、次の順位を飛ばします。",
    tags: ["RANK", "OVER"],
    task: "products テーブルの各商品に price の高い順の順位（RANK を使い price_rank という列名）を付けて、name、price、price_rank を price_rank 順（同順位は name 順）に取得してください。",
    learningPoint: {
      syntax: "SELECT 列, RANK() OVER (ORDER BY 列 DESC) AS 列名\nFROM テーブル名;",
      description:
        "RANK() は同じ値に同じ順位を付け、その分だけ次の順位を飛ばします（1, 2, 2, 4 のように）。",
    },
    schema: [productsTable],
    starterSql: "SELECT name, price, \nFROM products\nORDER BY price_rank, name;",
    compareMode: "ordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "RANK",
        message: "この課題では RANK() で順位を付けるのが目標です。",
      },
    ],
    hints: [
      "RANK() OVER (ORDER BY price DESC) AS price_rank と書きます。",
      "同価格の商品（3200 円が 2 つ）に同じ順位が付き、次の順位が飛びます。",
    ],
    solutionSql:
      "SELECT name, price, RANK() OVER (ORDER BY price DESC) AS price_rank\nFROM products\nORDER BY price_rank, name;",
    explanation:
      "同率があると RANK は順位を飛ばします（5 位が 2 つなら次は 7 位）。飛ばしたくない場合は次のレッスンの DENSE_RANK を使います。",
    counterexamples: [
      {
        sql: "SELECT name, price, DENSE_RANK() OVER (ORDER BY price DESC) AS price_rank\nFROM products\nORDER BY price_rank, name;",
        reason: "DENSE_RANK は同率の後の順位を飛ばさないため、RANK と結果が変わる",
      },
    ],
  },
  {
    id: "window-rank-vs-dense-rank",
    chapterId: "window-functions",
    title: "RANK と DENSE_RANK の違いを見る",
    difficulty: "advanced",
    estimatedMinutes: 12,
    summary: "2 つの順位付け関数を並べて違いを確認します。",
    tags: ["RANK", "DENSE_RANK"],
    task: "products テーブルの各商品について name、price、RANK の順位（price_rank）と DENSE_RANK の順位（dense_rank）を並べて、price の高い順（同価格は name 順）に取得してください。どちらも price の降順を基準にします。",
    learningPoint: {
      syntax:
        "SELECT 列,\n  RANK() OVER (ORDER BY 列 DESC) AS 列名,\n  DENSE_RANK() OVER (ORDER BY 列 DESC) AS 列名\nFROM テーブル名;",
      description:
        "RANK は同率の後の順位を飛ばし（1, 2, 2, 4）、DENSE_RANK は飛ばしません（1, 2, 2, 3）。同じ ORDER BY でも結果が変わります。",
    },
    schema: [productsTable],
    starterSql: "SELECT name, price, \nFROM products\nORDER BY price DESC, name;",
    compareMode: "ordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "RANK",
        message: "この課題では RANK() と DENSE_RANK() を並べて比較するのが目標です。",
      },
      {
        keyword: "DENSE_RANK",
        message: "この課題では DENSE_RANK() も並べて、RANK() との違いを確認するのが目標です。",
      },
    ],
    hints: [
      "同じ OVER (ORDER BY price DESC) を 2 つの関数にそれぞれ書きます。",
      "3200 円の 2 商品の次の行で、price_rank と dense_rank がずれます。",
    ],
    solutionSql:
      "SELECT name, price,\n  RANK() OVER (ORDER BY price DESC) AS price_rank,\n  DENSE_RANK() OVER (ORDER BY price DESC) AS dense_rank\nFROM products\nORDER BY price DESC, name;",
    explanation:
      "「上位 3 位まで」のような要件では、同率の扱いを RANK にするか DENSE_RANK にするかで結果が変わります。要件に合わせて選びましょう。",
  },
  {
    id: "window-partition-by",
    chapterId: "window-functions",
    title: "顧客ごとに注文の金額順位を付ける",
    difficulty: "advanced",
    estimatedMinutes: 14,
    summary: "PARTITION BY でグループごとに独立した順位を付けます。",
    tags: ["PARTITION BY", "ROW_NUMBER"],
    task: "orders テーブルの各注文に、同じ顧客の中での金額の高い順の連番（rank_in_customer という列名）を付けて、customer_id、id、total_amount、rank_in_customer を customer_id 順（同じ顧客内は連番順）に取得してください。",
    learningPoint: {
      syntax:
        "SELECT 列, ROW_NUMBER() OVER (PARTITION BY グループ列 ORDER BY 列) AS 列名\nFROM テーブル名;",
      description:
        "PARTITION BY はウィンドウ関数の計算をグループごとに区切ります。GROUP BY と違い、行はまとめられずすべて残ります。",
    },
    schema: [ordersTable],
    starterSql:
      "SELECT customer_id, id, total_amount, \nFROM orders\nORDER BY customer_id, rank_in_customer;",
    compareMode: "ordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "PARTITION BY",
        message:
          "この課題では PARTITION BY で顧客ごとに区切って連番を振るのが目標です。PARTITION BY が無いと全体での連番になります。",
      },
    ],
    hints: [
      "ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY total_amount DESC) と書きます。",
      "PARTITION BY で区切ると、顧客が変わるたびに連番が 1 から振り直されます。",
    ],
    solutionSql:
      "SELECT customer_id, id, total_amount,\n  ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY total_amount DESC) AS rank_in_customer\nFROM orders\nORDER BY customer_id, rank_in_customer;",
    explanation:
      "PARTITION BY + ROW_NUMBER は「各グループの上位 N 件」を取る定番です。サブクエリや CTE と組み合わせて rank_in_customer = 1 で絞れば、相関サブクエリで解いた「各顧客の最高額注文」と同じ結果になります。",
  },
  {
    id: "window-lag-previous-order",
    chapterId: "window-functions",
    title: "前の注文の金額を並べる",
    difficulty: "advanced",
    estimatedMinutes: 14,
    summary: "LAG で前の行の値を参照します。",
    tags: ["LAG", "OVER"],
    task: "orders テーブルを ordered_at の古い順に並べ、各注文に 1 つ前の注文の金額（prev_amount という列名）を付けて、id、ordered_at、total_amount、prev_amount を取得してください。",
    learningPoint: {
      syntax: "SELECT 列, LAG(列) OVER (ORDER BY 列) AS 列名\nFROM テーブル名;",
      description:
        "LAG は OVER の並び順で 1 つ前の行の値を返します（次の行は LEAD）。先頭行には前の行が無いため NULL になります。",
    },
    schema: [ordersTable],
    starterSql: "SELECT id, ordered_at, total_amount, \nFROM orders\nORDER BY ordered_at;",
    compareMode: "ordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "LAG",
        message: "この課題では LAG で 1 つ前の行の値を参照するのが目標です。",
      },
    ],
    hints: [
      "LAG(total_amount) OVER (ORDER BY ordered_at) AS prev_amount と書きます。",
      "最初の注文には前の行が無いため prev_amount は NULL になります。",
    ],
    solutionSql:
      "SELECT id, ordered_at, total_amount,\n  LAG(total_amount) OVER (ORDER BY ordered_at) AS prev_amount\nFROM orders\nORDER BY ordered_at;",
    explanation:
      "LAG / LEAD は「前回との差分」「前日比」のような分析に使います。total_amount - prev_amount とすれば増減額も計算できます。",
  },
  {
    id: "window-running-total",
    chapterId: "window-functions",
    title: "売上の累積合計を出す",
    difficulty: "advanced",
    estimatedMinutes: 14,
    summary: "集計関数 + OVER で累積値を計算します。",
    tags: ["SUM", "OVER", "累積"],
    task: "orders テーブルを ordered_at の古い順に並べ、その時点までの売上の累積合計（running_total という列名）を付けて、id、ordered_at、total_amount、running_total を取得してください。",
    learningPoint: {
      syntax: "SELECT 列, SUM(列) OVER (ORDER BY 列) AS 列名\nFROM テーブル名;",
      description:
        "SUM などの集計関数も OVER を付けるとウィンドウ関数になり、「先頭からその行まで」の累積を各行に出せます。",
    },
    schema: [ordersTable],
    starterSql: "SELECT id, ordered_at, total_amount, \nFROM orders\nORDER BY ordered_at;",
    compareMode: "ordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "SUM",
        message: "この課題では SUM をウィンドウ関数として使い、累積合計を出すのが目標です。",
      },
      {
        keyword: "OVER",
        message: "SUM に OVER (ORDER BY ...) を付けると、行をまとめずに累積合計を計算できます。",
      },
    ],
    hints: [
      "SUM(total_amount) OVER (ORDER BY ordered_at) AS running_total と書きます。",
      "GROUP BY は使いません。各行が残ったまま累積が付きます。",
    ],
    solutionSql:
      "SELECT id, ordered_at, total_amount,\n  SUM(total_amount) OVER (ORDER BY ordered_at) AS running_total\nFROM orders\nORDER BY ordered_at;",
    explanation:
      "累積合計は売上推移のグラフ作成などで頻出です。PARTITION BY を足せば「顧客ごとの累積」にもできます。",
  },
];
