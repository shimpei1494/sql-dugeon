import {
  Accordion,
  Badge,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
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

function LessonCard({ lesson, isCompleted }: { lesson: LessonSummary; isCompleted: boolean }) {
  return (
    <Link to="/lessons/$lessonId" params={{ lessonId: lesson.id }} className="lesson-card">
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
}

export function LessonList({ chapters, lessons }: LessonListProps) {
  const completedLessonIds = useCompletedLessons();

  if (lessons.length === 0) {
    return (
      <Paper withBorder p="lg" radius="md">
        <Text size="sm" c="dimmed">
          条件に一致する Lesson はありません。
        </Text>
      </Paper>
    );
  }

  return (
    <Accordion
      multiple
      defaultValue={chapters.map((chapter) => chapter.id)}
      variant="separated"
      radius="md"
    >
      {chapters.map((chapter) => {
        const chapterLessons = lessons.filter((lesson) => lesson.chapterId === chapter.id);

        if (chapterLessons.length === 0) {
          return null;
        }

        const completedCount = chapterLessons.filter((lesson) =>
          completedLessonIds.has(lesson.id),
        ).length;

        return (
          <Accordion.Item key={chapter.id} value={chapter.id}>
            <Accordion.Control>
              <Group justify="space-between" align="center" wrap="nowrap" pr="md" gap="lg">
                <div>
                  <Title order={2} size="h3">
                    {chapter.title}
                  </Title>
                  <Text size="sm" c="dimmed">
                    {chapter.description}
                  </Text>
                </div>
                <Stack gap={4} align="flex-end" miw={120}>
                  <Text size="sm" c="dimmed">
                    {completedCount} / {chapterLessons.length} 完了
                  </Text>
                  <Progress
                    value={(completedCount / chapterLessons.length) * 100}
                    color="teal"
                    size="sm"
                    w="100%"
                  />
                </Stack>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md" pt="xs">
                {chapterLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    isCompleted={completedLessonIds.has(lesson.id)}
                  />
                ))}
              </SimpleGrid>
            </Accordion.Panel>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}
