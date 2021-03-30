import React, { useEffect, useState } from 'react';
import './App.css';
import { PackageList } from "./PackageList";
import { PackageStatus } from "./PackageStatus";

function App() {
  const [packages, setPackages] = useState([]);
  const [packages_status, setPackagesStatus] = useState([]);

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
      <PackageStatus packages_status={packages_status}/>
      <button onClick={()=>{
        fetch("http://localhost:3000/createPackagePublishOrder", {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(packages.filter(({checked})=>checked).map(({name})=>name))
        }).then(res=>res.json()).then(packages=>setPackagesStatus(packages.map((package_name)=>({
          name: package_name,
          steps: [
            {
              step: 'import checking',
              done: false
            },
            {
              step: 'test',
              done: false
            },
            {
              step: 'build',
              done: false
            },
            {
              step: 'build without comments',
              done: false
            }
          ]
        }))));
      }}>Send</button>
    </div>
  );
}

export default App;