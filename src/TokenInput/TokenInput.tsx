import classes from './../styles.module.css'
import React, { useImperativeHandle, useRef } from 'react'

import { InputRef } from '../TokenField/TokenField'
import Utils from '../Utils/Utils'
import {
  DelimiterActions,
  FocusMovement,
  TokenProps
} from '../TokensReducer/TokensReducer'

export interface TokenAdditionalProps {
  index: number
  text: string
  selected: boolean
  hideRemoveButton: boolean | undefined
  onInput: (value: string) => void
  isFocusOnOptions: (e: React.FocusEvent) => boolean
}

const TokenInput = React.forwardRef<
  InputRef,
  TokenProps & TokenAdditionalProps & DelimiterActions
>(
  (
    {
      index,
      text,
      updateToken,
      deleteToken,
      parseToken,
      onInput,
      isFocusOnOptions,
      containDelimiter,
      hideRemoveButton
    },
    ref
  ): React.ReactElement => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const spanRef = useRef<HTMLSpanElement | null>(null)
    useImperativeHandle(ref, () => ({
      focus,
      value: () => inputRef.current?.value,
      clear: () => (inputRef.current!.value = ''),
      selectText: () => inputRef.current!.select(),
      position: () => ({
        top: inputRef.current
          ? inputRef.current.getBoundingClientRect().top +
          inputRef.current.getBoundingClientRect().height
          : 0,
        left: inputRef.current?.getBoundingClientRect().left || 0
      })
    }))

    function focus() {
      inputRef.current!.focus()
    }

    function updateSpanText() {
      spanRef.current!.innerText = inputRef.current!.value || '_'
    }

    function keyDown(event: React.KeyboardEvent) {
      if (containDelimiter(event.key)) {
        view('self')
        event.preventDefault()
        event.stopPropagation()
      } else if (event.key === 'Backspace' && !inputRef.current!.value) {
        deleteToken([index])
        event.preventDefault()
      } else if (
        event.key === 'ArrowLeft' &&
        Utils.inputCaretStart(inputRef.current)
      ) {
        view('back')
        event.preventDefault()
      } else if (
        event.key === 'ArrowRight' &&
        Utils.inputCaretEnd(inputRef.current)
      ) {
        view('next')
        event.preventDefault()
      }
    }

    function view(focus: FocusMovement) {
      applyToken(inputRef.current!.value, focus)
    }

    function applyToken(text: string, focus: FocusMovement) {
      if (text) {
        updateToken(index, parseToken(text), focus)
      } else {
        deleteToken([index])
      }
    }

    function onPaste() {
      setTimeout(() => {
        view('self')
      }, 0)
    }

    function onBlur(e: React.FocusEvent) {
      if (!isFocusOnOptions(e)) {
        const text: string = (e.nativeEvent.target as HTMLInputElement)!.value
        setTimeout(() => {
          applyToken(text, 'self')
        }, 0)
      }
    }

    function onInputText() {
      updateSpanText()
      onInput(inputRef.current!.value || '')
    }
    return (
      <span className={classes.token}>
        <input
          className={classes.input}
          ref={inputRef}
          onPaste={() => onPaste()}
          onInput={(_) => onInputText()}
          onKeyDown={(e) => keyDown(e)}
          defaultValue={text}
          onBlur={(e) => onBlur(e)}
          type='text'
        />
        <span style={{ visibility: 'hidden' }} className={classes.tag}>
          <span className={classes.value} ref={spanRef}>
            {text}
          </span>
          {hideRemoveButton ? (
            <span
              onClick={() => deleteToken([index])}
              className={classes.remove}
            />
          ) : null}
        </span>
      </span>
    )
  }
)

export default TokenInput
