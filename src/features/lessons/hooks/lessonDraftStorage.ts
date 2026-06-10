const draftStorageKeyPrefix = "sql-dungeon:lesson-draft:";

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

export function readLessonDraft(lessonId: string): string | undefined {
  const value = getLocalStorage()?.getItem(`${draftStorageKeyPrefix}${lessonId}`);
  return value ?? undefined;
}

export function writeLessonDraft(lessonId: string, sql: string) {
  getLocalStorage()?.setItem(`${draftStorageKeyPrefix}${lessonId}`, sql);
}

export function clearLessonDraft(lessonId: string) {
  getLocalStorage()?.removeItem(`${draftStorageKeyPrefix}${lessonId}`);
}
