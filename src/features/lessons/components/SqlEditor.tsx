import { Button, Group, Textarea } from "@mantine/core";

type SqlEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
  onRun: () => void;
  isRunning: boolean;
};

export function SqlEditor({ value, onChange, onReset, onRun, isRunning }: SqlEditorProps) {
  return (
    <>
      <Textarea
        aria-label="SQL editor"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        minRows={10}
        autosize
        classNames={{ input: "sql-editor" }}
      />
      <Group justify="space-between" mt="md">
        <Button variant="default" onClick={onReset}>
          SQL をリセット
        </Button>
        <Button onClick={onRun} loading={isRunning}>
          SQL を実行
        </Button>
      </Group>
    </>
  );
}
