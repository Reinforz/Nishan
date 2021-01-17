import React, { useState } from 'react';
import FilterAdd from './components/Filter/Add';
import FilterItem from "./components/Filter/Item";

function NotionFilter() {
  const [total_filters, setTotalFilters] = useState(0);
  return (
    <div className="NotionFilter">
      {Array(total_filters).fill(0).map(() => <FilterItem schema={[["checkbox", "checkbox", "Is Done"]]} />)}
      <FilterAdd addFilter={setTotalFilters} />
    </div>
  );
}

export default NotionFilter;
