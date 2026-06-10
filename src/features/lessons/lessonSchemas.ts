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

/**
 * 採点時に SQL 中での使用を必須にする構文。
 * 結果一致だけでは判別できない課題（LIKE を = で代用、IN を OR で代用など）で、
 * 課題が教えたい構文を実際に使ってもらうために指定する。
 */
const sqlConstructRuleSchema = v.object({
  /** 対象キーワード。空白は柔軟にマッチする（例: "ORDER BY"） */
  keyword: requiredStringSchema,
  /** 必須なのに不足 / 禁止なのに使用したときに表示する学習メッセージ */
  message: requiredStringSchema,
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
  requiredConstructs: v.optional(v.array(sqlConstructRuleSchema), []),
  /** 使用を禁止する構文。「JOIN を使わずサブクエリで解く」等の書き換え練習に使う。 */
  forbiddenConstructs: v.optional(v.array(sqlConstructRuleSchema), []),
  hints: v.array(requiredStringSchema),
  solutionSql: requiredStringSchema,
  explanation: requiredStringSchema,
});

/**
 * 正解にしてはいけない代表的な誤答 SQL。
 * テストが「データセット上で solutionSql と異なる結果になること」を保証するため、
 * データが誤答を判別できないままレッスンが増えるのを防げる。
 * クライアントへは配信されない（lessonSchema の parse で除去される）。
 */
const counterexampleSchema = v.object({
  sql: requiredStringSchema,
  reason: requiredStringSchema,
});

/** 教材として手書きする Lesson 定義。expectedResult は solutionSql から自動導出する。 */
export const lessonDefinitionSchema = v.object({
  ...v.omit(lessonSchema, ["expectedResult"]).entries,
  counterexamples: v.optional(v.array(counterexampleSchema), []),
});

export const lessonPayloadSchema = v.object({
  lesson: lessonSchema,
  nextLesson: v.optional(lessonSummarySchema),
  seedVersion: requiredStringSchema,
});
