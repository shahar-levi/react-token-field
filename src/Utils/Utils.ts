class Utils {
  static inputCaretEnd(inputRef: HTMLInputElement | null): boolean {
    if (!inputRef) return false
    return (
      inputRef.selectionStart === inputRef.value.length &&
      inputRef.selectionEnd === inputRef.value.length
    )
  }

  static inputTextFullSelection(inputRef: HTMLInputElement | null) {
    if (!inputRef) return false
    return (
      inputRef.selectionStart === 0 &&
      inputRef.selectionEnd === inputRef.value.length
    )
  }

  static inputCaretStart(inputRef: HTMLInputElement | null): boolean {
    if (!inputRef) return false
    return inputRef.selectionStart === 0 && inputRef.selectionEnd === 0
  }
}
export default Utils
