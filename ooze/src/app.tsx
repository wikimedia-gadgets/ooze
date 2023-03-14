import { useState } from 'preact/hooks'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{
      position: "absolute",
      top: "50%",
      left: "50%",
    }}>
      <p>Hello! State is {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
