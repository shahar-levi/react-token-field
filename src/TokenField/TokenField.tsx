import { Token } from '../Token/Token'
import TokenInput from '../TokenInput/TokenInput'
import { TokenState, useTokens } from '../TokensReducer/TokensReducer'
import TokenNewInput from '../TokenNewInput/TokenNewInput'
import React, { useEffect, useRef } from 'react'
import classes from './../styles.module.css'
import {
  getTokenFieldCSS,
  TokenCSS,
  TokenFieldCSS
} from '../Styles/Token.style'

export interface FocusRef {
  focus: () => void
}

export interface NewInputRef extends FocusRef {
  value: () => string
  clear: () => void
  selectText: () => void
}

export type Details = { tokens: string[]; valid?: string[]; invalid?: string[] }
const TokenField = ({
  tokens = [],
  delimiters = ' ',
  placeholder = '',
  pattern = '',
  readonly = false,
  showRemoveButton = true,
  tokenFieldCSS,
  getTokenCSS,
  onChange,
  autoFocus = true
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
}) => {
  const tokenProps = useTokens(tokens, pattern, readonly, getTokenCSS)
  const {
    state,
    isValid,
    focusNew,
    selectAll,
    addToken,
    deleteSelected,
    getSelectedTokenText
  } = tokenProps
  const focusRefs = useRef<FocusRef[]>([])
  const newTokenRef = useRef<NewInputRef | null>(null)
  const tokenFieldRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (state.focusIndex !== -2) {
      if (state.focusIndex !== -1) {
        try {
          focusRefs.current[state.focusIndex].focus()
        } catch (e) {
          console.error(e)
        }
      } else {
        if (!readonly && (autoFocus || state.lastActionTime)) {
          newTokenRef.current!.focus()
        }
      }
    }
  }, [state.lastActionTime, state.focusIndex])

  useEffect(() => {
    if (onChange) {
      const details: Details = { tokens: state.tokens, valid: [], invalid: [] }
      state.tokens.forEach((text) => {
        const valid: boolean = isValid(text)
        if (valid) {
          details.valid!.push(text)
        } else {
          details.invalid!.push(text)
        }
      })

      onChange(details)
    }
  }, [state.tokens])

  function getTokenElement(token: string, index: number) {
    return (
      <Token
        {...tokenProps}
        text={token}
        hideRemoveButton={showRemoveButton}
        ref={(el) => addRef(el, index)}
        selected={state.selectedIndexes.includes(index)}
        index={index}
        key={'token_' + index}
      />
    )
  }

  function containDelimiter(key: string): boolean {
    return delimiters.includes(key)
  }

  function parseToken(token: string): string[] {
    const newTokens: string[] = []
    const rawText: string = token.trim()
    const sep: string = `[ֿֿֿֿֿ\\n\\${delimiters}]+`
    const tokensValue: string[] = rawText.split(new RegExp(sep))
    for (const tokenValue of tokensValue) {
      if (tokenValue.trim()) {
        newTokens.push(tokenValue)
      }
    }
    return newTokens
  }

  function addRef(ref: FocusRef | null, index: number) {
    if (ref) {
      focusRefs.current[index] = ref
    }
  }

  function getTokenInputElement(token: string, index: number) {
    return (
      <TokenInput
        {...tokenProps}
        text={token}
        ref={(el) => addRef(el, index)}
        index={index}
        hideRemoveButton={showRemoveButton}
        containDelimiter={(key) => containDelimiter(key)}
        parseToken={(token) => parseToken(token)}
        selected={state.selectedIndexes.includes(index)}
        key={'token_input_' + index}
      />
    )
  }

  function getTokenNewInputElement() {
    if (!readonly) {
      return (
        <TokenNewInput
          placeholder={placeholder}
          hideRemoveButton={showRemoveButton}
          ref={newTokenRef}
          {...tokenProps}
          containDelimiter={(key) => containDelimiter(key)}
          parseToken={(token) => parseToken(token)}
        />
      )
    } else {
      return <span />
    }
  }

  function onFocus(e: React.FocusEvent) {
    if (e.target === tokenFieldRef.current) {
      focusNew()
    }
  }

  function onBlur(e: React.FocusEvent) {
    const value = newTokenRef.current?.value()
    const focusElement = e.relatedTarget?.closest(
      `.${tokenFieldRef.current!.className}`
    )
    if (value && focusElement !== tokenFieldRef.current) {
      newTokenRef.current!.clear()
      addToken(parseToken(value), 'none')
    }
  }

  function onKeyDown(event: React.KeyboardEvent) {
    const cmdPressed: boolean = navigator.userAgent.indexOf('Mac')
      ? event.metaKey
      : event.ctrlKey
    if (cmdPressed && event.nativeEvent.code === 'KeyA') {
      selectAll()
      newTokenRef.current!.selectText()
      event.preventDefault()
    } else if (cmdPressed && event.nativeEvent.code === 'KeyC') {
      copyToken(
        [...getSelectedTokenText(), newTokenRef.current?.value()].join(
          delimiters[0]
        )
      )
      focusNew()
      event.preventDefault()
    } else if (cmdPressed && event.key === 'KeyX') {
      const value: string = newTokenRef.current?.value() || ''
      newTokenRef.current!.clear()
      copyToken([...getSelectedTokenText(), value].join(delimiters[0]))
      deleteSelected()
      event.preventDefault()
    }
  }

  function copyToken(val: string) {
    const selBox = document.createElement('textarea')
    selBox.style.left = '0'
    selBox.style.top = '0'
    selBox.style.opacity = '0'
    selBox.style.position = 'fixed'
    selBox.value = val
    document.body.appendChild(selBox)
    selBox.focus()
    selBox.select()
    document.execCommand('copy')
    document.body.removeChild(selBox)
  }

  return (
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
  )
}
export default TokenField
