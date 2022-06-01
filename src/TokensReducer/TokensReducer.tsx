import { useReducer } from 'react'
import { TokenCSS } from '../Styles/Token.style'

const initialState = {
  tokens: [] as string[],
  selectedIndexes: [] as number[],
  editIndex: -1,
  focusIndex: -1,
  lastActionTime: ''
}
export type TokensState = typeof initialState
export type FocusMovement = 'self' | 'back' | 'next' | 'none'
export type TokenState = {
  text: string
  selected: boolean
  invalid: boolean
  index: number
}

export enum ActionType {
  Add,
  Update,
  Delete,
  DeleteLast,
  Select,
  Edit,
  Focus,
  FocusNew
}

export interface DelimiterActions {
  containDelimiter: (key: string) => boolean
  parseToken: (token: string) => string[]
}

type Action =
  | {
      type: ActionType.Add
      payload: { tokens: string[]; focus: FocusMovement }
    }
  | {
      type: ActionType.Delete
      payload: { indexes: number[] }
    }
  | {
      type: ActionType.Select
      payload: { indexes: number[]; add: boolean }
    }
  | {
      type: ActionType.Edit
      payload: { index: number }
    }
  | {
      type: ActionType.Update
      payload: { index: number; tokens: string[]; focus: FocusMovement }
    }
  | {
      type: ActionType.Focus
      payload: { index: number; focus: FocusMovement }
    }
  | {
      type: ActionType.FocusNew
    }
  | { type: ActionType.DeleteLast }

function focusBack(index: number, state: TokensState) {
  if (index === -1) {
    if (state.tokens.length > 0) {
      state.focusIndex = state.tokens.length - 1
    }
    return
  }
  state.focusIndex = Math.max(0, index - 1)
}

function focusNext(index: number, state: TokensState) {
  if (index === -1 || state.tokens.length === index + 1) {
    state.focusIndex = -1
    return
  }
  state.focusIndex = Math.min(state.tokens.length - 1, index + 1)
}

function handleFocus(
  state: TokensState,
  focus: FocusMovement,
  index: number = -1
) {
  if (focus === 'none') {
    state.focusIndex = -2
  } else if (focus === 'back') {
    focusBack(state.focusIndex, state)
  } else if (focus === 'next') {
    focusNext(state.focusIndex, state)
  } else {
    state.focusIndex = index
  }
}

const reducer = (state: TokensState, action: Action) => {
  const updatedState: TokensState = { ...state }
  let lastIndex: number
  const tokens = [...updatedState.tokens]
  let multi: boolean
  switch (action.type) {
    case ActionType.Update:
      updatedState.selectedIndexes = []
      tokens.splice(action.payload.index, 1, ...action.payload.tokens)
      updatedState.lastActionTime = new Date().toISOString()
      updatedState.tokens = tokens
      updatedState.editIndex = -1
      handleFocus(updatedState, action.payload.focus)
      updatedState.selectedIndexes = [updatedState.focusIndex]
      return updatedState
    case ActionType.Delete:
      lastIndex = action.payload.indexes.length - 1
      updatedState.lastActionTime = new Date().toISOString()
      updatedState.tokens = updatedState.tokens.filter(
        (_, i) => !action.payload.indexes.includes(i)
      )
      multi = action.payload.indexes.length > 1
      if (multi) {
        updatedState.focusIndex = -1
      } else if (updatedState.focusIndex !== -1) {
        updatedState.focusIndex = Math.min(
          action.payload.indexes[lastIndex],
          updatedState.tokens.length - 1
        )
      }
      updatedState.selectedIndexes =
        updatedState.focusIndex !== -1 ? [updatedState.focusIndex] : []
      updatedState.editIndex = -1
      return updatedState
    case ActionType.Select:
      updatedState.lastActionTime = new Date().toISOString()
      if (action.payload.add) {
        updatedState.selectedIndexes = Array.from(
          new Set([...updatedState.selectedIndexes, ...action.payload.indexes])
        )
      } else {
        updatedState.selectedIndexes = action.payload.indexes
      }
      if (
        action.payload.indexes.length &&
        updatedState.tokens.length !== updatedState.selectedIndexes.length &&
        updatedState.focusIndex !== -1
      ) {
        updatedState.focusIndex =
          action.payload.indexes[action.payload.indexes.length - 1]
      }
      updatedState.editIndex = -1
      return updatedState
    case ActionType.Add:
      updatedState.lastActionTime = new Date().toISOString()
      updatedState.selectedIndexes = []
      if (action.payload.tokens) {
        updatedState.tokens = [...updatedState.tokens, ...action.payload.tokens]
      }
      handleFocus(updatedState, action.payload.focus)
      updatedState.editIndex = -1
      return updatedState
    case ActionType.Edit:
      updatedState.lastActionTime = new Date().toISOString()
      updatedState.selectedIndexes = []
      updatedState.editIndex = action.payload.index
      updatedState.focusIndex = action.payload.index
      return updatedState
    case ActionType.FocusNew:
      updatedState.lastActionTime = new Date().toISOString()
      updatedState.selectedIndexes = []
      updatedState.focusIndex = -1
      return updatedState
    case ActionType.Focus:
      updatedState.lastActionTime = new Date().toISOString()
      updatedState.editIndex = -1
      handleFocus(updatedState, action.payload.focus, action.payload.index)
      updatedState.selectedIndexes =
        updatedState.focusIndex !== -1 ? [updatedState.focusIndex] : []
      return updatedState

    default:
      return state
  }
}

export const useTokens = (
  tokens: string[],
  pattern: string,
  readonly: boolean,
  tokenCSS?: ((tokenState: TokenState) => TokenCSS) | undefined
) => {
  const [state, dispatch] = useReducer(reducer, { ...initialState, tokens })

  function getTokenStyle(tokenState: TokenState): TokenCSS {
    return tokenCSS ? tokenCSS(tokenState) : {}
  }

  function updateToken(index: number, tokens: string[], focus: FocusMovement) {
    if (!readonly) {
      dispatch({
        type: ActionType.Update,
        payload: { tokens, index, focus }
      })
    }
  }

  function selectToken(indexes: number[], add: boolean) {
    dispatch({
      type: ActionType.Select,
      payload: { indexes, add }
    })
  }

  function deleteToken(indexes: number[]) {
    if (!readonly) {
      dispatch({
        type: ActionType.Delete,
        payload: { indexes: [...indexes] }
      })
    }
  }

  function deleteLast() {
    if (!readonly) {
      dispatch({
        type: ActionType.Delete,
        payload: { indexes: [state.tokens.length - 1] }
      })
    }
  }

  function addToken(tokens: string[], focus: FocusMovement) {
    if (!readonly) {
      dispatch({
        type: ActionType.Add,
        payload: { tokens, focus }
      })
    }
  }

  function editToken(index: number) {
    if (!readonly) {
      dispatch({
        type: ActionType.Edit,
        payload: { index }
      })
    }
  }

  function focus(index: number, focus: FocusMovement) {
    dispatch({
      type: ActionType.Focus,
      payload: { focus, index }
    })
  }

  function focusNew() {
    dispatch({
      type: ActionType.FocusNew
    })
  }

  function allTokenAreSelected() {
    return state.tokens.length === state.selectedIndexes.length
  }

  function selectAll() {
    selectToken(Array.from(state.tokens.keys()), false)
  }

  function focusLast() {
    focus(-1, 'back')
  }

  function deleteSelected() {
    if (!readonly) {
      deleteToken([...state.selectedIndexes, state.focusIndex])
    }
  }

  function isValid(token: string): boolean {
    const regex = new RegExp(pattern)
    return regex.test(token)
  }

  function getSelectedTokenText() {
    return state.selectedIndexes.map((index) => state.tokens[index])
  }

  return {
    state,
    selectToken,
    focus,
    focusLast,
    focusNew,
    updateToken,
    deleteToken,
    deleteLast,
    deleteSelected,
    allTokenAreSelected,
    selectAll,
    editToken,
    addToken,
    isValid,
    getSelectedTokenText,
    getTokenStyle
  }
}

export type TokenProps = ReturnType<typeof useTokens>
