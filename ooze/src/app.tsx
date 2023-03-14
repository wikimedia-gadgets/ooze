import { useState } from 'preact/hooks'
import Button from './ooui/components/Button'
import TextInput from './ooui/components/TextInput';

export function App() {
  const [count, setCount] = useState(0)
  const [redButtonClicked, setRedButtonClicked] = useState(false);

  return (
    <div>
      <h1>OOZE</h1>
      <p>OOUI + Preact + TypeScript = OOZE</p>
      <TextInput on={{
        change: value => {
          console.log(value);
        }}}
        configOptions={{
          placeholder: "Type something here",
        }}
      />
      <Button on={{click: ()=>{
        setCount(count + 1)
      }}}>
        {`You've clicked me ${count} times!`}
      </Button>

      <Button on={{click: ()=>{
        setRedButtonClicked(!redButtonClicked)
      }}} configOptions={{
        icon: "alert",
        flags: ["primary", "destructive"],
      }}>
        {redButtonClicked ? "You've clicked me!" : "Click me!"}
      </Button>
    </div>
  )
}
