import { Group, Paper, Progress, Stack, Text, Title } from "@mantine/core";

import type { Chapter, LessonSummary } from "../types";

type LearningProgressPanelProps = {
  chapters: Chapter[];
  completedLessonIds: Set<string>;
  lessons: LessonSummary[];
};

function toPercent(completedCount: number, totalCount: number) {
  if (totalCount === 0) {
    return 0;
  }

  return Math.round((completedCount / totalCount) * 100);
}

export function LearningProgressPanel({
  chapters,
  completedLessonIds,
  lessons,
}: LearningProgressPanelProps) {
  const knownCompletedCount = lessons.filter((lesson) => completedLessonIds.has(lesson.id)).length;
  const totalProgress = toPercent(knownCompletedCount, lessons.length);

  return (
    <Paper withBorder p="lg" radius="md">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2} size="h3">
              学習進捗
            </Title>
            <Text size="sm" c="dimmed" mt={4}>
              完了した Lesson はこのブラウザに保存されます。
            </Text>
          </div>
          <Text fw={700}>
            {knownCompletedCount} / {lessons.length}
          </Text>
        </Group>

        <Stack gap={6}>
          <Progress value={totalProgress} color="teal" aria-label="全体の学習進捗" />
          <Text size="sm" c="dimmed">
            全体 {totalProgress}%
          </Text>
        </Stack>

        <Stack gap="sm">
          {chapters.map((chapter) => {
            const chapterLessons = lessons.filter((lesson) => lesson.chapterId === chapter.id);
            const completedCount = chapterLessons.filter((lesson) =>
              completedLessonIds.has(lesson.id),
            ).length;
            const progress = toPercent(completedCount, chapterLessons.length);

            return (
              <Stack key={chapter.id} gap={6}>
                <Group justify="space-between">
                  <Text size="sm" fw={600}>
                    {chapter.title}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {completedCount} / {chapterLessons.length}
                  </Text>
                </Group>
                <Progress value={progress} color="teal" aria-label={`${chapter.title} の進捗`} />
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Paper>
  );
}
