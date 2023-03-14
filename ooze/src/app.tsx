import { useState } from 'preact/hooks'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <p>Hello! State is {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  )
}
