import React, { useEffect, useState } from 'react';
import { createPackagePublishOrder } from '../utils/createPackagePublishOrder';
import { getPackages } from '../utils/getPackages';
import './App.css';
import { PackageList } from "./PackageList";
import { PackageStatus } from "./PackageStatus";

export interface IPackageStatus {
  name: string,
  steps: [
    {
      step: 'import checking',
      done: boolean
    },
    {
      step: 'test',
      done: boolean
    },
    {
      step: 'build',
      done: boolean
    },
    {
      step: 'build without comments',
      done: boolean
    },
    {
      step: 'update packagejson',
      done: boolean
    },
    {
      step: 'publish',
      done: boolean
    }
  ]
};

export interface IPackageInfo {
  name: string,
  checked: boolean
}

function App() {
  const [packages, setPackages] = useState<IPackageInfo[]>([]);
  const [packages_status, setPackagesStatus] = useState<IPackageStatus[]>([]);

  useEffect(() => {
    /* const ws = new WebSocket("ws://localhost:8000");
    ws.addEventListener("open", async ()=>{
      console.log("We are connected");
      ws.send("Client");
    });

    ws.addEventListener("message", async(data)=>{
      console.log(`Sever has sent ${data}`);
    }) */
    getPackages().then(package_data => setPackages(package_data))
  }, [])

  return (
    <div className="App">
      <PackageList packages={packages} setPackages={setPackages} />
      <PackageStatus packages_status={packages_status} />
      <button className="Aoo-generate" onClick={() => createPackagePublishOrder(packages).then(package_status => setPackagesStatus(package_status))}>Generate</button>
      <button className="App-start">Start</button>
    </div>
  );
}

export default App;