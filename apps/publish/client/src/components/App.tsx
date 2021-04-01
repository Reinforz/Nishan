import React, { useEffect, useState } from 'react';
import { createPackagePublishOrder } from '../utils/createPackagePublishOrder';
import { getPackages } from '../utils/getPackages';
import { publishPackages } from '../utils/publishPackages';
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
      const data = JSON.parse(e.data) as { type: 'package_step', data: IPackageStep };
      if (data.type === "package_step") {
        setPackagesStatus((packages_status) => {
          const package_status = packages_status.find(package_status => package_status.name === `@nishans/${data.data.name}`)!;
          const step = package_status.steps.find(step => step.step === data.data.step)!;
          step.done = true;
          return JSON.parse(JSON.stringify(packages_status));
        });
      } else if (data.type === "") {

      }
    });

    getPackages().then(package_data => setPackages(package_data));
  }, [])

  return (
    <div className="App">
      <PackageList packages={packages} setPackages={setPackages} />
      <PackageStatus packages_status={packages_status} />
      <button className="App-resume" onClick={() => fetch("http://localhost:3000/resumePackagePublishing").then(data => data.json()).then(packages => {
        packages.map((package_name: string) => ({
          name: package_name,
          steps: [
            {
              step: 'import_checker',
              done: false
            },
            {
              step: 'test',
              done: false
            },
            {
              step: 'transpile',
              done: false
            },
            {
              step: 'transpile_nocomments',
              done: false
            },
            {
              step: 'update_json',
              done: false
            },
            {
              step: 'publish',
              done: false
            }
          ]
        }))
      })}>Resume</button>
      <button className="App-generate" onClick={() => createPackagePublishOrder(packages).then(package_status => setPackagesStatus(package_status))}>Generate</button>
      <button className="App-start" onClick={() => publishPackages(packages_status.map(({ name }) => name))}>Publish</button>
    </div>
  );
}

export default App;