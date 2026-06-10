import { SQLite, sql } from "@codemirror/lang-sql";
import { Box, Button, Group, Kbd, Text } from "@mantine/core";
import CodeMirror, { keymap, Prec } from "@uiw/react-codemirror";
import { useEffect, useMemo, useRef } from "react";

import type { TableDefinition } from "../types";

type SqlEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
  onRun: () => void;
  isRunning: boolean;
  tables: TableDefinition[];
};

export function SqlEditor({ value, onChange, onReset, onRun, isRunning, tables }: SqlEditorProps) {
  const onRunRef = useRef(onRun);

  useEffect(() => {
    onRunRef.current = onRun;
  });

  const extensions = useMemo(() => {
    const schema = Object.fromEntries(
      tables.map((table) => [table.name, table.columns.map((column) => column.name)]),
    );

    return [
      sql({ dialect: SQLite, schema, upperCaseKeywords: true }),
      Prec.highest(
        keymap.of([
          {
            key: "Mod-Enter",
            run: () => {
              onRunRef.current();
              return true;
            },
          },
        ]),
      ),
    ];
  }, [tables]);

  return (
    <>
      <Box className="sql-editor-frame">
        <CodeMirror
          value={value}
          onChange={onChange}
          extensions={extensions}
          minHeight="220px"
          aria-label="SQL editor"
          basicSetup={{
            foldGutter: false,
            autocompletion: true,
            highlightActiveLine: true,
          }}
        />
      </Box>
      <Group justify="space-between" mt="md">
        <Button variant="default" onClick={onReset}>
          SQL をリセット
        </Button>
        <Group gap="sm">
          <Text size="xs" c="dimmed">
            <Kbd>Ctrl</Kbd> / <Kbd>⌘</Kbd> + <Kbd>Enter</Kbd> で実行
          </Text>
          <Button onClick={onRun} loading={isRunning}>
            SQL を実行
          </Button>
        </Group>
      </Group>
    </>
  );
}
