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
export const getTokenFieldCSS: (
  cssStyle?: TokenFieldCSS
) => React.CSSProperties = (cssStyle): React.CSSProperties => ({
  resize: cssStyle?.resize || 'both',
  height: cssStyle?.height || 'auto',
  border: cssStyle?.border || '1px solid #ccc',
  gap: cssStyle?.gap || '5px',
  padding: cssStyle?.padding || '10px',
  background: cssStyle?.background || '',
  color: cssStyle?.color || '#333',
  boxShadow: cssStyle?.boxShadow || 'none',
  borderRadius: cssStyle?.borderRadius || 'unset',
  maxHeight: cssStyle?.maxHeight || '200px'
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
