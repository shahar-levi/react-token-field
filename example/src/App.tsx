import React, { useState } from 'react'
import { TokenField } from 'react-token-field'

const App = () => {
  const [tokens, setTokens] = useState<string[]>([])

  const emailPattern: string =
    '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'

  return (
    <div
      style={{
        width: '600px',
        fontFamily: 'Arial',
        padding: '10px',
        margin: '0 auto'
      }}
    >
      <TokenField
        placeholder='Type an email'
        onChange={({ tokens }) => setTokens(tokens)}
        pattern={emailPattern}
        delimiters=',; '
        showRemoveButton={false}
        tokens={tokens}
      />
    </div>
  )
}

export default App
