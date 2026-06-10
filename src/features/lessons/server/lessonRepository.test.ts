import { describe, expect, it } from "vite-plus/test";

import { validateExecutableSql } from "../../sqlite/sqlSafety";
import { getChapters, getLessonPayload, getLessonSummaries } from "./lessonRepository";

async function getAllLessonPayloads() {
  const summaries = await getLessonSummaries();
  return Promise.all(summaries.map((summary) => getLessonPayload(summary.id)));
}

describe("lessonRepository", () => {
  it("returns chapters sorted by order", () => {
    const chapters = getChapters();

    expect(chapters.map((chapter) => chapter.id)).toEqual([
      "select-basics",
      "filtering",
      "ordering",
    ]);
  });

  it("derives a non-empty expected result for every lesson", async () => {
    const payloads = await getAllLessonPayloads();

    expect(payloads.length).toBeGreaterThanOrEqual(10);

    for (const payload of payloads) {
      expect(payload).toBeDefined();
      expect(
        payload?.lesson.expectedResult.columns.length,
        `Lesson ${payload?.lesson.id} has no expected columns`,
      ).toBeGreaterThan(0);
      expect(
        payload?.lesson.expectedResult.rows.length,
        `Lesson ${payload?.lesson.id} has no expected rows`,
      ).toBeGreaterThan(0);
    }
  });

  it("accepts every lesson's solutionSql under its own safety rules", async () => {
    const payloads = await getAllLessonPayloads();

    for (const payload of payloads) {
      const lesson = payload?.lesson;

      expect(lesson).toBeDefined();

      if (lesson) {
        const safetyResult = validateExecutableSql(lesson.solutionSql, lesson.allowedStatements);
        expect(safetyResult.ok, `solutionSql rejected for ${lesson.id}`).toBe(true);
      }
    }
  });

  it("derives ordered results that reflect the solution's ORDER BY", async () => {
    const payload = await getLessonPayload("order-high-value-orders");

    expect(payload?.lesson.expectedResult.rows.map((row) => row["total_amount"])).toEqual([
      21_500, 12_800, 9_300, 7_600, 4_200,
    ]);
  });

  it("derives only the selected columns", async () => {
    const payload = await getLessonPayload("select-customer-contact");

    expect(payload?.lesson.expectedResult.columns).toEqual(["name", "email"]);
  });
});
