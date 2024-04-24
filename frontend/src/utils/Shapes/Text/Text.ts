import { EditorSt } from "./EditableText";
import {
  InitShapeFunction,
  ToolConfig,
  UpdateShapeFunction,
} from "../ShapeTypes";
import { TextConfig } from "konva/lib/shapes/Text";

const initText: InitShapeFunction<TextConfig> = ({ color, pos, size }) => {
  return { ...pos, fill: color, fontSize: size };
};

const updateText: UpdateShapeFunction<TextConfig> = (shape, pos) => {
  return {
    ...shape,
    width: pos.x - (shape.x || 0),
    height: pos.y - (shape.y || 0),
  };
};

const text: ToolConfig<TextConfig> = {
  init: initText,
  update: updateText,
  component: EditorSt,
};

export const name = "text";
export default text;
