import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import AvroTextarea from "./lib/AvroTextarea";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div style={{ marginTop: 32, width: "100%" }}>
        <h2 style={{ marginBottom: 8 }}>Bangla Phonetic Input (Avro)</h2>
        <AvroTextarea
          placeholder="Type Bangla phonetically..."
          style={{ maxWidth: 480 }}
        />
        <div style={{ fontSize: "0.95em", color: "#888", marginTop: 8 }}>
          <span>
            Press <b>Ctrl+M</b> to toggle Bangla/English mode.
          </span>
        </div>
      </div>
    </>
  );
}

export default App;
