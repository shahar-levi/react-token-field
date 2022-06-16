import { TokenField } from 'react-tokenfield'
import React, { useState } from 'react'

const App = () => {
  const [tokens, setTokens] = useState<string[]>([
    'shahar.levi@me.com',
    'john.smith@google.com',
    'invalid-email'
  ])

  const emailPattern: string =
    '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'

  return (
    <div
      style={{
        width: '400px',
        fontFamily: 'Arial',
        padding: '10px',
        margin: '0 auto'
      }}
    >
      <TokenField
        placeholder='Type an email'
        onChange={({ tokens }) => setTokens(tokens)}
        pattern={emailPattern}
        autoFocus={false}
        showRemoveButton={false}
        tokenFieldCSS={{
          gap: '10px',
          background: '#fff',
          color: '#333',
          borderRadius: '2px',
          resize: 'none'
        }}
        tokens={tokens}
      />
      <h3>All Tokens</h3>
      <ul>
        {tokens.map(function (name, index) {
          return <li key={index}>{name}</li>
        })}
      </ul>
    </div>
  )
}

export default App
