import { useState } from 'preact/hooks'
import Button from './ooui/components/Button'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{
      position: "absolute",
      top: "50%",
      left: "50%",
    }}>
      <Button onClick={()=>{
        setCount(count + 1)
      }}>
        {`You've clicked me ${count} times!`}
      </Button>

      <Button onClick={()=>{
        alert("Red button clicked!")
      }} configOptions={{
        icon: "alert",
        flags: ["destructive"],
      }}>
        Red button
      </Button>
    </div>
  )
}
