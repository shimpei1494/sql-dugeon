import { Badge, Button, Container, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <Container size="xl" py={64}>
      <Stack gap={48}>
        <Stack gap="lg" maw={760}>
          <Badge color="teal" variant="light" w="fit-content">
            Browser SQLite Learning
          </Badge>
          <Title order={1} className="hero-title">
            SQLite で SQL の基礎を実行しながら学ぶ
          </Title>
          <Text size="lg" c="dimmed">
            Lesson ごとのデータセットを開き、SQL を書いて結果を確認する学習アプリです。まずは SELECT
            基礎の画面構成から作っています。
          </Text>
          <Group>
            <Button component={Link} to="/lessons" size="md">
              Lesson を始める
            </Button>
          </Group>
        </Stack>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
          {[
            [
              "軽い一覧",
              "Lesson 一覧では summary だけを読み込み、詳細データは開いた Lesson ごとに取得します。",
            ],
            ["作業 DB", "SQLite WASM 導入後は、Lesson ごとにブラウザ内の一時 DB を作ります。"],
            ["拡張前提", "採点、AI 質問、ダンジョン表示は後続フェーズで段階的に追加します。"],
          ].map(([title, description]) => (
            <Stack key={title} gap={6} className="feature-panel">
              <Title order={2} size="h4">
                {title}
              </Title>
              <Text size="sm" c="dimmed">
                {description}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
