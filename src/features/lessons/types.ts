type Difficulty = "beginner" | "intermediate" | "advanced";

export type SqlValue = string | number | boolean | null;

type ColumnDefinition = {
  name: string;
  type: "INTEGER" | "REAL" | "TEXT" | "BLOB" | "NULL";
  nullable?: boolean;
};

export type TableDefinition = {
  name: string;
  columns: ColumnDefinition[];
  rows: Record<string, SqlValue>[];
};

export type QueryResult = {
  columns: string[];
  rows: Record<string, SqlValue>[];
};

type AllowedStatement = "select" | "with";

export type LessonSummary = {
  id: string;
  chapterId: string;
  title: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  summary: string;
  tags: string[];
};

export type Chapter = {
  id: string;
  title: string;
  description: string;
  order: number;
};

export type Lesson = LessonSummary & {
  task: string;
  schema: TableDefinition[];
  starterSql: string;
  expectedResult: QueryResult;
  compareMode: "ordered" | "unordered";
  allowedStatements: AllowedStatement[];
  hints: string[];
  solutionSql: string;
  explanation: string;
};

export type LessonPayload = {
  lesson: Lesson;
  seedVersion: string;
};
