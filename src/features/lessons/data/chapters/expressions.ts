import type { Chapter, LessonDefinition } from "../../types";
import { customersTable, orderItemsTable, ordersTable, productsTable } from "../ecDataset";

export const expressionsChapter: Chapter = {
  id: "expressions",
  title: "式と関数",
  description: "DISTINCT・計算列・文字列関数・CASE 式で、取得する値そのものを加工します。",
  order: 6,
};

export const expressionsLessons: LessonDefinition[] = [
  {
    id: "distinct-order-customers",
    chapterId: "expressions",
    title: "注文したことのある顧客 id を重複なく取得する",
    difficulty: "beginner",
    estimatedMinutes: 7,
    summary: "DISTINCT で重複する行を取り除きます。",
    tags: ["DISTINCT"],
    task: "orders テーブルから、注文したことのある customer_id を重複なく取得してください。",
    learningPoint: {
      syntax: "SELECT DISTINCT 列\nFROM テーブル名;",
      description:
        "DISTINCT は結果から重複する行を取り除きます。同じ顧客が複数回注文していても 1 行にまとまります。",
    },
    schema: [ordersTable],
    starterSql: "SELECT customer_id\nFROM orders;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "DISTINCT",
        message: "この課題では DISTINCT で重複を取り除くのが目標です。",
      },
    ],
    hints: [
      "SELECT DISTINCT customer_id のように列名の前に付けます。",
      "DISTINCT が無いと、注文回数ぶん同じ customer_id が並びます。",
    ],
    solutionSql: "SELECT DISTINCT customer_id\nFROM orders;",
    explanation:
      "DISTINCT は SELECT した列の組み合わせ全体に対して重複を取り除きます。GROUP BY でも同じ結果を得られますが、単純な重複除去には DISTINCT が簡潔です。",
    counterexamples: [
      {
        sql: "SELECT customer_id\nFROM orders;",
        reason: "DISTINCT が無いと複数回注文した顧客の id が重複して並ぶ",
      },
    ],
  },
  {
    id: "expression-line-total",
    chapterId: "expressions",
    title: "明細金額を計算する",
    difficulty: "beginner",
    estimatedMinutes: 8,
    summary: "列同士の計算結果を新しい列として取得します。",
    tags: ["計算列", "AS"],
    task: "order_items テーブルから order_id、product_id と、明細金額（quantity * unit_price を line_total という列名で）を取得してください。",
    learningPoint: {
      syntax: "SELECT 列, 列1 * 列2 AS 列名\nFROM テーブル名;",
      description:
        "SELECT 句には列名だけでなく計算式も書けます。計算結果の列には AS で名前を付けます。",
    },
    schema: [orderItemsTable],
    starterSql: "SELECT order_id, product_id, \nFROM order_items;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    hints: [
      "quantity * unit_price で明細金額を計算できます。",
      "AS line_total で計算結果に列名を付けます。",
    ],
    solutionSql:
      "SELECT order_id, product_id, quantity * unit_price AS line_total\nFROM order_items;",
    explanation:
      "四則演算（+ - * /）は SELECT 句や WHERE 句で使えます。整数同士の割り算は小数点以下が切り捨てられる点に注意してください。",
  },
  {
    id: "string-concat-label",
    chapterId: "expressions",
    title: "名前と都市をつなげた表示名を作る",
    difficulty: "beginner",
    estimatedMinutes: 8,
    summary: "|| 演算子で文字列を連結します。",
    tags: ["||", "文字列"],
    task: "customers テーブルから「name (city)」という形式の表示名を、label という列名で取得してください（例: Aoi Tanaka (Tokyo)）。",
    learningPoint: {
      syntax: "SELECT 列1 || '文字' || 列2 AS 列名\nFROM テーブル名;",
      description:
        "SQLite では || が文字列連結の演算子です。列と文字列リテラルを自由につなげられます。",
    },
    schema: [customersTable],
    starterSql: "SELECT \nFROM customers;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "||",
        message: "この課題では || 演算子で文字列を連結するのが目標です。",
      },
    ],
    hints: [
      "name || ' (' || city || ')' のように間に文字列を挟んで連結します。",
      "空白や括弧もシングルクォートで囲んだ文字列として連結します。",
    ],
    solutionSql: "SELECT name || ' (' || city || ')' AS label\nFROM customers;",
    explanation:
      "|| はどちらかが NULL だと結果も NULL になります。NULL を空文字として扱いたい場合は COALESCE と組み合わせます。",
  },
  {
    id: "string-upper-length",
    chapterId: "expressions",
    title: "文字列関数で名前を加工する",
    difficulty: "beginner",
    estimatedMinutes: 8,
    summary: "UPPER と LENGTH で文字列を加工・計測します。",
    tags: ["UPPER", "LENGTH"],
    task: "customers テーブルから name と、大文字にした名前（UPPER を使い name_upper という列名）、名前の文字数（LENGTH を使い name_length という列名)を取得してください。",
    learningPoint: {
      syntax: "SELECT 列, UPPER(列) AS 列名, LENGTH(列) AS 列名\nFROM テーブル名;",
      description:
        "関数は列の値を加工して返します。UPPER は大文字化、LOWER は小文字化、LENGTH は文字数を返します。",
    },
    schema: [customersTable],
    starterSql: "SELECT name, \nFROM customers;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "UPPER",
        message: "この課題では UPPER で文字列を大文字化するのが目標です。",
      },
      {
        keyword: "LENGTH",
        message: "この課題では LENGTH で文字数を取得するのが目標です。",
      },
    ],
    hints: [
      "UPPER(name) AS name_upper で大文字の列を作ります。",
      "LENGTH(name) AS name_length で文字数の列を作ります。",
    ],
    solutionSql:
      "SELECT name, UPPER(name) AS name_upper, LENGTH(name) AS name_length\nFROM customers;",
    explanation:
      "文字列関数は WHERE 句でも使えます（例: WHERE LENGTH(name) > 10）。ただし列に関数を適用するとインデックスが効きにくくなる点は、後の章で学びます。",
  },
  {
    id: "case-price-band",
    chapterId: "expressions",
    title: "価格帯のラベルを付ける",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    summary: "CASE 式で値に応じたラベルを返します。",
    tags: ["CASE", "WHEN"],
    task: "products テーブルから name、price と価格帯ラベル（price_band という列名）を取得してください。ラベルは price が 10000 以上なら premium、2500 以上なら standard、それ未満なら budget とします。",
    learningPoint: {
      syntax:
        "SELECT 列,\n  CASE\n    WHEN 条件1 THEN 値1\n    WHEN 条件2 THEN 値2\n    ELSE 値3\n  END AS 列名\nFROM テーブル名;",
      description:
        "CASE 式は条件に応じて返す値を切り替えます。WHEN は上から順に評価され、最初に一致した値が返ります。",
    },
    schema: [productsTable],
    starterSql: "SELECT name, price, \nFROM products;",
    compareMode: "unordered",
    allowedStatements: ["select"],
    requiredConstructs: [
      {
        keyword: "CASE",
        message: "この課題では CASE 式で条件ごとに値を切り替えるのが目標です。",
      },
      {
        keyword: "WHEN",
        message: "CASE 式の条件は WHEN 条件 THEN 値 の形で書きます。",
      },
    ],
    hints: [
      "CASE WHEN price >= 10000 THEN 'premium' ... END AS price_band の形です。",
      "WHEN は上から順に評価されるので、大きい値の条件から書きます。",
    ],
    solutionSql:
      "SELECT name, price,\n  CASE\n    WHEN price >= 10000 THEN 'premium'\n    WHEN price >= 2500 THEN 'standard'\n    ELSE 'budget'\n  END AS price_band\nFROM products;",
    explanation:
      "CASE 式は SELECT のほか ORDER BY や WHERE でも使えます。条件の順序を間違えると意図しないラベルになるため、排他的になるよう上から並べます。",
    counterexamples: [
      {
        sql: "SELECT name, price,\n  CASE\n    WHEN price >= 10000 THEN 'premium'\n    WHEN price > 2500 THEN 'standard'\n    ELSE 'budget'\n  END AS price_band\nFROM products;",
        reason: "ちょうど 2500 円の商品が budget になってしまう（>= と > の違い）",
      },
    ],
  },
];
