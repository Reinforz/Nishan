import { Schema, IViewFilter, TViewGroupFilterOperator, TViewFilters, TViewFiltersOperator, TSchemaUnitType } from '@nishans/types';
import React, { createContext, useReducer } from 'react';
import FilterGroup from "./components/Filter/Group";
import { ThemeProvider } from '@material-ui/core/styles';
import theme from "./globalTheme";

import "./index.scss";
import { createEmptyFilter, createEmptyFilterGroup } from './utils/createFilterLiterals';

type State = IViewFilter;

interface Props {
  schema: Schema,
  nestingLevel?: number,
  default_group_operator?: TViewGroupFilterOperator,
  filters?: State,
  filter_item_label?: boolean
}

interface INotionFilterContext extends Required<Props> {
  dispatch: React.Dispatch<Action>,
}

export const NotionFilterContext = createContext<INotionFilterContext>({} as any)

type Action = {
  type: "CHANGE_VALUE",
  value: any,
  filter: TViewFilters
} | {
  type: "ADD_FILTER",
  filter: IViewFilter
} | {
  type: "ADD_FILTER_GROUP",
  filter: IViewFilter
} | {
  type: "CHANGE_OPERATOR",
  filter: TViewFilters,
  operator: TViewFiltersOperator
} | {
  type: "REMOVE_FILTER",
  filter: IViewFilter,
  index: number
} | {
  type: "DUPLICATE_FILTER",
  filter: IViewFilter,
  index: number
} | {
  type: "TURN_INTO_GROUP",
  filter: IViewFilter,
  index: number
} | {
  type: "CHANGE_PROPERTY",
  filter: TViewFilters,
  property: TSchemaUnitType
} | {
  type: "CHANGE_GROUP_OPERATOR",
  filter: IViewFilter,
  operator: TViewGroupFilterOperator
} | {
  type: "REMOVE_GROUP",
  filter: IViewFilter
} | {
  type: "DUPLICATE_GROUP",
  filter: IViewFilter,
  index: number
} | {
  type: "TURN_INTO_FILTER",
  filter: IViewFilter,
  index: number
} | {
  type: "WRAP_IN_GROUP",
  filter: IViewFilter,
  index: number
}

const notionFilterReducer = (state: IViewFilter, action: Action) => {
  switch (action.type) {
    case "CHANGE_VALUE":
      (action.filter.filter as any).value.value = action.value;
      return { ...state };
    case "ADD_FILTER":
      action.filter.filters.push(createEmptyFilter());
      return { ...state }
    case "ADD_FILTER_GROUP":
      action.filter.filters.push(createEmptyFilterGroup("and"));
      return { ...state };
    case "CHANGE_OPERATOR":
      action.filter.filter.operator = action.operator as any
      return { ...state };
    case "REMOVE_FILTER":
      action.filter.filters.splice(action.index, 1);
      return { ...state };
    case "DUPLICATE_FILTER":
    case "DUPLICATE_GROUP":
      action.filter.filters.push(JSON.parse(JSON.stringify(action.filter.filters[action.index])))
      return { ...state };
    case "TURN_INTO_GROUP":
      action.filter.filters[action.index] = {
        operator: "and",
        filters: [action.filter.filters[action.index]]
      }
      return { ...state };
    case "CHANGE_PROPERTY":
      action.filter.property = action.property;
      return { ...state };
    case "CHANGE_GROUP_OPERATOR":
      action.filter.operator = action.operator;
      return { ...state };
    case "REMOVE_GROUP":
      action.filter.filters = [];
      return { ...state };
    case "TURN_INTO_FILTER":
      action.filter.filters[action.index] = (action.filter.filters[action.index] as IViewFilter).filters[0]
      return { ...state };
    case "WRAP_IN_GROUP":
      action.filter.filters[action.index] = {
        operator: "and",
        filters: [action.filter.filters[action.index]]
      }
      return { ...state };
    default:
      throw new Error("Unknown action type dispatched")
  }
}

function NotionFilter(props: Props) {
  const default_group_operator = props.default_group_operator ?? "and";
  const [filters, dispatch] = useReducer(notionFilterReducer, props.filters ?? {
    filters: [],
    operator: default_group_operator
  })

  return <NotionFilterContext.Provider value={{ filter_item_label: props.filter_item_label ?? false, default_group_operator, filters, dispatch, schema: props.schema, nestingLevel: props.nestingLevel ?? 5 }}>
    <ThemeProvider theme={theme}>
      <div className="NotionFilter" style={{ fontFamily: "Segoe UI" }}>
        <FilterGroup parent_filter={null} filter={filters} trails={[]} />
      </div>
    </ThemeProvider>
  </NotionFilterContext.Provider>
}

export default NotionFilter;
