import * as v from "valibot";

const requiredStringSchema = v.pipe(v.string(), v.nonEmpty());
const integerSchema = v.pipe(v.number(), v.integer());

const difficultySchema = v.picklist(["beginner", "intermediate", "advanced"]);

export const sqlValueSchema = v.union([v.string(), v.number(), v.boolean(), v.null()]);

const columnDefinitionSchema = v.object({
  name: requiredStringSchema,
  type: v.picklist(["INTEGER", "REAL", "TEXT", "BLOB", "NULL"]),
  nullable: v.optional(v.boolean()),
});

export const tableDefinitionSchema = v.object({
  name: requiredStringSchema,
  columns: v.pipe(v.array(columnDefinitionSchema), v.nonEmpty()),
  rows: v.array(v.record(v.string(), sqlValueSchema)),
});

export const queryResultSchema = v.object({
  columns: v.array(requiredStringSchema),
  rows: v.array(v.record(v.string(), sqlValueSchema)),
});

const allowedStatementSchema = v.picklist(["select", "with"]);

export const lessonSummarySchema = v.object({
  id: requiredStringSchema,
  chapterId: requiredStringSchema,
  title: requiredStringSchema,
  difficulty: difficultySchema,
  estimatedMinutes: v.pipe(integerSchema, v.minValue(1)),
  summary: requiredStringSchema,
  tags: v.array(requiredStringSchema),
});

export const chapterSchema = v.object({
  id: requiredStringSchema,
  title: requiredStringSchema,
  description: requiredStringSchema,
  order: integerSchema,
});

/** 正解前から表示する「このレッスンで学ぶ構文」。 */
const learningPointSchema = v.object({
  syntax: requiredStringSchema,
  description: requiredStringSchema,
});

export const lessonSchema = v.object({
  id: requiredStringSchema,
  chapterId: requiredStringSchema,
  title: requiredStringSchema,
  difficulty: difficultySchema,
  estimatedMinutes: v.pipe(integerSchema, v.minValue(1)),
  summary: requiredStringSchema,
  tags: v.array(requiredStringSchema),
  task: requiredStringSchema,
  learningPoint: learningPointSchema,
  schema: v.pipe(v.array(tableDefinitionSchema), v.nonEmpty()),
  starterSql: requiredStringSchema,
  expectedResult: queryResultSchema,
  compareMode: v.picklist(["ordered", "unordered"]),
  allowedStatements: v.pipe(v.array(allowedStatementSchema), v.nonEmpty()),
  hints: v.array(requiredStringSchema),
  solutionSql: requiredStringSchema,
  explanation: requiredStringSchema,
});

/** 教材として手書きする Lesson 定義。expectedResult は solutionSql から自動導出する。 */
export const lessonDefinitionSchema = v.omit(lessonSchema, ["expectedResult"]);

export const lessonPayloadSchema = v.object({
  lesson: lessonSchema,
  nextLesson: v.optional(lessonSummarySchema),
  seedVersion: requiredStringSchema,
});
