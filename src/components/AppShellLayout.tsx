import { AppShell, Anchor, Box, Container, Group, Text } from "@mantine/core";
import { Link, Outlet } from "@tanstack/react-router";

export function AppShellLayout() {
  return (
    <AppShell header={{ height: 64 }} padding={0}>
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Group h="100%" justify="space-between">
            <Anchor component={Link} to="/" underline="never" c="dark">
              <Text fw={700} size="lg">
                SQLite Lab
              </Text>
            </Anchor>
            <Group gap="lg">
              <Anchor component={Link} to="/lessons" c="dimmed" size="sm">
                Lessons
              </Anchor>
              <Anchor component={Link} to="/progress" c="dimmed" size="sm">
                Progress
              </Anchor>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <Box className="app-main">
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
