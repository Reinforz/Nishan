import { IViewFilter, TViewGroupFilterOperator } from '@nishans/types';
import React, { useState } from 'react';
import FilterGroup from "./components/Filter/Group";
import { TSchemaInfo } from './types';

type State = IViewFilter;

const schema_info: TSchemaInfo = [["checkbox", "checkbox", "Is Done"]];

interface Props {
  initial_operator?: TViewGroupFilterOperator
}

function NotionFilter(props: Props) {
  const [filters, setFilters] = useState<State>({
    filters: [],
    operator: props.initial_operator ?? "and"
  });

  return (
    <div className="NotionFilter">
      <FilterGroup filters={filters} schema_info={schema_info} />
    </div>
  );
}

export default NotionFilter;
