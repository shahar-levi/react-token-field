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
        onChange={({ tokens }) => setTokens(tokens)}
        pattern={emailPattern}
        tokens={tokens}
      />
    </div>
  );
};
export default App;
