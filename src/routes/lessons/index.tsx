import { Button, Container, Group, NativeSelect, Paper, Stack } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "../../components/PageHeader";
import { LessonList } from "../../features/lessons/components/LessonList";
import { useCompletedLessons } from "../../features/lessons/hooks/useCompletedLessons";
import { getLessonCatalog } from "../../features/lessons/server/lessonServerFns";
import type { Chapter, LessonSummary } from "../../features/lessons/types";

type LessonsSearch = {
  chapter?: string;
  difficulty?: LessonSummary["difficulty"];
  status?: "completed" | "incomplete";
};

function parseStringSearchParam(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function parseDifficulty(value: unknown): LessonsSearch["difficulty"] {
  if (value === "beginner" || value === "intermediate" || value === "advanced") {
    return value;
  }

  return undefined;
}

function parseStatus(value: unknown): LessonsSearch["status"] {
  if (value === "completed" || value === "incomplete") {
    return value;
  }

  return undefined;
}

export const Route = createFileRoute("/lessons/")({
  validateSearch: (search: Record<string, unknown>): LessonsSearch => ({
    chapter: parseStringSearchParam(search.chapter),
    difficulty: parseDifficulty(search.difficulty),
    status: parseStatus(search.status),
  }),
  loader: () => getLessonCatalog(),
  component: LessonsPage,
});

type LessonFiltersProps = {
  chapters: Chapter[];
  search: LessonsSearch;
  onChange: (search: LessonsSearch) => void;
};

function LessonFilters({ chapters, search, onChange }: LessonFiltersProps) {
  return (
    <Paper withBorder p="md" radius="md">
      <Group align="end">
        <NativeSelect
          label="Chapter"
          value={search.chapter ?? ""}
          onChange={(event) => {
            onChange({
              ...search,
              chapter: event.currentTarget.value || undefined,
            });
          }}
          data={[
            { label: "すべて", value: "" },
            ...chapters.map((chapter) => ({
              label: chapter.title,
              value: chapter.id,
            })),
          ]}
        />
        <NativeSelect
          label="難易度"
          value={search.difficulty ?? ""}
          onChange={(event) => {
            onChange({
              ...search,
              difficulty: parseDifficulty(event.currentTarget.value),
            });
          }}
          data={[
            { label: "すべて", value: "" },
            { label: "beginner", value: "beginner" },
            { label: "intermediate", value: "intermediate" },
            { label: "advanced", value: "advanced" },
          ]}
        />
        <NativeSelect
          label="状態"
          value={search.status ?? ""}
          onChange={(event) => {
            onChange({
              ...search,
              status: parseStatus(event.currentTarget.value),
            });
          }}
          data={[
            { label: "すべて", value: "" },
            { label: "完了", value: "completed" },
            { label: "未完了", value: "incomplete" },
          ]}
        />
        <Button variant="default" onClick={() => onChange({})}>
          クリア
        </Button>
      </Group>
    </Paper>
  );
}

function filterLessons(
  lessons: LessonSummary[],
  completedLessonIds: Set<string>,
  search: LessonsSearch,
) {
  return lessons.filter((lesson) => {
    if (search.chapter && lesson.chapterId !== search.chapter) {
      return false;
    }

    if (search.difficulty && lesson.difficulty !== search.difficulty) {
      return false;
    }

    if (search.status) {
      const isCompleted = completedLessonIds.has(lesson.id);

      if (search.status === "completed" && !isCompleted) {
        return false;
      }

      if (search.status === "incomplete" && isCompleted) {
        return false;
      }
    }

    return true;
  });
}

function LessonsPage() {
  const { chapters, lessons } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const completedLessonIds = useCompletedLessons();
  const filteredLessons = filterLessons(lessons, completedLessonIds, search);

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <PageHeader
          eyebrow="Lesson Catalog"
          title="SQL の基礎を段階的に学ぶ"
          description="まずは SELECT の基本から始めます。一覧には軽い Lesson summary だけを表示し、詳細データは Lesson を開いたときに取得します。"
        />
        <LessonFilters
          chapters={chapters}
          search={search}
          onChange={(nextSearch) => {
            void navigate({ search: nextSearch });
          }}
        />
        <LessonList chapters={chapters} lessons={filteredLessons} />
      </Stack>
    </Container>
  );
}
