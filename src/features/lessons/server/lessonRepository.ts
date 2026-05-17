import * as v from "valibot";

import { chapterSchema, lessonSchema } from "../lessonSchemas";
import type { Chapter, Lesson, LessonPayload, LessonSummary } from "../types";

const seedVersion = "2026-05-15.phase-1";

const rawChapters: Chapter[] = [
  {
    id: "select-basics",
    title: "SELECT 基礎",
    description: "テーブルから必要な行と列を取り出す基本を学びます。",
    order: 1,
  },
  {
    id: "ordering",
    title: "並び替えと件数制限",
    description: "ORDER BY と LIMIT で結果の順序と件数を制御します。",
    order: 3,
  },
  {
    id: "filtering",
    title: "WHERE 条件",
    description: "WHERE 句で条件に合う行だけを取り出します。",
    order: 2,
  },
];

const chapters = v.parse(v.array(chapterSchema), rawChapters);

const customerRows = [
  { id: 1, name: "Aoi Tanaka", email: "aoi@example.com", age: 24, city: "Tokyo" },
  { id: 2, name: "Ren Sato", email: "ren@example.com", age: 32, city: "Osaka" },
  { id: 3, name: "Mio Suzuki", email: "mio@example.com", age: 29, city: "Fukuoka" },
  { id: 4, name: "Kai Ito", email: "kai@example.com", age: 41, city: "Tokyo" },
];

const orderRows = [
  { id: 101, customer_id: 2, ordered_at: "2026-04-21", total_amount: 12_800 },
  { id: 102, customer_id: 1, ordered_at: "2026-05-02", total_amount: 4_200 },
  { id: 103, customer_id: 4, ordered_at: "2026-05-06", total_amount: 21_500 },
  { id: 104, customer_id: 2, ordered_at: "2026-05-11", total_amount: 7_600 },
  { id: 105, customer_id: 3, ordered_at: "2026-05-13", total_amount: 9_300 },
];

function sortOrdersByAmountDescending(rows: typeof orderRows) {
  const sortedRows = Array.from(rows);
  sortedRows.sort((a, b) => b.total_amount - a.total_amount);
  return sortedRows;
}

function sortOrdersByAmountAscending(rows: typeof orderRows) {
  const sortedRows = Array.from(rows);
  sortedRows.sort((a, b) => a.total_amount - b.total_amount);
  return sortedRows;
}

function sortOrdersByDateDescending(rows: typeof orderRows) {
  const sortedRows = Array.from(rows);
  sortedRows.sort((a, b) => b.ordered_at.localeCompare(a.ordered_at));
  return sortedRows;
}

function sortCustomersByNameDescending(rows: typeof customerRows) {
  const sortedRows = Array.from(rows);
  sortedRows.sort((a, b) => b.name.localeCompare(a.name));
  return sortedRows;
}

function pickRows<TInput, TOutput>(
  rows: TInput[],
  predicate: (row: TInput) => boolean,
  project: (row: TInput) => TOutput,
) {
  const pickedRows: TOutput[] = [];

  for (const row of rows) {
    if (predicate(row)) {
      pickedRows.push(project(row));
    }
  }

  return pickedRows;
}

function sortChaptersByOrder(rows: Chapter[]) {
  const sortedRows = Array.from(rows);
  sortedRows.sort((a, b) => a.order - b.order);
  return sortedRows;
}

const customersTable = {
  name: "customers",
  columns: [
    { name: "id", type: "INTEGER" },
    { name: "name", type: "TEXT" },
    { name: "email", type: "TEXT" },
    { name: "age", type: "INTEGER" },
    { name: "city", type: "TEXT" },
  ],
  rows: customerRows,
} satisfies Lesson["schema"][number];

const ordersTable = {
  name: "orders",
  columns: [
    { name: "id", type: "INTEGER" },
    { name: "customer_id", type: "INTEGER" },
    { name: "ordered_at", type: "TEXT" },
    { name: "total_amount", type: "INTEGER" },
  ],
  rows: orderRows,
} satisfies Lesson["schema"][number];

const rawLessons: Lesson[] = [
  {
    id: "select-all-customers",
    chapterId: "select-basics",
    title: "顧客をすべて取得する",
    difficulty: "beginner",
    estimatedMinutes: 5,
    summary: "SELECT と FROM を使ってテーブル全体を取得します。",
    tags: ["SELECT", "FROM"],
    task: "customers テーブルのすべての列とすべての行を取得してください。",
    schema: [customersTable],
    starterSql: "SELECT *\nFROM customers;",
    expectedResult: {
      columns: ["id", "name", "email", "age", "city"],
      rows: customerRows,
    },
    compareMode: "unordered",
    allowedStatements: ["select"],
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
    schema: [customersTable],
    starterSql: "SELECT\n  \nFROM customers;",
    expectedResult: {
      columns: ["name", "email"],
      rows: customerRows.map(({ name, email }) => ({ name, email })),
    },
    compareMode: "unordered",
    allowedStatements: ["select"],
    hints: [
      "SELECT name, email のように列名をカンマで並べます。",
      "* を使わないことで必要な列だけ取得できます。",
    ],
    solutionSql: "SELECT name, email\nFROM customers;",
    explanation: "必要な列だけを指定すると、結果が読みやすくなり転送量も抑えられます。",
  },
  {
    id: "order-high-value-orders",
    chapterId: "ordering",
    title: "注文金額の高い順に並べる",
    difficulty: "beginner",
    estimatedMinutes: 8,
    summary: "ORDER BY と DESC で高い値から順に並べます。",
    tags: ["ORDER BY", "DESC"],
    task: "orders テーブルを total_amount の高い順に並べ、すべての列を取得してください。",
    schema: [ordersTable],
    starterSql: "SELECT *\nFROM orders\nORDER BY ;",
    expectedResult: {
      columns: ["id", "customer_id", "ordered_at", "total_amount"],
      rows: sortOrdersByAmountDescending(orderRows),
    },
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
    id: "filter-customers-age-at-least-30",
    chapterId: "filtering",
    title: "30 歳以上の顧客を取得する",
    difficulty: "beginner",
    estimatedMinutes: 7,
    summary: "WHERE と比較演算子で条件に合う行だけを取得します。",
    tags: ["WHERE", ">="],
    task: "customers テーブルから age が 30 以上の顧客について、すべての列を取得してください。",
    schema: [customersTable],
    starterSql: "SELECT *\nFROM customers\nWHERE ;",
    expectedResult: {
      columns: ["id", "name", "email", "age", "city"],
      rows: customerRows.filter((customer) => customer.age >= 30),
    },
    compareMode: "unordered",
    allowedStatements: ["select"],
    hints: ["WHERE は取得する行の条件を指定します。", "30 以上は age >= 30 と書けます。"],
    solutionSql: "SELECT *\nFROM customers\nWHERE age >= 30;",
    explanation: "WHERE 句に比較条件を書くと、条件を満たす行だけが結果に残ります。",
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
    schema: [customersTable],
    starterSql: "SELECT name, city\nFROM customers\nWHERE ;",
    expectedResult: {
      columns: ["name", "city"],
      rows: pickRows(
        customerRows,
        (customer) => customer.city === "Tokyo",
        ({ name, city }) => ({ name, city }),
      ),
    },
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
    schema: [customersTable],
    starterSql: "SELECT id, name\nFROM customers\nWHERE name LIKE ;",
    expectedResult: {
      columns: ["id", "name"],
      rows: pickRows(
        customerRows,
        (customer) => customer.name.startsWith("Mio"),
        ({ id, name }) => ({ id, name }),
      ),
    },
    compareMode: "unordered",
    allowedStatements: ["select"],
    hints: ["LIKE では % が任意の文字列に対応します。", "Mio で始まる値は 'Mio%' で表せます。"],
    solutionSql: "SELECT id, name\nFROM customers\nWHERE name LIKE 'Mio%';",
    explanation: "LIKE は部分一致や前方一致の検索に使います。% は 0 文字以上の任意の文字列です。",
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
    schema: [customersTable],
    starterSql: "SELECT name, city\nFROM customers\nWHERE city IN ();",
    expectedResult: {
      columns: ["name", "city"],
      rows: pickRows(
        customerRows,
        (customer) => customer.city === "Tokyo" || customer.city === "Osaka",
        ({ name, city }) => ({ name, city }),
      ),
    },
    compareMode: "unordered",
    allowedStatements: ["select"],
    hints: [
      "IN は複数の候補値をカンマ区切りで指定します。",
      "city IN ('Tokyo', 'Osaka') のように書けます。",
    ],
    solutionSql: "SELECT name, city\nFROM customers\nWHERE city IN ('Tokyo', 'Osaka');",
    explanation: "IN を使うと、同じ列に対する複数の等価条件を短く書けます。",
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
    schema: [ordersTable],
    starterSql: "SELECT id, total_amount\nFROM orders\nWHERE ;",
    expectedResult: {
      columns: ["id", "total_amount"],
      rows: pickRows(
        orderRows,
        (order) => order.total_amount >= 9_000,
        ({ id, total_amount }) => ({ id, total_amount }),
      ),
    },
    compareMode: "unordered",
    allowedStatements: ["select"],
    hints: ["total_amount は数値の列です。", "9000 以上は total_amount >= 9000 と書けます。"],
    solutionSql: "SELECT id, total_amount\nFROM orders\nWHERE total_amount >= 9000;",
    explanation: "数値列に対しても WHERE の比較演算子で条件を指定できます。",
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
    schema: [ordersTable],
    starterSql: "SELECT id, ordered_at\nFROM orders\nORDER BY \nLIMIT ;",
    expectedResult: {
      columns: ["id", "ordered_at"],
      rows: sortOrdersByDateDescending(orderRows)
        .slice(0, 3)
        .map(({ id, ordered_at }) => ({ id, ordered_at })),
    },
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
    schema: [ordersTable],
    starterSql: "SELECT id, total_amount\nFROM orders\nORDER BY \nLIMIT ;",
    expectedResult: {
      columns: ["id", "total_amount"],
      rows: sortOrdersByAmountAscending(orderRows)
        .slice(0, 2)
        .map(({ id, total_amount }) => ({ id, total_amount })),
    },
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
    schema: [customersTable],
    starterSql: "SELECT id, name\nFROM customers\nORDER BY ;",
    expectedResult: {
      columns: ["id", "name"],
      rows: sortCustomersByNameDescending(customerRows).map(({ id, name }) => ({ id, name })),
    },
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

const lessons = v.parse(v.array(lessonSchema), rawLessons);

const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));

export function getChapters(): Chapter[] {
  return sortChaptersByOrder(chapters);
}

export function getLessonSummaries(): LessonSummary[] {
  return lessons.map(
    ({
      schema: _schema,
      starterSql: _starterSql,
      expectedResult: _expectedResult,
      compareMode: _compareMode,
      allowedStatements: _allowedStatements,
      hints: _hints,
      solutionSql: _solutionSql,
      explanation: _explanation,
      task: _task,
      ...summary
    }) => summary,
  );
}

export function getLessonPayload(lessonId: string): LessonPayload | undefined {
  const lesson = lessonById.get(lessonId);

  if (!lesson) {
    return undefined;
  }

  return {
    lesson,
    seedVersion,
  };
}
