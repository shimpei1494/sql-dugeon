import * as v from "valibot";

import { chapterDefinitions, lessonDefinitions, seedVersion } from "../data";
import { chapterSchema, lessonDefinitionSchema, lessonSchema } from "../lessonSchemas";
import type { Chapter, Lesson, LessonPayload, LessonSummary } from "../types";
import { deriveExpectedResult } from "./deriveExpectedResult";

const chapters = v.parse(v.array(chapterSchema), chapterDefinitions);

function sortChaptersByOrder(rows: Chapter[]) {
  const sortedRows = Array.from(rows);
  sortedRows.sort((a, b) => a.order - b.order);
  return sortedRows;
}

function sortLessonsByChapterOrder(rows: Lesson[]) {
  const chapterOrderById = new Map(chapters.map((chapter) => [chapter.id, chapter.order]));
  const lessonIndexById = new Map(rows.map((lesson, index) => [lesson.id, index]));
  const sortedRows = Array.from(rows);

  sortedRows.sort((a, b) => {
    const chapterOrderDiff =
      (chapterOrderById.get(a.chapterId) ?? Number.MAX_SAFE_INTEGER) -
      (chapterOrderById.get(b.chapterId) ?? Number.MAX_SAFE_INTEGER);

    if (chapterOrderDiff !== 0) {
      return chapterOrderDiff;
    }

    return (lessonIndexById.get(a.id) ?? 0) - (lessonIndexById.get(b.id) ?? 0);
  });

  return sortedRows;
}

type LessonCatalog = {
  orderedLessons: Lesson[];
  lessonById: Map<string, Lesson>;
  nextLessonById: Map<string, Lesson>;
};

let catalogPromise: Promise<LessonCatalog> | undefined;

async function buildLessonCatalog(): Promise<LessonCatalog> {
  const definitions = v.parse(v.array(lessonDefinitionSchema), lessonDefinitions);

  const lessons = v.parse(
    v.array(lessonSchema),
    await Promise.all(
      definitions.map(async (definition) => ({
        ...definition,
        expectedResult: await deriveExpectedResult(definition),
      })),
    ),
  );

  const orderedLessons = sortLessonsByChapterOrder(lessons);
  const lessonById = new Map(orderedLessons.map((lesson) => [lesson.id, lesson]));
  const nextLessonById = new Map<string, Lesson>();

  for (let index = 0; index < orderedLessons.length - 1; index += 1) {
    const lesson = orderedLessons[index];
    const nextLesson = orderedLessons[index + 1];

    if (lesson && nextLesson) {
      nextLessonById.set(lesson.id, nextLesson);
    }
  }

  return { orderedLessons, lessonById, nextLessonById };
}

function getLessonCatalog(): Promise<LessonCatalog> {
  catalogPromise ??= buildLessonCatalog();
  return catalogPromise;
}

export function getChapters(): Chapter[] {
  return sortChaptersByOrder(chapters);
}

export async function getLessonSummaries(): Promise<LessonSummary[]> {
  const { orderedLessons } = await getLessonCatalog();

  return orderedLessons.map(
    ({
      schema: _schema,
      starterSql: _starterSql,
      expectedResult: _expectedResult,
      compareMode: _compareMode,
      allowedStatements: _allowedStatements,
      requiredConstructs: _requiredConstructs,
      forbiddenConstructs: _forbiddenConstructs,
      hints: _hints,
      solutionSql: _solutionSql,
      explanation: _explanation,
      task: _task,
      learningPoint: _learningPoint,
      ...summary
    }) => summary,
  );
}

export async function getLessonPayload(lessonId: string): Promise<LessonPayload | undefined> {
  const { lessonById, nextLessonById } = await getLessonCatalog();
  const lesson = lessonById.get(lessonId);

  if (!lesson) {
    return undefined;
  }

  return {
    lesson,
    nextLesson: nextLessonById.get(lessonId),
    seedVersion,
  };
}
