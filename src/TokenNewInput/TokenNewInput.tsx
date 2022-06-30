import classes from './../styles.module.css'
import React, { useEffect, useImperativeHandle, useRef } from 'react'

import Utils from '../Utils/Utils'
import { InputRef } from '../TokenField/TokenField'
import {
  DelimiterActions,
  FocusMovement,
  TokenProps
} from '../TokensReducer/TokensReducer'

export interface NewTokenProps {
  placeholder: string
  hideRemoveButton: boolean | undefined
  onInput: (value: string) => void
}

const TokenNewInput = React.forwardRef<
  InputRef,
  NewTokenProps & TokenProps & DelimiterActions
>(
  (
    {
      state,
      placeholder,
      addToken,
      hideRemoveButton,
      deleteLast,
      selectToken,
      allTokenAreSelected,
      containDelimiter,
      parseToken,
      focusLast,
      deleteSelected,
      onInput
    },
    ref
  ): React.ReactElement => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const spanRef = useRef<HTMLSpanElement | null>(null)
    useEffect(() => {
      updateSpanText()
    })

    function updateSpanText() {
      spanRef.current!.innerText =
        inputRef.current!.value || (state.tokens.length ? '_' : placeholder)
    }

    function keyDown(event: React.KeyboardEvent) {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        if (
          allTokenAreSelected() &&
          Utils.inputTextFullSelection(inputRef.current)
        ) {
          deleteSelected()
          inputRef.current!.value = ''
        } else if (Utils.inputCaretStart(inputRef.current)) {
          deleteLast()
        }
      } else if (containDelimiter(event.key)) {
        viewMode(event)
      } else if (
        (event.key === 'ArrowLeft' &&
          Utils.inputCaretStart(inputRef.current)) ||
        (event.shiftKey && event.key === 'Tab')
      ) {
        focusLast()
        event.preventDefault()
      } else if (
        !event.metaKey &&
        !event.ctrlKey &&
        Utils.inputTextFullSelection(inputRef.current)
      ) {
        selectToken([], false)
      }
    }

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
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

    function viewMode(e: React.SyntheticEvent, focus: FocusMovement = 'self') {
      const text = inputRef.current!.value.trim()
      inputRef.current!.value = ''
      if (focus === 'self' && !text) {
        return
      }
      addToken(parseToken(text), focus)
      e.preventDefault()
    }

    function onPaste() {
      setTimeout(() => {
        addToken(parseToken(inputRef.current!.value), 'self')
        inputRef.current!.value = ''
      }, 0)
    }

    function onInputText() {
      updateSpanText()
      onInput(inputRef.current!.value || '')
    }

    return (
      <span className={classes.token}>
        <input
          placeholder={state.tokens.length === 0 ? placeholder : ''}
          className={classes.input}
          ref={inputRef}
          onInput={(_) => onInputText()}
          onKeyDown={(e) => keyDown(e)}
          onPaste={() => onPaste()}
          type='text'
        />
        <span style={{ visibility: 'hidden' }} className={classes.tag}>
          <span className={classes.value} ref={spanRef} />
          {hideRemoveButton ? <span className={classes.remove} /> : null}
        </span>
      </span>
    )
  }
)

export default TokenNewInput
