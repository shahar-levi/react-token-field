import { TokenField } from '.'
import { act } from 'react-dom/test-utils'
import { render } from 'react-dom'
import React from 'react'

describe('TokenField', () => {
  it('is truthy', () => {
    expect(TokenField).toBeTruthy()
  })
  let container: HTMLDivElement | null = null
  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    container!.remove()
    container = null
  })

  it('renders token', () => {
    act(() => {
      render(<TokenField tokens={['1,2,3']} />, container)
    })
    expect(container?.textContent).toBe('1,2,3')
  })
})
