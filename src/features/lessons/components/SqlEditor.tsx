import { Button, Group, Textarea } from "@mantine/core";

type SqlEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
};

export function SqlEditor({ value, onChange, onReset }: SqlEditorProps) {
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
        <Button disabled>実行は次のフェーズで追加</Button>
      </Group>
    </>
  );
}
