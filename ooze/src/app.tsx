import { useEffect, useState } from 'preact/hooks'
import Button from './ooui/components/Button'
import Message from './ooui/components/Message';
import TextInput from './ooui/components/TextInput';

export function App() {
  const [count, setCount] = useState(0)
  const [redButtonClicked, setRedButtonClicked] = useState(false);
  const [text, setText] = useState("Type something in the text input above!");

  // Log all state changes
  useEffect(() => {
    console.log("State changed!");
  }, [count, redButtonClicked, text]);


  return (
    <div>
      <h1>OOZE</h1>
      <p>OOUI + Preact + TypeScript = OOZE</p>
      <TextInput on={{
        change: value => {
          // Update the text state variable
          setText(value.toString());
        }
      }}
        configOptions={{
          value: text,
          placeholder: "Type something here",
        }}
      />
      <br />

      <Button on={{
        click: () => {
          setCount(count => count + 1);
        }
      }} label={`You've clicked me ${count} times!`} />
      <br />

      <Button on={{
        click: () => {
          console.log("Clicked!");
          setRedButtonClicked(redButtonClicked => !redButtonClicked)
        }
      }} configOptions={{
        icon: "alert",
        flags: ["primary", "destructive"],
      }} label={redButtonClicked ? "You've clicked me!" : "Click me!"} />
      <br />

      <Message configOptions={{
        type: "error",
      }}>
        {text}
      </Message>
    </div>
  )
}
