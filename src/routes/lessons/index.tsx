import { Container, Stack } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "../../components/PageHeader";
import { LessonList } from "../../features/lessons/components/LessonList";
import { getLessonCatalog } from "../../features/lessons/server/lessonServerFns";

export const Route = createFileRoute("/lessons/")({
  loader: () => getLessonCatalog(),
  component: LessonsPage,
});

function LessonsPage() {
  const { chapters, lessons } = Route.useLoaderData();

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <PageHeader
          eyebrow="Lesson Catalog"
          title="SQL の基礎を段階的に学ぶ"
          description="まずは SELECT の基本から始めます。一覧には軽い Lesson summary だけを表示し、詳細データは Lesson を開いたときに取得します。"
        />
        <LessonList chapters={chapters} lessons={lessons} />
      </Stack>
    </Container>
  );
}
