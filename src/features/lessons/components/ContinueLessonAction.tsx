import { Button } from "@mantine/core";

import type { LessonSummary } from "../types";

type ContinueLessonActionProps = {
  lesson: LessonSummary;
};

export function ContinueLessonAction({ lesson }: ContinueLessonActionProps) {
  return (
    <Button component="a" href={`/lessons/${lesson.id}`} size="md" variant="default">
      前回の続き
    </Button>
  );
}
