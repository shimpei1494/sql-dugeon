# SQLite Lab - TanStack Start 実装計画

## 目的

TanStack Start の現在のスターターアプリをベースに、ブラウザ上で SQLite を実行しながら SQL を学べるアプリを作る。

当初の「SQL Dungeon Lite」というゲーム文脈は外し、実務に近いデータセット、段階的な演習、実行結果の比較、解説、進捗管理を備えた **SQLite ベースの SQL 学習アプリ** として設計する。

## アプリの方向性

### 作りたいもの

ユーザーが SQL を書き、SQLite 上で実行し、期待結果と比較しながら SQL の基礎から応用まで学ぶアプリ。

主な体験は以下。

- Chapter ごとに SQL の概念を学ぶ
- 各 Lesson で課題文、使用テーブル、期待する出力を確認する
- SQL エディタにクエリを書く
- ブラウザ内 SQLite で実際に実行する
- 実行結果をテーブルで確認する
- 正解判定、ヒント、解説、模範解答を確認する
- 進捗を localStorage に保存する

### 作らないもの

MVP では以下は扱わない。

- ダンジョン、敵、HP、アイテムなどのゲーム要素
- ログイン、ランキング、マルチユーザー
- サーバー側 DB
- AI ヒント生成
- PostgreSQL / MySQL 方言の網羅
- 複雑な UPDATE / DELETE / トランザクション演習

## 現在の前提

このリポジトリは TanStack Start + React + TypeScript + Mantine の最小スターターに近い状態。

既存構成:

```txt
src/
  routes/
    __root.tsx
    index.tsx
  router.tsx
  routeTree.gen.ts
  styles.css
```

現時点ではトップページに `Hello World!` とボタンがあるだけなので、アプリ構造はこれから作りやすい。

## 技術スタック

### 既存

- TanStack Start
- React 19
- TypeScript
- TanStack Router
- Mantine v9
- Vite+

### 追加候補

- SQLite 実行
  - 第一候補: `sql.js`
  - 代替候補: SQLite 公式 WASM
- 教材データ配信
  - MVP: TypeScript の静的データ
  - 後続: TanStack Start の Server Functions / API から Lesson 定義と seed data を配信
- SQL エディタ
  - MVP: Mantine `Textarea`
  - 後続: CodeMirror
- テーブル表示
  - MVP: Mantine `Table`
  - 後続: TanStack Table
- バリデーション
  - 後続: Zod
- 永続化
  - MVP: localStorage
  - 後続: IndexedDB

## コアコンセプト

### Lesson

ゲームのステージではなく、SQL 学習単位として `Lesson` を中心にする。

```ts
export type Lesson = {
  id: string
  chapterId: string
  title: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedMinutes: number
  summary: string
  task: string
  schema: TableDefinition[]
  starterSql: string
  expectedResult: QueryResult
  compareMode: "ordered" | "unordered"
  allowedStatements: AllowedStatement[]
  hints: string[]
  solutionSql: string
  explanation: string
  tags: string[]
}
```

### Chapter

Chapter は学習ロードマップと一覧 UI のグルーピングに使う。

```ts
export type Chapter = {
  id: string
  title: string
  description: string
  order: number
  lessonIds: string[]
}
```

### TableDefinition

SQLite に投入する初期データを Lesson ごとに持つ。

```ts
export type TableDefinition = {
  name: string
  columns: ColumnDefinition[]
  rows: Record<string, SqlValue>[]
}

export type ColumnDefinition = {
  name: string
  type: "INTEGER" | "REAL" | "TEXT" | "BLOB" | "NULL"
  nullable?: boolean
}

export type SqlValue = string | number | boolean | null
```

### QueryResult

実行結果と期待結果は同じ形で扱う。

```ts
export type QueryResult = {
  columns: string[]
  rows: Record<string, SqlValue>[]
}
```

## ルーティング計画

TanStack Router の file-based routing を活かす。

```txt
/                         トップ / 学習開始
/lessons                  Lesson 一覧
/lessons/$lessonId        Lesson 実行画面
/lessons/$lessonId/result 結果と解説
/progress                 進捗一覧
/reference                SQLite 構文リファレンス
```

MVP では `/`, `/lessons`, `/lessons/$lessonId` の 3 つで十分。

## ディレクトリ構成案

```txt
src/
  routes/
    __root.tsx
    index.tsx
    lessons/
      index.tsx
      $lessonId.tsx
      $lessonId.result.tsx
    progress.tsx
    reference.tsx

  features/
    lessons/
      components/
        LessonList.tsx
        LessonWorkspace.tsx
        LessonHeader.tsx
        SchemaExplorer.tsx
        SqlEditor.tsx
        QueryResultTable.tsx
        HintPanel.tsx
        JudgePanel.tsx
      data/
        lessonSummaries.ts
      server/
        lessonRepository.ts
        lessonSeedData.ts
      types.ts
      utils/
        compareQueryResults.ts
        lessonLookup.ts

    sqlite/
      createLessonDatabase.ts
      executeSql.ts
      sqlSafety.ts
      sqliteTypes.ts

    progress/
      progressStorage.ts
      types.ts

  components/
    AppShellLayout.tsx
    EmptyState.tsx
    PageHeader.tsx
```

## 主要画面

### トップページ

目的は「何を学べるか」と「どこから始めるか」をすぐ示すこと。

表示内容:

- アプリ名: SQLite Lab
- 短い説明
- 学習開始ボタン
- 前回の続きボタン
- 学習範囲の概要
- 進捗サマリー

### Lesson 一覧

実務ツール寄りの落ち着いた UI にする。

表示内容:

- Chapter ごとの Lesson
- 難易度
- 所要時間
- 完了状態
- タグ
- フィルタ

Search Params:

```txt
/lessons?chapter=join&difficulty=intermediate&status=uncleared
```

### Lesson 実行画面

このアプリの中心画面。

推奨レイアウト:

```txt
----------------------------------------------------
[Lesson title]                         [完了状態]
課題文 / 学習ポイント
----------------------------------------------------

左: スキーマ・初期データ          右: SQL エディタ
  - テーブル一覧                     - starterSql
  - カラム定義                       - 実行ボタン
  - 初期データ                       - リセットボタン

下: 実行結果 / 判定 / ヒント / 解説
----------------------------------------------------
```

MVP では 1 カラムでもよいが、最終的にはデスクトップで左右分割、モバイルで縦積みにする。

### 結果ページ

Lesson クリア後の振り返り画面。

表示内容:

- 入力 SQL
- 実行結果
- 模範解答
- 解説
- 次の Lesson

MVP では結果ページは後回しにして、Lesson 詳細画面内に解説を表示してもよい。

## 学習ロードマップ

最初から高度な章を作りすぎず、SQLite で自然に学べる順に並べる。

### Chapter 1: SELECT 基礎

- `SELECT *`
- 必要な列だけ取得
- `WHERE`
- 比較演算子
- `AND` / `OR`
- `ORDER BY`
- `LIMIT`
- `LIKE`
- `IN`
- `BETWEEN`
- `IS NULL`

### Chapter 2: 集計

- `COUNT`
- `SUM`
- `AVG`
- `MIN` / `MAX`
- `GROUP BY`
- `HAVING`

### Chapter 3: JOIN

- `INNER JOIN`
- `LEFT JOIN`
- 複数テーブル JOIN
- JOIN 条件の考え方
- NULL と未関連データ

### Chapter 4: サブクエリ

- `IN`
- `EXISTS`
- スカラーサブクエリ
- 相関サブクエリ
- JOIN との書き換え

### Chapter 5: CTE

- `WITH`
- 複数 CTE
- CTE による読みやすさ改善
- 再帰 CTE は後続フェーズ

### Chapter 6: ウィンドウ関数

- `ROW_NUMBER`
- `RANK`
- `DENSE_RANK`
- `PARTITION BY`
- `LAG`
- `LEAD`
- 移動平均

### Chapter 7: 集合演算

- `UNION`
- `UNION ALL`
- `INTERSECT`
- `EXCEPT`

### Chapter 8: 実行計画とインデックス

- `EXPLAIN QUERY PLAN`
- `CREATE INDEX`
- 複合インデックス
- インデックスが使われにくい条件

この章は SQL 実行機能が安定してから追加する。

## MVP の Lesson 10 本

最初は EC サイト風の同一データセットを中心にする。毎回データの意味を覚え直さなくてよいので、SQL の学習に集中できる。

使用テーブル例:

- `customers`
- `orders`
- `order_items`
- `products`
- `categories`

初期 Lesson:

1. `customers` の全件を取得する
2. 顧客名とメールアドレスだけ取得する
3. 30 歳以上の顧客を取得する
4. 注文を金額の高い順に並べる
5. 直近 5 件の注文を取得する
6. 顧客ごとの注文数を集計する
7. 顧客ごとの合計注文金額を集計する
8. `customers` と `orders` を JOIN する
9. 注文していない顧客を `LEFT JOIN` で探す
10. `ROW_NUMBER` で顧客ごとの注文順を出す

## SQLite 実行設計

### 方針

MVP ではブラウザ内で SQLite を実行する。

- Lesson 開始時にインメモリ DB を作る
- Lesson の `schema` から `CREATE TABLE` を生成する
- rows から `INSERT` を実行する
- ユーザー SQL を実行する
- 結果を `QueryResult` に変換する
- `expectedResult` と比較する

### 実行フロー

```txt
1. /lessons/$lessonId を開く
2. Lesson 定義を取得
3. SQLite WASM を初期化
4. Lesson 用 DB を作成
5. テーブル作成と初期データ投入
6. ユーザーが SQL を実行
7. 結果を表示
8. 期待結果と比較
9. 正解なら進捗保存
```

## 元データ、配信、リセット設計

### 方針

最終的には、Lesson 定義、スキーマ、seed data、期待結果はサーバー側に正本として保持する。ブラウザ側の SQLite DB は、その正本データから作る一時的な作業コピーとして扱う。

これにより、ユーザーが `INSERT` / `UPDATE` / `DELETE` でデータを変更する演習をしても、いつでも元の状態へ戻せる。

MVP で静的 TypeScript データを使う場合も、全 Lesson / 全 seed data をクライアントバンドルへ入れないようにする。静的データはサーバー専用の repository から読み、クライアントには画面に必要な最小 payload だけを route loader / Server Functions / API 経由で渡す。

避ける実装:

```ts
// クライアントコンポーネントから全 Lesson を直接 import しない
import { lessons } from "../data/lessons"
```

推奨する実装:

```txt
/lessons
  -> 一覧表示に必要な LessonSummary[] だけ取得

/lessons/$lessonId
  -> 指定 lessonId の Lesson payload だけ取得
```

### データの責務分離

```txt
サーバー側
  - Lesson 定義
  - Chapter 定義
  - schema
  - seed data
  - expectedResult
  - solutionSql
  - explanation
  - 一覧用 LessonSummary

ブラウザ側
  - SQLite WASM
  - 現在開いている Lesson の作業 DB
  - 現在開いている Lesson の seed data
  - ユーザーが入力した SQL
  - 実行結果
  - localStorage の進捗
```

### Payload 分割

初期表示を重くしないため、データは用途ごとに分ける。

```ts
export type LessonSummary = {
  id: string
  chapterId: string
  title: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedMinutes: number
  summary: string
  tags: string[]
}

export type LessonPayload = {
  lesson: Lesson
  schema: TableDefinition[]
  seedVersion: string
}
```

`/lessons` は `LessonSummary[]` のみを取得する。`schema`、`seed data`、`expectedResult`、`solutionSql` は `/lessons/$lessonId` で該当 Lesson の分だけ取得する。

Lesson 数や seed data が増えてきたら、さらに seed data を別取得に分ける。

```txt
GET /api/lessons/:lessonId      Lesson 本体、schema、expectedResult
GET /api/lessons/:lessonId/seed seed data
```

### リセット方式

Lesson 画面では以下の操作を用意する。

- `SQL をリセット`: エディタ内容を `starterSql` に戻す
- `データをリセット`: 現在の SQLite DB を破棄し、サーバー由来の seed data から再作成する
- `Lesson を最初から`: SQL、実行結果、判定状態、作業 DB をすべて初期化する

MVP では TypeScript の静的 Lesson 定義を正本として扱い、後から同じ型のまま Server Functions / API に移せるようにする。

### 将来の API イメージ

```txt
GET /api/chapters
GET /api/lessons
GET /api/lessons/:lessonId
GET /api/lessons/:lessonId/seed
```

返却する Lesson payload はブラウザでそのまま SQLite 初期化に使える形にする。型は前述の `LessonSummary` / `LessonPayload` を使う。

`seedVersion` を持たせておくと、教材データを更新したときに localStorage 側の古い進捗や回答と区別しやすい。

### SQL の安全設計

MVP では SELECT 系だけを許可する。

許可:

- `SELECT`
- `WITH`

禁止:

- `DROP`
- `ALTER`
- `DELETE`
- `UPDATE`
- `INSERT`
- `CREATE`
- `PRAGMA`
- `ATTACH`
- `DETACH`
- `VACUUM`

ただし、将来的にインデックスやテーブル設計の章を追加するため、Lesson ごとに許可ステートメントを持たせる。

```ts
export type AllowedStatement =
  | "select"
  | "with"
  | "explain"
  | "create"
  | "insert"
  | "update"
  | "delete"
  | "transaction"
```

## 採点設計

最初は結果一致を重視する。

判定項目:

- SQL が安全ルールを満たす
- 実行エラーがない
- 列名が一致する
- 行数が一致する
- 値が一致する
- `compareMode` に応じて順序を比較する

比較モード:

- `ordered`: `ORDER BY` やランキング問題で使用
- `unordered`: 順序を問わない通常問題で使用

後続フェーズで追加したい判定:

- 期待する構文を使っているか
- 禁止した構文を使っていないか
- 模範解答との差分
- AST ベースのフィードバック

## 進捗保存

MVP は localStorage で十分。

```ts
export type Progress = {
  completedLessonIds: string[]
  lastOpenedLessonId?: string
  lastAnswersByLessonId: Record<string, string>
  bestRunsByLessonId: Record<
    string,
    {
      elapsedMs: number
      completedAt: string
    }
  >
}
```

## 実装フェーズ

### Phase 1: アプリの骨格

目的: TanStack Start 上で学習アプリとしてのページ構成を作る。

実装:

- トップページを SQLite Lab 用に置き換える
- `AppShellLayout` を作る
- `/lessons` を作る
- `/lessons/$lessonId` を作る
- Lesson / Chapter の型を作る
- 静的な Lesson 定義を 3 本作る
- 一覧用の `LessonSummary` と詳細用の `LessonPayload` を分ける
- 静的データをクライアントコンポーネントから直接 import しない構成にする
- SQL エディタは Mantine `Textarea` で作る
- 初期データは静的テーブルとして表示する

この時点では SQL 実行はまだ不要。

### Phase 2: SQLite 実行 MVP

目的: ユーザー SQL を実際に SQLite で実行できるようにする。

実装:

- Vite+ 経由で SQLite WASM ライブラリを追加する
- Lesson ごとのインメモリ DB 作成
- `CREATE TABLE` / `INSERT` 生成
- SELECT / WITH のみ実行許可
- 実行結果表示
- SQL エラー表示

### Phase 3: 採点と進捗

目的: 学習アプリとして成立する状態にする。

実装:

- `compareQueryResults`
- ordered / unordered 比較
- 正解 / 不正解パネル
- localStorage 進捗保存
- 最後に開いた Lesson の復元
- Lesson 一覧の完了状態表示

### Phase 4: 教材としての品質向上

目的: 単なる SQL 実行画面ではなく、学習しやすい教材にする。

実装:

- ヒントの段階表示
- 模範解答
- 解説
- Lesson タグ
- Chapter フィルタ
- 難易度フィルタ
- Search Params による一覧状態の URL 保存

### Phase 5: UI とエディタ改善

目的: 継続利用しやすい操作感にする。

実装:

- CodeMirror 導入
- SQL シンタックスハイライト
- 実行ショートカット
- スキーマパネル改善
- 結果テーブルの横スクロール
- モバイル対応

### Phase 6: 応用章の追加

目的: SQLite で学べる範囲を広げる。

実装:

- CTE
- ウィンドウ関数
- 集合演算
- `EXPLAIN QUERY PLAN`
- インデックス演習

### Phase 7: サーバー正本データ化

目的: 教材データをサーバー側に寄せ、ブラウザ SQLite をリセット可能な作業コピーとして扱えるようにする。

実装:

- Lesson / Chapter / seed data をサーバー側から取得する
- TanStack Start の Server Functions または API route で Lesson payload を返す
- `seedVersion` を導入する
- `データをリセット` 操作を実装する
- UPDATE / INSERT / DELETE を使う専用 Lesson を追加できるようにする

### Phase 8: AI 質問機能

目的: ユーザーが詰まったときに、現在の Lesson と入力 SQL を前提に質問できるようにする。

実装:

- Lesson 文脈、schema、seed data の概要、ユーザー SQL、実行エラーを AI へ渡す
- 直接答えを出すモードではなく、ヒント優先の回答にする
- 「なぜエラーになるか」「どこを見直すべきか」「この構文は何か」を質問できる UI を作る
- API キーやモデル呼び出しはサーバー側に閉じる

### Phase 9: ダンジョン要素の再導入

目的: 教材としての土台を保ったまま、継続学習の動機づけとしてゲーム要素を追加する。

実装:

- Chapter をエリア、Lesson を部屋として表現する
- 完了状態に応じてマップを開放する
- バッジ、称号、連続学習など軽い達成要素を追加する
- SQL 実行、採点、リセット、解説の本体ロジックには依存させない

## 最初の実装タスク

現在の TanStack Start アプリから始めるなら、最初の PR / 作業単位は以下がよい。

1. `Hello World!` のトップページを SQLite Lab 用に置き換える
2. `features/lessons` に型と静的データを作る
3. `/lessons` に Lesson 一覧を作る
4. `/lessons/$lessonId` に Lesson 詳細を作る
5. 初期テーブル、課題文、SQL 入力欄を表示する
6. SQL 実行ボタンはまだモックにする
7. `vp check` が通る状態にする

この順番なら、SQLite WASM 導入前でもアプリの体験を確認できる。

## MVP 完了条件

MVP は「SQLite で SQL を実行して採点できる」状態とする。

- `/lessons` で Lesson 一覧が見える
- `/lessons/$lessonId` で課題が見える
- テーブル定義と初期データが見える
- SQL を入力できる
- SQLite 上で SQL を実行できる
- 実行結果がテーブル表示される
- 期待結果と比較して正解判定できる
- ヒントと解説が見える
- 完了状態が localStorage に保存される
- 最低 10 Lesson ある
- `vp check` が通る

## 後回しにするもの

- サーバー永続化
- ユーザーアカウント
- ランキング
- AI 質問 / AI フィードバック
- ダンジョン UI
- Lesson 作成 UI
- PostgreSQL / MySQL モード
- PWA
- IndexedDB 移行

## 判断メモ

### なぜダンジョン要素を外すか

SQL 学習アプリとしての価値は、課題、実行、結果確認、解説、進捗にある。ゲーム要素は初期実装の状態管理と UI を複雑にしやすく、TanStack Start と SQLite 実行の学習目的からも外れやすい。

まずは教材として強い土台を作り、必要なら後から達成バッジや連続学習など軽いゲーミフィケーションを追加する方がよい。

ダンジョン要素は捨てるのではなく、後から載せるプレゼンテーション層として扱う。Lesson、Chapter、進捗、採点のドメインを先に安定させておけば、Chapter をエリア、Lesson を部屋、完了状態を踏破状況として自然にマッピングできる。

### なぜ SQLite から始めるか

ブラウザ内で完結でき、サーバー構築なしで実行体験を作れるため。SQL の基礎、集計、JOIN、サブクエリ、CTE、ウィンドウ関数、実行計画まで扱えるので、学習アプリの MVP には十分。

ただし、教材の正本データまでブラウザだけに閉じる必要はない。最終形ではサーバー側が Lesson と seed data の正本を保持し、ブラウザ SQLite は毎回作り直せる作業 DB として扱うのがよい。この分離により、ユーザーがデータを変更する演習も安全に追加できる。

### なぜ最初は textarea でよいか

最初に検証すべきなのはエディタ体験ではなく、Lesson 定義、SQLite 実行、採点、進捗保存の流れ。CodeMirror は後から差し替えやすい位置に `SqlEditor` コンポーネントを切っておけばよい。
