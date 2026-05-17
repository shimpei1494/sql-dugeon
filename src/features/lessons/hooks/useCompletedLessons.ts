import { useEffect, useState } from "react";

const completedLessonsStorageKey = "sql-dungeon:completed-lessons";
const completedLessonsChangedEvent = "sql-dungeon:completed-lessons-changed";

function readCompletedLessonIds(): Set<string> {
  if (typeof window === "undefined") {
    return new Set();
  }

  try {
    const value = window.localStorage.getItem(completedLessonsStorageKey);
    const parsedValue: unknown = value ? JSON.parse(value) : [];

    if (!Array.isArray(parsedValue)) {
      return new Set();
    }

    return new Set(parsedValue.filter((item): item is string => typeof item === "string"));
  } catch {
    return new Set();
  }
}

function writeCompletedLessonIds(lessonIds: Set<string>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    completedLessonsStorageKey,
    JSON.stringify(Array.from(lessonIds).sort()),
  );
  window.dispatchEvent(new Event(completedLessonsChangedEvent));
}

export function markLessonCompleted(lessonId: string) {
  const lessonIds = readCompletedLessonIds();
  lessonIds.add(lessonId);
  writeCompletedLessonIds(lessonIds);
}

export function useCompletedLessons() {
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const syncCompletedLessonIds = () => {
      setCompletedLessonIds(readCompletedLessonIds());
    };

    syncCompletedLessonIds();
    window.addEventListener("storage", syncCompletedLessonIds);
    window.addEventListener(completedLessonsChangedEvent, syncCompletedLessonIds);

    return () => {
      window.removeEventListener("storage", syncCompletedLessonIds);
      window.removeEventListener(completedLessonsChangedEvent, syncCompletedLessonIds);
    };
  }, []);

  return completedLessonIds;
}
