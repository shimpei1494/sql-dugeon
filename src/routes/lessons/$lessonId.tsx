import { Container } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

import { LessonWorkspace } from "../../features/lessons/components/LessonWorkspace";
import { getLessonDetail } from "../../features/lessons/server/lessonServerFns";

export const Route = createFileRoute("/lessons/$lessonId")({
  loader: ({ params }) => getLessonDetail({ data: params.lessonId }),
  component: LessonDetailPage,
});

function LessonDetailPage() {
  const payload = Route.useLoaderData();

  return (
    <Container size="xl" py="xl">
      {/* Lesson 間を SPA 遷移したときにエディタ・実行結果の状態を確実に初期化する */}
      <LessonWorkspace key={payload.lesson.id} payload={payload} />
    </Container>
  );
}
