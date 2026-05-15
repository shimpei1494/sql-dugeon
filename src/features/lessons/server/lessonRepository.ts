import type { Chapter, Lesson, LessonPayload, LessonSummary } from "../types";

const seedVersion = "2026-05-15.phase-1";

const chapters: Chapter[] = [
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
    order: 2,
  },
];

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

const lessons: Lesson[] = [
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
];

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
