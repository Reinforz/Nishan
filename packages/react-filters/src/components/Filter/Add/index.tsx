import React from "react";

interface Props {
  addFilter: React.Dispatch<React.SetStateAction<number>>
}

export default function FilterAdd(props: Props) {
  return <div onClick={() => props.addFilter(current_filters => current_filters + 1)}>+ Add a filter</div>
}