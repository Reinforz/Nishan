import { IViewFilter, TSchemaUnitType } from '@nishans/types';
import React, { useState } from 'react';
import FilterGroup from "./components/Filter/Group";

type State = IViewFilter;

const schema_info: [TSchemaUnitType, string, string][] = [["checkbox", "checkbox", "Is Done"]];

function NotionFilter() {
  const [filters, setFilters] = useState<State>({
    filters: [],
    operator: "and"
  });

  return (
    <div className="NotionFilter">
      <FilterGroup filters={filters} schema_info={schema_info} />
    </div>
  );
}

export default NotionFilter;
