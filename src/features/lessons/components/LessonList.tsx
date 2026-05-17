import { Badge, Group, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { Link } from "@tanstack/react-router";

import { useCompletedLessons } from "../hooks/useCompletedLessons";
import type { Chapter, LessonSummary } from "../types";

type LessonListProps = {
  chapters: Chapter[];
  lessons: LessonSummary[];
};

function getDifficultyColor(difficulty: LessonSummary["difficulty"]) {
  switch (difficulty) {
    case "beginner":
      return "teal";
    case "intermediate":
      return "blue";
    case "advanced":
      return "grape";
  }
}

export function LessonList({ chapters, lessons }: LessonListProps) {
  const completedLessonIds = useCompletedLessons();

  return (
    <Stack gap="xl">
      {chapters.map((chapter) => {
        const chapterLessons = lessons.filter((lesson) => lesson.chapterId === chapter.id);

        return (
          <Stack key={chapter.id} gap="md">
            <div>
              <Title order={2}>{chapter.title}</Title>
              <Text c="dimmed">{chapter.description}</Text>
            </div>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
              {chapterLessons.map((lesson) => {
                const isCompleted = completedLessonIds.has(lesson.id);

                return (
                  <Link
                    key={lesson.id}
                    to="/lessons/$lessonId"
                    params={{ lessonId: lesson.id }}
                    className="lesson-card"
                  >
                    <Paper withBorder p="lg" radius="md" h="100%">
                      <Stack gap="md">
                        <Group justify="space-between" align="flex-start">
                          <Group gap="xs">
                            <Badge color={getDifficultyColor(lesson.difficulty)} variant="light">
                              {lesson.difficulty}
                            </Badge>
                            {isCompleted ? (
                              <Badge color="teal" variant="filled">
                                完了
                              </Badge>
                            ) : null}
                          </Group>
                          <Text size="sm" c="dimmed">
                            {lesson.estimatedMinutes} min
                          </Text>
                        </Group>
                        <div>
                          <Title order={3} size="h4">
                            {lesson.title}
                          </Title>
                          <Text size="sm" c="dimmed" mt={6}>
                            {lesson.summary}
                          </Text>
                        </div>
                        <Group gap={6}>
                          {lesson.tags.map((tag) => (
                            <Badge key={tag} color="gray" variant="outline" radius="sm">
                              {tag}
                            </Badge>
                          ))}
                        </Group>
                      </Stack>
                    </Paper>
                  </Link>
                );
              })}
            </SimpleGrid>
          </Stack>
        );
      })}
    </Stack>
  );
}
