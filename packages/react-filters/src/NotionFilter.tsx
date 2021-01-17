import { IViewFilter, TViewGroupFilterOperator } from '@nishans/types';
import React, { createContext, useState } from 'react';
import FilterGroup from "./components/Filter/Group";
import { TSchemaInfo } from './types';

type State = IViewFilter;

interface Props {
  initial_operator?: TViewGroupFilterOperator,
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
    operator: props.initial_operator ?? "and"
  });

  return <NotionFilterContext.Provider value={{ filters, setFilters, schema_info: props.schema_info }}>
    <div className="NotionFilter">
      <FilterGroup trails={[0]} />
    </div>
  </NotionFilterContext.Provider>
}

export default NotionFilter;
