import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import AvroTextarea from "./lib/AvroTextarea";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
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
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
