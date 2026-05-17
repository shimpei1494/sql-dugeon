import { Badge, Button, Container, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { Link, createFileRoute } from "@tanstack/react-router";

import { ContinueLessonAction } from "../features/lessons/components/ContinueLessonAction";
import { LearningProgressPanel } from "../features/lessons/components/LearningProgressPanel";
import { useLessonProgress } from "../features/lessons/hooks/useCompletedLessons";
import { getLessonCatalog } from "../features/lessons/server/lessonServerFns";

export const Route = createFileRoute("/")({
  loader: () => getLessonCatalog(),
  component: Home,
});

function Home() {
  const { chapters, lessons } = Route.useLoaderData();
  const { completedLessonIds, lastOpenedLessonId } = useLessonProgress();
  const lastOpenedLesson = lessons.find((lesson) => lesson.id === lastOpenedLessonId);

  return (
    <Container size="xl" py={64}>
      <Stack gap={48}>
        <Stack gap="lg" maw={760}>
          <Badge color="teal" variant="light" w="fit-content">
            Browser SQLite Learning
          </Badge>
          <Title order={1} className="hero-title">
            SQLite で SQL の基礎を実行しながら学ぶ
          </Title>
          <Text size="lg" c="dimmed">
            Lesson ごとのデータセットを開き、SQL を書いて結果を確認する学習アプリです。まずは SELECT
            基礎の画面構成から作っています。
          </Text>
          <Group>
            <Button component={Link} to="/lessons" size="md">
              Lesson を始める
            </Button>
            {lastOpenedLesson ? <ContinueLessonAction lesson={lastOpenedLesson} /> : null}
          </Group>
          {lastOpenedLesson ? (
            <Text size="sm" c="dimmed">
              前回: {lastOpenedLesson.title}
            </Text>
          ) : null}
        </Stack>

        <LearningProgressPanel
          chapters={chapters}
          completedLessonIds={completedLessonIds}
          lessons={lessons}
        />

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
          {[
            [
              "軽い一覧",
              "Lesson 一覧では summary だけを読み込み、詳細データは開いた Lesson ごとに取得します。",
            ],
            ["作業 DB", "Lesson ごとに seed data からブラウザ内の一時 SQLite DB を作ります。"],
            ["採点と復習", "実行結果を期待結果と比較し、正解後に解説と模範解答を確認できます。"],
          ].map(([title, description]) => (
            <Stack key={title} gap={6} className="feature-panel">
              <Title order={2} size="h4">
                {title}
              </Title>
              <Text size="sm" c="dimmed">
                {description}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
