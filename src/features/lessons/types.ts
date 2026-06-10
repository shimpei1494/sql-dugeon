import type { InferOutput } from "valibot";

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

export type LessonDefinition = InferOutput<typeof lessonDefinitionSchema>;

export type LessonPayload = InferOutput<typeof lessonPayloadSchema>;
