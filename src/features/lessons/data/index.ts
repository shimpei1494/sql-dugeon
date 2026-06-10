import type { Chapter, LessonDefinition } from "../types";
import { aggregationChapter, aggregationLessons } from "./chapters/aggregation";
import { cteChapter, cteLessons } from "./chapters/cte";
import { expressionsChapter, expressionsLessons } from "./chapters/expressions";
import { filteringChapter, filteringLessons } from "./chapters/filtering";
import { joinChapter, joinLessons } from "./chapters/join";
import { orderingChapter, orderingLessons } from "./chapters/ordering";
import { selectBasicsChapter, selectBasicsLessons } from "./chapters/selectBasics";
import { setOperationsChapter, setOperationsLessons } from "./chapters/setOperations";
import { subqueryChapter, subqueryLessons } from "./chapters/subquery";
import { windowFunctionsChapter, windowFunctionsLessons } from "./chapters/windowFunctions";

/** 教材データを更新したら、localStorage の古い進捗と区別するためにバージョンを上げる。 */
export const seedVersion = "2026-06-10.4";

export const chapterDefinitions: Chapter[] = [
  selectBasicsChapter,
  filteringChapter,
  orderingChapter,
  aggregationChapter,
  joinChapter,
  expressionsChapter,
  subqueryChapter,
  cteChapter,
  windowFunctionsChapter,
  setOperationsChapter,
];

export const lessonDefinitions: LessonDefinition[] = [
  ...selectBasicsLessons,
  ...filteringLessons,
  ...orderingLessons,
  ...aggregationLessons,
  ...joinLessons,
  ...expressionsLessons,
  ...subqueryLessons,
  ...cteLessons,
  ...windowFunctionsLessons,
  ...setOperationsLessons,
];
