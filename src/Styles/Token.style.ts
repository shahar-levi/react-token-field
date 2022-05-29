import React from 'react'

export type TokenFieldCSS = Pick<
  React.CSSProperties,
  | 'border'
  | 'resize'
  | 'gap'
  | 'height'
  | 'background'
  | 'padding'
  | 'color'
  | 'boxShadow'
  | 'borderRadius'
  | 'maxHeight'
> | null
export const getTokenFieldCSS: (css?: TokenFieldCSS) => React.CSSProperties = (
  css: TokenFieldCSS
): React.CSSProperties => ({
  resize: css?.resize || 'both',
  height: css?.height || 'auto',
  border: css?.border || '1px solid #ccc',
  gap: css?.gap || '5px',
  padding: css?.padding || '10px',
  background: css?.background || '',
  color: css?.color || '#333',
  boxShadow: css?.boxShadow || 'none',
  borderRadius: css?.borderRadius || 'unset',
  maxHeight: css?.maxHeight || '200px'
})

export type TokenCSS = Pick<
  React.CSSProperties,
  | 'border'
  | 'padding'
  | 'height'
  | 'background'
  | 'color'
  | 'boxShadow'
  | 'borderRadius'
  | 'textDecoration'
> | null
export const getTokenCSS: (css: TokenCSS) => TokenCSS | undefined = (
  css: TokenCSS
): TokenCSS => ({
  padding: css?.padding || '10px',
  height: css?.height || '100px',
  border: css?.border || '1px solid #ccc',
  background: css?.background || '',
  color: css?.color || '#333',
  boxShadow: css?.boxShadow || 'none',
  borderRadius: css?.borderRadius || 'unset',
  textDecoration: css?.textDecoration || 'none'
})
