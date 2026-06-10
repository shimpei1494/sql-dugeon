import type { Chapter, LessonDefinition } from "../../types";
import { customersTable, ordersTable } from "../ecDataset";

export const orderingChapter: Chapter = {
  id: "ordering",
  title: "並び替えと件数制限",
  description: "ORDER BY と LIMIT で結果の順序と件数を制御します。",
  order: 3,
};

export const orderingLessons: LessonDefinition[] = [
  {
    id: "order-high-value-orders",
    chapterId: "ordering",
    title: "注文金額の高い順に並べる",
    difficulty: "beginner",
    estimatedMinutes: 8,
    summary: "ORDER BY と DESC で高い値から順に並べます。",
    tags: ["ORDER BY", "DESC"],
    task: "orders テーブルを total_amount の高い順に並べ、すべての列を取得してください。",
    learningPoint: {
      syntax: "SELECT *\nFROM テーブル名\nORDER BY 列 DESC;",
      description:
        "ORDER BY は結果の並び順を指定します。DESC を付けると降順（大きい順）、ASC または省略で昇順（小さい順）です。",
    },
    schema: [ordersTable],
    starterSql: "SELECT *\nFROM orders\nORDER BY ;",
    compareMode: "ordered",
    allowedStatements: ["select"],
    hints: [
      "ORDER BY total_amount で注文金額を基準に並べます。",
      "DESC を付けると大きい値から小さい値の順になります。",
    ],
    solutionSql: "SELECT *\nFROM orders\nORDER BY total_amount DESC;",
    explanation: "ORDER BY は結果の並び順を指定します。DESC は降順、ASC は昇順です。",
  },
  {
    id: "order-recent-orders-limit-three",
    chapterId: "ordering",
    title: "直近 3 件の注文を取得する",
    difficulty: "beginner",
    estimatedMinutes: 9,
    summary: "ORDER BY と LIMIT を組み合わせて最新の行だけを取得します。",
    tags: ["ORDER BY", "LIMIT"],
    task: "orders テーブルを ordered_at の新しい順に並べ、先頭 3 件について id と ordered_at を取得してください。",
    learningPoint: {
      syntax: "SELECT 列\nFROM テーブル名\nORDER BY 列 DESC\nLIMIT 件数;",
      description:
        "LIMIT は結果の先頭から指定した件数だけを取得します。ORDER BY で並べてから LIMIT で絞るのが定番の組み合わせです。",
    },
    schema: [ordersTable],
    starterSql: "SELECT id, ordered_at\nFROM orders\nORDER BY \nLIMIT ;",
    compareMode: "ordered",
    allowedStatements: ["select"],
    hints: [
      "新しい日付を先に出すには ordered_at DESC を使います。",
      "先頭 3 件だけにするには LIMIT 3 を付けます。",
    ],
    solutionSql: "SELECT id, ordered_at\nFROM orders\nORDER BY ordered_at DESC\nLIMIT 3;",
    explanation: "ORDER BY で並び順を作ってから LIMIT で取得件数を制限します。",
  },
  {
    id: "order-low-value-orders-limit-two",
    chapterId: "ordering",
    title: "注文金額の低い順に 2 件取得する",
    difficulty: "beginner",
    estimatedMinutes: 9,
    summary: "ASC と LIMIT で小さい値から必要な件数だけ取得します。",
    tags: ["ORDER BY", "ASC", "LIMIT"],
    task: "orders テーブルを total_amount の低い順に並べ、先頭 2 件について id と total_amount を取得してください。",
    learningPoint: {
      syntax: "SELECT 列\nFROM テーブル名\nORDER BY 列 ASC\nLIMIT 件数;",
      description:
        "ASC は昇順（小さい順）です。省略しても昇順になりますが、明示すると意図が伝わりやすくなります。",
    },
    schema: [ordersTable],
    starterSql: "SELECT id, total_amount\nFROM orders\nORDER BY \nLIMIT ;",
    compareMode: "ordered",
    allowedStatements: ["select"],
    hints: [
      "低い順は ORDER BY total_amount ASC です。",
      "ASC は省略できますが、明示すると意図が伝わりやすくなります。",
    ],
    solutionSql: "SELECT id, total_amount\nFROM orders\nORDER BY total_amount ASC\nLIMIT 2;",
    explanation:
      "ASC は昇順を表します。LIMIT と組み合わせるとランキングの上位や下位を取り出せます。",
  },
  {
    id: "order-customers-by-name-desc",
    chapterId: "ordering",
    title: "顧客名を逆順に並べる",
    difficulty: "beginner",
    estimatedMinutes: 8,
    summary: "TEXT 型の列でも ORDER BY で並び替えできます。",
    tags: ["ORDER BY", "DESC"],
    task: "customers テーブルを name の降順に並べ、id と name を取得してください。",
    learningPoint: {
      syntax: "SELECT 列\nFROM テーブル名\nORDER BY 文字列の列 DESC;",
      description:
        "ORDER BY は数値だけでなく文字列にも使えます。文字列は辞書順（アルファベット順）で並びます。",
    },
    schema: [customersTable],
    starterSql: "SELECT id, name\nFROM customers\nORDER BY ;",
    compareMode: "ordered",
    allowedStatements: ["select"],
    hints: [
      "文字列の列も ORDER BY の対象にできます。",
      "降順にするには ORDER BY name DESC と書きます。",
    ],
    solutionSql: "SELECT id, name\nFROM customers\nORDER BY name DESC;",
    explanation: "ORDER BY は数値だけでなく文字列にも使えます。DESC を付けると逆順になります。",
  },
];
