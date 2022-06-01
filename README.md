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

## Install

```bash
npm install --save react-tokenfield
```

## Usage

```tsx
import { TokenField } from "react-tokenfield";
import "react-tokenfield/dist/index.css";
import React, { useState } from "react";

const App = () => {
  const [tokens, setTokens] = useState<string[]>([
    "shahar.levi@me.com",
    "john.smith@google.com",
    "invalid-email"
  ]);

  const emailPattern: string =
    "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

  return (
    <div>
      <TokenField
        placeholder = 'Type an email'
        onChange = {({ tokens }) => setTokens(tokens)}
        pattern = { emailPattern }
        tokens= { tokens }
      />
    </div>
  );
};
export default App;
```
##Snapshot
![alt text](https://shahar-levi.github.io/react-tokenfield-demo/tokenfield.png)


##[Demo](https://shahar-levi.github.io/react-tokenfield-demo)

## License

MIT © [Shahar Levi](https://github.com/Shahar-Levi)
