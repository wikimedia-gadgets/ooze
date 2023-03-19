import { useEffect, useState } from 'preact/hooks'
import Button from './ooui/components/Button'
import Message from './ooui/components/Message';
import ProgressBar from './ooui/components/ProgressBar';
import TextInput from './ooui/components/TextInput';

export function App() {
  const [count, setCount] = useState(0)
  const [redButtonClicked, setRedButtonClicked] = useState(false);
  const [text, setText] = useState("Type something in the text input above!");

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
          setRedButtonClicked(redButtonClicked => !redButtonClicked)
        }
      }} configOptions={{
        icon: redButtonClicked ? "check" : "close",
        flags: ["primary", "destructive"],
      }} label={redButtonClicked ? "You've clicked me!" : "Click me!"} />
      <br />

      <Message configOptions={{
        type: "error",
      }}>
        {text}
      </Message>

      <Button on={{
        click: () => {
          setText(text => text + "!");
        }
      }} label="Add an exclamation point to the text above!" />

      <ProgressBar progress={70} />
    </div>
  )
}
