# react-tokenfield

> Create token fields with copy/paste and keyboard support

[![NPM](https://img.shields.io/npm/v/react-tokenfield.svg)](https://www.npmjs.com/package/react-tokenfield) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Features

- Select All with Ctrl+A
- Copy & paste tokens with Ctrl+C and Ctrl+V
- Keyboard navigation, delete tokens with keyboard (arrow keys, Tab/Shift + Tab)
- Customizable token renderer
- Validation using regular expression
- Customizable token delimiters
- Customizable token style
- Auto Complete

## Install

```bash
npm install --save react-tokenfield
```

## Usage

```tsx
import React, { useEffect, useState } from 'react'
import { TokenField } from 'react-tokenfield'

interface User {
  firstName: string
  lastName: string
  email: string
  image: string
}

const App = () => {
  const [tokens, setTokens] = useState<string[]>([])
  const [users, setUsers] = useState<User[]>([])
  useEffect(() => {
    window
      .fetch('https://dummyjson.com/users')
      .then((res: Response) => res.json())
      .then((res) => setUsers(res.users))
  }, [])

  function renderOptions(str: string): React.ReactElement {
    return (
      <div
        className='options'
      >
        {users
          .filter(
            (user) =>
              user.email.toLowerCase().startsWith(str.toLowerCase()) ||
              user.firstName.toLowerCase().startsWith(str.toLowerCase()) ||
              user.lastName.toLowerCase().startsWith(str.toLowerCase())
          )
          .map((user) => (
            <div key={user.email} className='user-info' data-value={user.email}>
              <img alt={user.email} src={user.image} />
              <div>
                <div>
                  <b>{`${user.firstName} ${user.lastName}`}</b>
                </div>
                <div>{user.email}</div>
              </div>
            </div>
          ))}
      </div>
    )
  }
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
        options={{
          render: renderOptions,
          selectedClassName: 'selected'
        }}
        tokens={tokens}
      />
    </div>
  )
}

export default App
```

#show all op


Property Name  | Type |Descri
------------- | -------------| -------------
placeholder  | string |a short hint that describes the expected value of an input
delimiters  |string| a string that contains all related delimiters for example ',;-', the first delimiter is the main delimiter that's means that when you copy tokens the copied token will be separated with the main delimeter
tokens|string[]|the array of string tokens
pattern|string|The pattern specifies a regular expression that token should match
showRemoveButton|boolean|show remove botton
options|object
onChange|function|

## Snapshot

![alt text](https://shahar-levi.github.io/react-tokenfield-demo/tokenfield.png)

## [Demo](https://shahar-levi.github.io/react-tokenfield-demo)

## License

MIT © [Shahar Levi](https://github.com/Shahar-Levi)
