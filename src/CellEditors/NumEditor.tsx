import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Input,
  makeStyles,
  shorthands,
  Text,
} from "@fluentui/react-components";
import { ICellEditorParams } from "ag-grid-community";
import App from "./App.css";

const KEY_BACKSPACE = "Backspace";
const KEY_F2 = "F2";
const KEY_ENTER = "Enter";
const KEY_TAB = "Tab";
const KEY_ARROW_LEFT = "ArrowLeft";
const KEY_ARROW_RIGHT = "ArrowRight";

const useStyles = makeStyles({
  numericEditor: {
    width: "100%",
    height: "90%",
  },
});

export default forwardRef(function NumEditor(props: ICellEditorParams, ref) {
  const createInitialState = () => {
    let startValue;
    let highlightAllOnFocus = true;

    if (props.eventKey === KEY_BACKSPACE) startValue = "";
    else if (props.charPress) startValue = props.charPress;
    else {
      startValue = props.value;
      if (props.eventKey === KEY_F2) {
        highlightAllOnFocus = false;
      }
    }

    return {
      value: startValue,
      highlightAllOnFocus,
    };
  };

  const styles = useStyles();
  const initialState = createInitialState();
  const [value, setValue] = useState(initialState.value);
  const [highlightAllOnFocus, setHighlightAllOnFocus] = useState(
    initialState.highlightAllOnFocus
  );

  const refInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // if (refInput.current){
    const eInput = refInput.current!; // ! eliminates render check on as we already know everything has been rendered
    eInput.focus();

    if (highlightAllOnFocus) eInput.select();
  }, []);

  /* Utility Methods */
  const cancelBeforeStart =
    props.charPress && "1234567890".indexOf(props.charPress) < 0;

  const isLeftOrRight = (event: any) => {
    return [KEY_ARROW_LEFT, KEY_ARROW_RIGHT].indexOf(event.key) > -1;
  };

  const isCharNumeric = (charStr: string) => {
    return /\d/.test(charStr);
  };

  const isKeyPressedNumeric = (event: any) => {
    const charStr = event.key;
    return isCharNumeric(charStr);
  };

  const isBackspace = (event: any) => {
    return event.key === KEY_BACKSPACE;
  };

  const finishedEditingPressed = (event: any) => {
    const key = event.key;
    return key === KEY_ENTER || key === KEY_TAB;
  };

  const onKeyDown = (event: any) => {
    if (isLeftOrRight(event) || isBackspace(event)) {
      event.stopPropagation();
      return;
    }

    if (!finishedEditingPressed(event) && !isKeyPressedNumeric(event)) {
      if (event.preventDefault) event.preventDefault();
    }

    if (finishedEditingPressed(event)) {
      props.stopEditing();
    }
  };
  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      getValue(): number {
        return value;
      },
      isCancelBeforeStart() {
        return cancelBeforeStart;
      },
      isCancelAfterEnd() {
        return value > 100000000;
      },
    };
  });

  return (
    <Input
      className={styles.numericEditor}
      appearance="underline"
      contentBefore={<Text size={300}>£</Text>}
      ref={refInput}
      value={value}
      onKeyDown={(event) => onKeyDown(event)}
      onChange={(event) => setValue(event.target.value)}
    />
  );
});
