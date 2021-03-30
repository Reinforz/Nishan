import React from 'react';

export function PackageList({packages, setPackages}) {
  // Return the App component.
  return (
    <div>
      {packages.map((package_data)=>
        <div key={package_data.name}>
          <input type="checkbox" value={package_data.checked} onChange={(e)=>{
            package_data.checked = e.target.checked;
            setPackages(packages);
          }}/>
          <span className="PackageList-name">{package_data.name}</span>
        </div>
      )}
    </div>
  );
}