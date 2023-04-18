import "./App.css";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  CellEditingStartedEvent,
  CellEditingStoppedEvent,
  CellEditorSelectorResult,
  ColDef,
  ColGroupDef,
  Grid,
  GridOptions,
  ICellEditorParams,
  RowEditingStartedEvent,
  RowEditingStoppedEvent,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import NumEditor from "./CellEditors/NumEditor";
import { Input, makeStyles, shorthands } from "@fluentui/react-components";
import NumRender from "./CellRenders/NumRender";

const App = () => {
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
  const [columnDefs, setColumnDefs] = useState([
    { field: "make", filter: true },
    { field: "model", filter: true },
    {
      field: "price",
      editable: true,
      cellEditor: NumEditor,
      cellRenderer: NumRender,
    },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      editable: true,
    }),
    []
  );

  // Example of consuming Grid Event
  const cellClickedListener = useCallback((event: any) => {
    console.log("cellClicked", event);
  }, []);

  // Example load data from server
  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/row-data.json")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  return (
    <div className="ag-theme-alpine" style={{ width: 500, height: 500 }}>
      <AgGridReact
        rowData={rowData} // Row Data for Rows
        columnDefs={columnDefs} // Column Defs for Columns
        defaultColDef={defaultColDef} // Default Column Properties
        animateRows={true} // Optional - set to 'true' to have rows animate when sorted
        rowSelection="multiple" // Options - allows click selection of rows
        onCellClicked={cellClickedListener} // Optional - registering for Grid Event
      />
    </div>
  );
};

export default App;
