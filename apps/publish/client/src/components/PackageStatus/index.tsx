import React from 'react';
import { IPackageStatus } from "../App";
import "./index.css";

interface Props {
  packages_status: IPackageStatus[]
};

export function PackageStatus({ packages_status }: Props) {
  return (
    <div className="PackageStatus">
      {packages_status.map((packages_status) =>
        <div key={packages_status.name} className="PackageStatus-item">
          <div className="PackageStatus-item-name">{packages_status.name}</div>
          <div className="PackageStatus-item-steps">
            {packages_status.steps.map(({ done }, index) => <span className={`PackageStatus-item-step PackageStatus-item-step--${done}`} key={`${packages_status.name}-step-${index}`}>
              {index + 1}
            </span>)}
          </div>
        </div>
      )}
    </div>
  );
}