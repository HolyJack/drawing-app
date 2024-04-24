import Konva from "konva";
import { forwardRef, useRef, useState } from "react";
import { Group, Text } from "react-konva";
import TextArea from "./TextArea";
import { TextConfig } from "konva/lib/shapes/Text";

interface EditorStProps extends TextConfig {
  onChange: () => void;
}

export const EditorSt = forwardRef((props: EditorStProps) => {
  const { text, onChange, ...rest } = props;
  const [editorEnabled, setEditorEnabled] = useState(false);
  const textRef = useRef<Konva.Text>(null);

  return (
    <Group draggable>
      <Text
        text={text}
        ref={textRef}
        width={100}
        onClick={() => {
          setEditorEnabled(true);
        }}
        visible={!editorEnabled}
        {...rest}
      />
      {editorEnabled && (
        <Group>
          <TextArea
            value={text}
            textNodeRef={textRef}
            onChange={onChange}
            onBlur={() => {
              setEditorEnabled(false);
            }}
          />
        </Group>
      )}
    </Group>
  );
});
