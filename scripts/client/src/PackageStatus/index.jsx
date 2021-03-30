import React from 'react';

export function PackageStatus({packages_status}) {
  return (
    <div>
      {packages_status.map((packages_status)=>
        <div key={packages_status.name}>
          {packages_status.name}
        </div>
      )}
    </div>
  );
}