import { useEffect, useState, useRef } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";

export const Table = ({ data = [] }) => {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [columns, setColumns] = useState([]);
  const gridRef = useRef(null);

  console.log("Table Data:", data);

  const getRowData = (data) => {
    if (data.length === 0) return [];
    const dimensionOne = data.definition.dimensions[0].name;
    const subRows = data.data[0].SubRows[0];
    let tableData = [];

    for (const [item, values] of Object.entries(subRows)) {
      let row = { [dimensionOne]: item };
      if (values.attributes) {
        for (const [attrib, value] of Object.entries(values.attributes)) {
          row[attrib] = value;
        }
      }
      for (const [measure, measureValue] of Object.entries(values.measures)) {
        row[measure] = measureValue;
      }
      tableData.push(row);
    }
    return tableData;
  };

  const getColumns = (data) => {
    if (data.length === 0) return [];
    let columns = [];
    for (const [column] of Object.entries(data.pop())) {
      const obj = { field: column };
      columns.push(obj);
    }
    return columns;
  };

  useEffect(() => {
    setRowData(getRowData(data));
  }, [data]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  };

  const onButtonClick = (e) => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    const selectedDataStringPresentation = selectedData
      .map((node) => `${node.make} ${node.model}`)
      .join(", ");
    console.log(`Selected Table nodes: ${selectedDataStringPresentation}`);
  };

  const gridOptions = {
    pagination: true,
  };

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  useEffect(() => {
    setColumns(getColumns(rowData));
  }, [rowData]);

  return (
    <div className="ag-theme-alpine-dark" style={{ height: 400, width: "90%" }}>
      <button onClick={onButtonClick}>Get selected rows</button>
      <AgGridReact
        onGridReady={onGridReady}
        ref={gridRef}
        rowData={rowData}
        rowSelection="multiple"
        gridOptions={gridOptions}
        defaultColDef={defaultColDef}
      >
        {columns.map((column) => (
          <AgGridColumn {...column} key={column.field} />
        ))}
      </AgGridReact>
    </div>
  );
};

export default Table;
