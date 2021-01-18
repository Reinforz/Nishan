import { Schema, IViewFilter, TViewGroupFilterOperator } from '@nishans/types';
import React, { createContext, useState } from 'react';
import FilterGroup from "./components/Filter/Group";

type State = IViewFilter;

interface Props {
  root_operator?: TViewGroupFilterOperator,
  schema: Schema,
  nestingLevel?: number
}

export const NotionFilterContext = createContext<{
  filters: State,
  setFilters: (filter: State) => void,
  schema: Schema,
  nestingLevel: number
}>({} as any)

function NotionFilter(props: Props) {
  const [filters, setFilters] = useState<State>({
    filters: [],
    operator: props.root_operator ?? "and"
  });

  return <NotionFilterContext.Provider value={{ filters, setFilters, schema: props.schema, nestingLevel: props.nestingLevel ?? 5 }}>
    <div className="NotionFilter">
      <FilterGroup parent_filter={null} filter={filters} trails={[]} />
    </div>
  </NotionFilterContext.Provider>
}

export default NotionFilter;
