import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";

import { getChapters, getLessonPayload, getLessonSummaries } from "./lessonRepository";

const lessonIdSchema = v.pipe(v.string(), v.nonEmpty());

export const getLessonCatalog = createServerFn({ method: "GET" }).handler(async () => ({
  chapters: getChapters(),
  lessons: getLessonSummaries(),
}));

export const getLessonDetail = createServerFn({ method: "GET" })
  .inputValidator(v.parser(lessonIdSchema))
  .handler(async ({ data: lessonId }) => {
    const payload = getLessonPayload(lessonId);

    if (!payload) {
      throw new Error(`Lesson not found: ${lessonId}`);
    }

    return payload;
  });
