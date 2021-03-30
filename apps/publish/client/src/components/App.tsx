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
      step: 'import_checker',
      done: boolean
    },
    {
      step: 'test',
      done: boolean
    },
    {
      step: 'transpile',
      done: boolean
    },
    {
      step: 'transpile_nocomments',
      done: boolean
    },
    {
      step: 'update_json',
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

export interface IPackageStep {
  name: string, step: string
};

const ws = new WebSocket("ws://localhost:8000");

function App() {
  const [packages, setPackages] = useState<IPackageInfo[]>([]);
  const [packages_status, setPackagesStatus] = useState<IPackageStatus[]>([]);

  useEffect(() => {
    ws.addEventListener("open", async () => {
      console.log("We are connected");
    });

    ws.addEventListener("message", async (e) => {
      const data = JSON.parse(e.data) as IPackageStep;
      setPackagesStatus((packages_status) => {
        const package_status = packages_status.find(package_status => package_status.name === `@nishans/${data.name}`)!;
        const step = package_status.steps.find(step => step.step === data.step)!;
        step.done = true;
        return JSON.parse(JSON.stringify(packages_status));
      });
    });

    getPackages().then(package_data => setPackages(package_data));
  }, [])

  console.log("App", packages_status);

  return (
    <div className="App">
      <PackageList packages={packages} setPackages={setPackages} />
      <PackageStatus packages_status={packages_status} />
      <button className="App-generate" onClick={() => createPackagePublishOrder(packages).then(package_status => setPackagesStatus(package_status))}>Generate</button>
      <button className="App-start" onClick={() => fetch("http://localhost:3000/publishPackages", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(packages_status.map(({ name }) => name))
      })}>Publish</button>
    </div>
  );
}

export default App;