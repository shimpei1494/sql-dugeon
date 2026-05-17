import { useEffect, useState } from "react";
import * as v from "valibot";

const completedLessonsStorageKey = "sql-dungeon:completed-lessons";
const lastOpenedLessonStorageKey = "sql-dungeon:last-opened-lesson";
const lessonProgressChangedEvent = "sql-dungeon:lesson-progress-changed";
const completedLessonIdsSchema = v.array(v.string());
const lastOpenedLessonIdSchema = v.pipe(v.string(), v.nonEmpty());

type LessonProgress = {
  completedLessonIds: Set<string>;
  lastOpenedLessonId?: string;
};

function getLocalStorage(): Storage | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    return window.localStorage ?? undefined;
  } catch {
    return undefined;
  }
}

function readCompletedLessonIds(): Set<string> {
  const storage = getLocalStorage();

  if (!storage) {
    return new Set();
  }

  try {
    const value = storage.getItem(completedLessonsStorageKey);
    const parsedValue: unknown = value ? JSON.parse(value) : [];
    const result = v.safeParse(completedLessonIdsSchema, parsedValue);

    if (!result.success) {
      return new Set();
    }

    return new Set(result.output);
  } catch {
    return new Set();
  }
}

function readLastOpenedLessonId(): string | undefined {
  const storage = getLocalStorage();

  if (!storage) {
    return undefined;
  }

  const result = v.safeParse(lastOpenedLessonIdSchema, storage.getItem(lastOpenedLessonStorageKey));
  return result.success ? result.output : undefined;
}

function readLessonProgress(): LessonProgress {
  return {
    completedLessonIds: readCompletedLessonIds(),
    lastOpenedLessonId: readLastOpenedLessonId(),
  };
}

function notifyLessonProgressChanged() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(lessonProgressChangedEvent));
}

function writeCompletedLessonIds(lessonIds: Set<string>) {
  const storage = getLocalStorage();

  if (!storage) {
    return;
  }

  storage.setItem(completedLessonsStorageKey, JSON.stringify(Array.from(lessonIds).sort()));
  notifyLessonProgressChanged();
}

export function markLessonCompleted(lessonId: string) {
  const lessonIds = readCompletedLessonIds();
  lessonIds.add(lessonId);
  writeCompletedLessonIds(lessonIds);
}

export function markLessonOpened(lessonId: string) {
  const storage = getLocalStorage();

  if (!storage) {
    return;
  }

  storage.setItem(lastOpenedLessonStorageKey, lessonId);
  notifyLessonProgressChanged();
}

export function useLessonProgress() {
  const [lessonProgress, setLessonProgress] = useState<LessonProgress>(() => ({
    completedLessonIds: new Set(),
  }));

  useEffect(() => {
    const syncLessonProgress = () => {
      setLessonProgress(readLessonProgress());
    };

    syncLessonProgress();
    window.addEventListener("storage", syncLessonProgress);
    window.addEventListener(lessonProgressChangedEvent, syncLessonProgress);

    return () => {
      window.removeEventListener("storage", syncLessonProgress);
      window.removeEventListener(lessonProgressChangedEvent, syncLessonProgress);
    };
  }, []);

  return lessonProgress;
}

export function useCompletedLessons() {
  return useLessonProgress().completedLessonIds;
}
