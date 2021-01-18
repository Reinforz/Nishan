import { IViewFilter, TViewGroupFilterOperator } from '@nishans/types';
import React, { createContext, useState } from 'react';
import FilterGroup from "./components/Filter/Group";
import { TSchemaInfo } from './types';

type State = IViewFilter;

interface Props {
  root_operator?: TViewGroupFilterOperator,
  schema_info: TSchemaInfo
}

export const NotionFilterContext = createContext<{
  filters: State,
  setFilters: (filter: State) => void,
  schema_info: TSchemaInfo
}>({} as any)

function NotionFilter(props: Props) {
  const [filters, setFilters] = useState<State>({
    filters: [],
    operator: props.root_operator ?? "and"
  });

  return <NotionFilterContext.Provider value={{ filters, setFilters, schema_info: props.schema_info }}>
    <div className="NotionFilter">
      <FilterGroup filter={filters} />
    </div>
  </NotionFilterContext.Provider>
}

export default NotionFilter;
