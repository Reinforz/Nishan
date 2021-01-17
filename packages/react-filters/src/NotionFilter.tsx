import { IViewFilter, TViewGroupFilterOperator } from '@nishans/types';
import React, { useState } from 'react';
import FilterGroup from "./components/Filter/Group";
import { TSchemaInfo } from './types';

type State = IViewFilter;

interface Props {
  initial_operator?: TViewGroupFilterOperator,
  schema_info: TSchemaInfo
}

function NotionFilter(props: Props) {
  const [filters, setFilters] = useState<State>({
    filters: [],
    operator: props.initial_operator ?? "and"
  });

  return (
    <div className="NotionFilter">
      <FilterGroup filters={filters} schema_info={props.schema_info} />
    </div>
  );
}

export default NotionFilter;
