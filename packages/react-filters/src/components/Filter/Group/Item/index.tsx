import React from "react";
import { TSchemaInfo } from "../../../../types";
import FilterGroupItemOperator from "./Operator";
import FilterGroupItemProperty from "./Property";
import FilterGroupItemValue from "./Value";

interface Props {
  schema: TSchemaInfo
}

export default function FilterGroupItem(props: Props) {
  return <div className="NotionFilter-Group-Item">
    <FilterGroupItemProperty schema={props.schema} />
    <FilterGroupItemOperator operators={[{ value: "checkbox_is", label: "Is" }]} />
    <FilterGroupItemValue value="string" />
  </div>
}
