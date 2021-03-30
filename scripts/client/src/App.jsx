import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './logo.svg';

function App() {
  // Create the count state.
  const [count, setCount] = useState(0);
  // Update the count (+1 every second).
  useEffect(() => {
    const timer = setTimeout(() => setCount(count + 1), 1000);
    return () => clearTimeout(timer);
  }, [count, setCount]);

  useEffect(()=>{
    const ws = new WebSocket("ws://localhost:8000");
    ws.addEventListener("open", async ()=>{
      console.log("We are connected");
      ws.send("Client");
    });

    ws.addEventListener("message", async(data)=>{
      console.log(`Sever has sent ${data}`);
    })
  }, [])

  // Return the App component.
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Page has been open for <code>{count}</code> seconds.
        </p>
      </header>
    </div>
  );
}

export default App;