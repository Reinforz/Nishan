import React, { useEffect, useState } from 'react';
import './App.css';
import { PackageList } from "./PackageList";

function App() {
  const [packages, setPackages] = useState([]);

  useEffect(()=>{
    /* const ws = new WebSocket("ws://localhost:8000");
    ws.addEventListener("open", async ()=>{
      console.log("We are connected");
      ws.send("Client");
    });

    ws.addEventListener("message", async(data)=>{
      console.log(`Sever has sent ${data}`);
    }) */
    fetch("http://localhost:3000/getPackages").then(res=>res.json()).then(packages=>setPackages(packages.map(package_name=>({name: package_name, checked: false})))) 
  }, [])

  return (
    <div>
      <PackageList packages={packages} setPackages={setPackages}/>
      <button onClick={()=>{
        fetch("http://localhost:3000/createPackagePublishOrder", {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(packages.filter(({checked})=>checked).map(({name})=>name))
        }).then(res=>res.json()).then(packages=>console.log(packages));
      }}>Send</button>
    </div>
  );
}

export default App;