import { Schema, IViewFilter, TViewGroupFilterOperator } from '@nishans/types';
import React, { createContext, useState } from 'react';
import FilterGroup from "./components/Filter/Group";
import { ThemeProvider } from '@material-ui/core/styles';
import theme from "./globalTheme";

import "./index.css";

type State = IViewFilter;

interface Props {
  schema: Schema,
  nestingLevel?: number,
  default_group_operator?: TViewGroupFilterOperator,
  filters?: State,
  filter_item_label?:boolean
}

interface INotionFilterContext extends Required<Props> {
  setFilters: (filter: State) => void,
}

export const NotionFilterContext = createContext<INotionFilterContext>({} as any)

function NotionFilter(props: Props) {
  const default_group_operator = props.default_group_operator ?? "and"
  const [filters, setFilters] = useState<State>(props.filters ?? {
    filters: [],
    operator: default_group_operator
  });

  return <NotionFilterContext.Provider value={{ filter_item_label: props.filter_item_label ?? false, default_group_operator, filters, setFilters, schema: props.schema, nestingLevel: props.nestingLevel ?? 5 }}>
    <ThemeProvider theme={theme}>
      <div className="NotionFilter" style={{ fontFamily: "Segoe UI" }}>
        <FilterGroup parent_filter={null} filter={filters} trails={[]} />
      </div>
    </ThemeProvider>
  </NotionFilterContext.Provider>
}

export default NotionFilter;
