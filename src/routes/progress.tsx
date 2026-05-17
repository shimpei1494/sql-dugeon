import { Anchor, Badge, Container, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "../components/PageHeader";
import { LearningProgressPanel } from "../features/lessons/components/LearningProgressPanel";
import { useCompletedLessons } from "../features/lessons/hooks/useCompletedLessons";
import { getLessonCatalog } from "../features/lessons/server/lessonServerFns";

export const Route = createFileRoute("/progress")({
  loader: () => getLessonCatalog(),
  component: ProgressPage,
});

function ProgressPage() {
  const { chapters, lessons } = Route.useLoaderData();
  const completedLessonIds = useCompletedLessons();

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <PageHeader
          eyebrow="Progress"
          title="学習進捗"
          description="完了した Lesson と Chapter ごとの進み具合を確認できます。進捗はこのブラウザに保存されます。"
        />

        <LearningProgressPanel
          chapters={chapters}
          completedLessonIds={completedLessonIds}
          lessons={lessons}
        />

        <Stack gap="xl">
          {chapters.map((chapter) => {
            const chapterLessons = lessons.filter((lesson) => lesson.chapterId === chapter.id);

            return (
              <Stack key={chapter.id} gap="md">
                <div>
                  <Title order={2} size="h3">
                    {chapter.title}
                  </Title>
                  <Text c="dimmed">{chapter.description}</Text>
                </div>
                <Stack gap="sm">
                  {chapterLessons.map((lesson) => {
                    const isCompleted = completedLessonIds.has(lesson.id);

                    return (
                      <Paper key={lesson.id} withBorder p="md" radius="md">
                        <Group justify="space-between" align="flex-start">
                          <Stack gap={4}>
                            <Group gap="xs">
                              <Badge color={isCompleted ? "teal" : "gray"} variant="light">
                                {isCompleted ? "完了" : "未完了"}
                              </Badge>
                              <Badge color="gray" variant="outline">
                                {lesson.difficulty}
                              </Badge>
                            </Group>
                            <Anchor
                              component="a"
                              href={`/lessons/${lesson.id}`}
                              className="progress-lesson-link"
                            >
                              <Title order={3} size="h4">
                                {lesson.title}
                              </Title>
                            </Anchor>
                            <Text size="sm" c="dimmed">
                              {lesson.summary}
                            </Text>
                          </Stack>
                          <Text size="sm" c="dimmed">
                            {lesson.estimatedMinutes} min
                          </Text>
                        </Group>
                      </Paper>
                    );
                  })}
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Container>
  );
}
