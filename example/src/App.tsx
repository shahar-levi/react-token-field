import { TokenField } from 'react-tokenfield'
import React, { useEffect, useState } from 'react'
import classes from './index.module.css'
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
    return users ? (
      <div
        style={{
          maxWidth: '300px',
          maxHeight: '300px',
          overflow: 'auto',
          scrollBehavior: 'smooth',
          boxShadow: '1px 1px 5px #aaa',
          borderRadius: '3px',
          background: '#fff'
        }}
      >
        {users
          .filter(
            (user) =>
              user.email.toLowerCase().startsWith(str.toLowerCase()) ||
              user.firstName.toLowerCase().startsWith(str.toLowerCase()) ||
              user.lastName.toLowerCase().startsWith(str.toLowerCase())
          )
          .map((user) => (
            <div
              key={user.email}
              style={{ display: 'flex', alignItems: 'center', padding: '10px' }}
              data-value={user.email}
            >
              <img
                alt={user.email}
                style={{
                  width: '24px',
                  height: '24px',
                  marginRight: '10px',
                  padding: '5px',
                  borderRadius: '24px',
                  border: '1px solid #aaa',
                  background: '#fafafa'
                }}
                src={user.image}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div>
                  <b>{`${user.firstName} ${user.lastName}`}</b>
                </div>
                <div style={{ fontWeight: 100 }}>{user.email}</div>
              </div>
            </div>
          ))}
      </div>
    ) : (
      <span>
        <div>loading</div>
      </span>
    )
  }

  // function renderCustomToken(state: TokenState) {
  //   const user: User | undefined = users.find(
  //     (user) => user.email === state.text
  //   )
  //   const value: string = user
  //     ? user.firstName + ' ' + user.lastName
  //     : state.text
  //   return (
  //     <span style={{ padding: '10px' }}>
  //       <span>{value}</span>
  //       <span>1.2.2</span>
  //     </span>
  //   )
  // }

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
          renderCustom: renderOptions,
          selectedClassName: classes.selected
        }}
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
