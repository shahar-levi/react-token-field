import { Token } from "../Token/Token";
import TokenInput from "../TokenInput/TokenInput";
import { TokenState, useTokens } from "../TokensReducer/TokensReducer";
import TokenNewInput from "../TokenNewInput/TokenNewInput";
import React, { useEffect, useRef, useState } from "react";
import classes from "./../styles.module.css";
import {
  getTokenFieldCSS,
  TokenCSS,
  TokenFieldCSS
} from "../Styles/Token.style";
import OptionsMenu, { OptionsRef } from "./OptionsMenu";

export interface InputRef {
  focus: () => void;
  value: () => string | undefined;
  clear: () => void;
  position: () => { left: number; top: number };
}

export interface NewInputRef extends InputRef {
  selectText: () => void;
}

export type Details = { tokens: string[]; valid?: string[]; invalid?: string[] }
const TokenField = ({
                      tokens = [],
                      delimiters = " ",
                      placeholder = "",
                      pattern = "",
                      tokenFieldCSS,
                      getTokenCSS,
                      onChange,
                      options,
                      renderToken,
                      showRemoveButton,
                      autoFocus = true,
                      readonly = false
                    }: {
  tokens?: string[]
  pattern?: string
  placeholder?: string
  delimiters?: string
  readonly?: boolean
  showRemoveButton?: boolean
  tokenFieldCSS?: TokenFieldCSS
  getTokenCSS?: (state: TokenState) => TokenCSS
  onChange?: (details: Details) => void
  autoFocus?: boolean
  options?: {
    render?: (value: string) => React.ReactElement
    selectedClassName?: string
  }
  renderToken?: (state: TokenState) => React.ReactNode
}) => {
  const tokenProps = useTokens(tokens, pattern, readonly, getTokenCSS);
  const {
    state,
    isValid,
    focusNew,
    selectAll,
    addToken,
    updateToken,
    deleteSelected,
    getSelectedTokenText
  } = tokenProps;
  const focusRefs = useRef<InputRef[]>([]);
  const newTokenRef = useRef<NewInputRef | null>(null);
  const tokenFieldRef = useRef<HTMLDivElement | null>(null);
  const controlRef = useRef<HTMLDivElement | null>(null);
  const optionsRef = useRef<OptionsRef | null>(null);
  const [candidateValue, setCandidateValue] = useState("");
  const [position, setPosition] = useState<null | {
    left: number
    top: number
  }>(null);
  useEffect(() => {
    if (state.focusIndex !== -2) {
      if (state.focusIndex !== -1) {
        try {
          focusRefs.current[state.focusIndex].focus();
        } catch (e) {
          console.error(e);
        }
      } else {
        if (!readonly && (autoFocus || state.lastActionTime)) {
          newTokenRef.current!.focus();
        }
      }
    }
  }, [state.lastActionTime, state.focusIndex]);

  useEffect(() => {
    setCandidateValue(() => "");
    updateOptionsPosition();
  }, [state.editIndex, state.focusIndex, state.tokens]);

  useEffect(() => {
    if (onChange) {
      const details: Details = { tokens: state.tokens, valid: [], invalid: [] };
      state.tokens.forEach((text) => {
        const valid: boolean = isValid(text);
        if (valid) {
          details.valid!.push(text);
        } else {
          details.invalid!.push(text);
        }
      });
      updateOptionsPosition();
      onChange(details);
    }
  }, [state.tokens]);

  function updateOptionsPosition() {
    if (state.editIndex === -1) {
      setPosition(newTokenRef.current!.position());
    } else if (state.editIndex > -1) {
      setPosition(focusRefs.current[state.editIndex].position());
    }
  }

  function getTokenElement(token: string, index: number) {
    return (
      <Token
        {...tokenProps}
        text={token}
        renderToken={renderToken}
        hideRemoveButton={!showRemoveButton}
        ref={(el) => addRef(el, index)}
        selected={state.selectedIndexes.includes(index)}
        index={index}
        key={"token_" + index}
      />
    );
  }

  function containDelimiter(key: string): boolean {
    return delimiters.includes(key);
  }

  function parseToken(token: string): string[] {
    const newTokens: string[] = [];
    const rawText: string = token.trim();
    const sep: string = `[ֿֿֿֿֿ\\n\\${delimiters}]+`;
    const tokensValue: string[] = rawText.split(new RegExp(sep));
    for (const tokenValue of tokensValue) {
      if (tokenValue.trim()) {
        newTokens.push(tokenValue);
      }
    }
    return newTokens;
  }

  function addRef(ref: InputRef | null, index: number) {
    if (ref) {
      focusRefs.current[index] = ref;
    }
  }

  function onInput(value: string) {
    setCandidateValue(value);
    updateOptionsPosition();
  }

  function getTokenInputElement(token: string, index: number) {
    return (
      <TokenInput
        {...tokenProps}
        text={token}
        onInput={(val) => onInput(val)}
        ref={(el) => addRef(el, index)}
        index={index}
        isFocusOnOptions={isFocusOptions}
        hideRemoveButton={!showRemoveButton}
        containDelimiter={(key) => containDelimiter(key)}
        parseToken={(token) => parseToken(token)}
        selected={state.selectedIndexes.includes(index)}
        key={"token_input_" + index}
      />
    );
  }

  function getTokenNewInputElement() {
    if (!readonly) {
      return (
        <TokenNewInput
          onInput={(val) => onInput(val)}
          placeholder={placeholder}
          hideRemoveButton={!showRemoveButton}
          ref={newTokenRef}
          {...tokenProps}
          containDelimiter={(key) => containDelimiter(key)}
          parseToken={(token) => parseToken(token)}
          key="token_input_new"
        />
      );
    } else {
      return <span />;
    }
  }

  function onFocus(e: React.FocusEvent) {
    if (e.target === tokenFieldRef.current) {
      focusNew();
    }
  }

  function isFocusOptions(e: React.FocusEvent) {
    if (!e.relatedTarget || !optionsRef?.current) {
      return false;
    }
    return optionsRef.current.isChildOf(e.relatedTarget);
  }

  function onBlur(e: React.FocusEvent) {
    const value = newTokenRef.current?.value();

    if (value && !isFocusOptions(e)) {
      newTokenRef.current!.clear();
      addToken(parseToken(value), "self");
    }
  }

  function onKeyDown(event: React.KeyboardEvent) {
    const cmdPressed: boolean = navigator.userAgent.indexOf("Mac")
      ? event.metaKey
      : event.ctrlKey;
    if (event.key === "Enter" || event.key === "Tab") {
      if (state.editIndex === -1) {
        const value: string | undefined =
          optionsRef.current?.value() || newTokenRef.current?.value();
        if (value) {
          newTokenRef.current?.clear();
          addToken([value], "self");
        }
      } else if (state.editIndex > -1 && state.editIndex === state.focusIndex) {
        const value: string | undefined =
          optionsRef.current?.value() ||
          focusRefs.current[state.editIndex].value();
        if (value) {
          updateToken(state.editIndex, [value], "self");
        }
      }
    }

    if (event.nativeEvent.code === "ArrowDown") {
      optionsRef.current?.next();
    }
    if (event.nativeEvent.code === "ArrowUp") {
      optionsRef.current?.back();
    }
    if (cmdPressed && event.nativeEvent.code === "KeyA") {
      selectAll();
      newTokenRef.current!.selectText();
      event.preventDefault();
    } else if (cmdPressed && event.nativeEvent.code === "KeyC") {
      copyToken(
        [...getSelectedTokenText(), newTokenRef.current?.value()]
          .filter((str) => str?.trim())
          .join(delimiters[0])
      );
      focusNew();
      event.preventDefault();
    } else if (cmdPressed && event.key === "KeyX") {
      const value: string = newTokenRef.current?.value() || "";
      newTokenRef.current!.clear();
      copyToken([...getSelectedTokenText(), value].join(delimiters[0]));
      deleteSelected();
      event.preventDefault();
    }
  }

  function copyToken(val: string) {
    const selBox = document.createElement("textarea");
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.style.position = "fixed";
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document["execCommand"]("copy");
    document.body.removeChild(selBox);
  }

  function onOptionSelected(value: string) {
    if (state.editIndex === -1) {
      newTokenRef.current?.clear();
      addToken([value], "next");
    } else {
      updateToken(state.editIndex, [value], "self");
    }
  }

  return (
    <div
      ref={controlRef}
      onScroll={() => updateOptionsPosition()}
      className={classes.reactTokenField}
    >
      <div
        className={classes.tokens}
        style={getTokenFieldCSS(tokenFieldCSS)}
        onKeyDown={(e) => onKeyDown(e)}
        tabIndex={-1}
        ref={tokenFieldRef}
        onFocus={(e) => onFocus(e)}
        onBlur={(e) => onBlur(e)}
      >
        {state.tokens.map((token, index) =>
          index === state.editIndex && !readonly
            ? getTokenInputElement(token, index)
            : getTokenElement(token, index)
        )}
        {getTokenNewInputElement()}
      </div>
      <OptionsMenu
        renderOptions={options?.render}
        ref={optionsRef}
        selectedClassName={options?.selectedClassName}
        position={position}
        onSelectedValue={onOptionSelected}
        value={candidateValue}
      />
    </div>
  );
};
export default TokenField;
