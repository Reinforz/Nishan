import React, { useState } from 'react';
import FilterAdd from './components/Filter/Add';

function NotionFilter() {
  const [total_filters, setTotalFilters] = useState(0);
  return (
    <div className="NotionFilter">
      {Array(total_filters).fill(0).map((_, index) => <div>{index}</div>)}
      <FilterAdd addFilter={setTotalFilters} />
    </div>
  );
}

export default NotionFilter;
