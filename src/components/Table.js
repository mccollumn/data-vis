import { useEffect, useState, useRef, useCallback } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import getRowData from "../services/getRowData";

export const Table = ({ data = [] }) => {
  // Totals row
  // https://stackoverflow.com/questions/65177239/how-to-enable-or-show-total-row-in-footer-of-ag-grid-table

  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [columns, setColumns] = useState([]);
  const [dimensions, setDimensions] = useState([]);
  const gridRef = useRef(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  };

  const getDimColumns = (values) => {
    if (values.length === 0) return "";
    let nameArray = [];
    values.forEach((dim, index) => {
      nameArray[index] = dim.name;
    });
    return nameArray.join(" > ");
  };

  const getDimensions = (data) => {
    if (data.length === 0) return [];
    return data.definition.dimensions;
  };

  const getMeasureNames = (data) => {
    if (data.length === 0) return [];
    let columns = [];
    data.definition.measures.forEach((column) => {
      columns.push({ field: column.name });
    });
    return columns;
  };

  const onButtonClick = (e) => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    const selectedDataStringPresentation = selectedData
      .map((node) => `${node.make} ${node.model}`)
      .join(", ");
    console.log(`Selected Table nodes: ${selectedDataStringPresentation}`);
  };

  useEffect(() => {
    setDimensions(getDimensions(data));
    setColumns(getMeasureNames(data));
    setRowData(getRowData(data));
  }, [data]);

  const gridOptions = {
    pagination: true,
  };

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  const autoGroupColumnDef = {
    headerName: getDimColumns(dimensions),
    minWidth: 300,
    cellRendererParams: { suppressCount: true },
  };

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
        autoGroupColumnDef={autoGroupColumnDef}
        treeData={true}
        animateRows={true}
        groupDefaultExpanded={0}
        getDataPath={(data) => data.Dimensions}
      >
        {columns.map((column) => (
          <AgGridColumn {...column} key={column.field} />
        ))}
      </AgGridReact>
    </div>
  );
};

export default Table;
