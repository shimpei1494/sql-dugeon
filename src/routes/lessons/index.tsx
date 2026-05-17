import { Button, Container, Group, NativeSelect, Paper, Stack } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { valibotValidator } from "@tanstack/valibot-adapter";
import * as v from "valibot";

import { PageHeader } from "../../components/PageHeader";
import { LessonList } from "../../features/lessons/components/LessonList";
import { useCompletedLessons } from "../../features/lessons/hooks/useCompletedLessons";
import { getLessonCatalog } from "../../features/lessons/server/lessonServerFns";
import type { Chapter, LessonSummary } from "../../features/lessons/types";

const chapterSearchParamSchema = v.fallback(
  v.optional(v.pipe(v.string(), v.nonEmpty())),
  undefined,
);
const difficultySearchParamSchema = v.fallback(
  v.optional(v.picklist(["beginner", "intermediate", "advanced"])),
  undefined,
);
const statusSearchParamSchema = v.fallback(
  v.optional(v.picklist(["completed", "incomplete"])),
  undefined,
);

const lessonsSearchSchema = v.object({
  chapter: chapterSearchParamSchema,
  difficulty: difficultySearchParamSchema,
  status: statusSearchParamSchema,
});

type LessonsSearch = v.InferOutput<typeof lessonsSearchSchema>;

function parseDifficultySearchParam(value: string): LessonsSearch["difficulty"] {
  return v.parse(difficultySearchParamSchema, value);
}

function parseStatusSearchParam(value: string): LessonsSearch["status"] {
  return v.parse(statusSearchParamSchema, value);
}

export const Route = createFileRoute("/lessons/")({
  validateSearch: valibotValidator(lessonsSearchSchema),
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
              difficulty: parseDifficultySearchParam(event.currentTarget.value),
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
              status: parseStatusSearchParam(event.currentTarget.value),
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
