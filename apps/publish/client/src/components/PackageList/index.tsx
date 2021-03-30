import React from 'react';
import type { IPackageInfo } from '../App';
import "./index.css";

interface Props {
  packages: IPackageInfo[],
  setPackages: React.Dispatch<React.SetStateAction<IPackageInfo[]>>
}

export function PackageList({ packages, setPackages }: Props) {
  return (
    <div className="PackageList">
      {packages.map((package_data) =>
        <div key={package_data.name} className="PackageList-item">
          <input className="PackageList-item-checkbox" type="checkbox" value={package_data.checked as any} onChange={(e) => {
            package_data.checked = e.target.checked;
            setPackages(packages);
          }} />
          <span className="PackageList-item-name">{package_data.name}</span>
        </div>
      )}
    </div>
  );
}