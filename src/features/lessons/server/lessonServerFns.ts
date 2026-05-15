import { createServerFn } from "@tanstack/react-start";

import { getChapters, getLessonPayload, getLessonSummaries } from "./lessonRepository";

export const getLessonCatalog = createServerFn({ method: "GET" }).handler(async () => ({
  chapters: getChapters(),
  lessons: getLessonSummaries(),
}));

export const getLessonDetail = createServerFn({ method: "GET" })
  .inputValidator((lessonId: string) => lessonId)
  .handler(async ({ data: lessonId }) => {
    const payload = getLessonPayload(lessonId);

    if (!payload) {
      throw new Error(`Lesson not found: ${lessonId}`);
    }

    return payload;
  });
