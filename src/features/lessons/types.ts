import type { InferInput, InferOutput } from "valibot";

import type {
  chapterSchema,
  lessonDefinitionSchema,
  lessonPayloadSchema,
  lessonSchema,
  lessonSummarySchema,
  queryResultSchema,
  sqlValueSchema,
  tableDefinitionSchema,
} from "./lessonSchemas";

export type SqlValue = InferOutput<typeof sqlValueSchema>;

export type TableDefinition = InferOutput<typeof tableDefinitionSchema>;

export type QueryResult = InferOutput<typeof queryResultSchema>;

export type LessonSummary = InferOutput<typeof lessonSummarySchema>;

export type Chapter = InferOutput<typeof chapterSchema>;

export type Lesson = InferOutput<typeof lessonSchema>;

/** 教材の手書き定義（counterexamples は省略可）。InferInput なのは authoring 時の型のため。 */
export type LessonDefinition = InferInput<typeof lessonDefinitionSchema>;

export type LessonPayload = InferOutput<typeof lessonPayloadSchema>;
