import { IViewFilter, TSchemaUnitType } from '@nishans/types';
import React, { useState } from 'react';
import FilterAdd from './components/Filter/Add';
import FilterItem from "./components/Filter/Item";

type State = IViewFilter;

const schema_info: [TSchemaUnitType, string, string][] = [["checkbox", "checkbox", "Is Done"]];

function NotionFilter() {
  const [filters, setFilters] = useState<State>({
    filters: [],
    operator: "and"
  });

  return (
    <div className="NotionFilter">
      {filters.filters.map(() => <FilterItem schema={schema_info} />)}
      <FilterAdd addFilter={setFilters} />
    </div>
  );
}

export default NotionFilter;
