import { useState } from 'preact/hooks'
import Button from './ooui/components/Button'
import Message from './ooui/components/Message';
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
          // Update the text state variable, appended with "hi"
          // Do not update the text state if the change event is the expected result of
          // the text state being updated
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
          setCount(count + 1)
        }
      }}>
        {`You've clicked me ${count} times!`}
      </Button>
      <br />

      <Button on={{
        click: () => {
          setRedButtonClicked(!redButtonClicked)
        }
      }} configOptions={{
        icon: "alert",
        flags: ["primary", "destructive"],
      }}>
        {redButtonClicked ? "You've clicked me!" : "Click me!"}
      </Button>
      <br />

      <Message configOptions={{
        type: "error",
      }}>
        {text}
      </Message>
    </div>
  )
}
