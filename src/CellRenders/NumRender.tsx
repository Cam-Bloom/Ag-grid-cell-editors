import React from "react";
import { ICellRendererParams } from "ag-grid-community";
import { makeStyles, Text } from "@fluentui/react-components";
export default (props: ICellRendererParams) => {
  return (
    <div>
      <Text size={300}>£</Text>
      {props.value}
    </div>
  );
};
