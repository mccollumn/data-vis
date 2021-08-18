import { useEffect, useState, useRef } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";

export const Table = () => {
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef(null);

  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/row-data.json")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  const onButtonClick = (e) => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    const selectedDataStringPresentation = selectedData
      .map((node) => `${node.make} ${node.model}`)
      .join(", ");
    console.log(`Selected Table nodes: ${selectedDataStringPresentation}`);
  };

  return (
    <div className="ag-theme-alpine-dark" style={{ height: 400, width: 600 }}>
      <button onClick={onButtonClick}>Get selected rows</button>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        rowSelection="multiple"
        groupSelectsChildren={true}
        autoGroupColumnDef={{
          headerName: "Model",
          field: "model",
          cellRenderer: "agGroupCellRenderer",
          cellRendererParams: { checkbox: true },
        }}
      >
        <AgGridColumn
          field="make"
          sortable={true}
          filter={true}
          checkboxSelection={true}
          rowGroup={true}
        ></AgGridColumn>
        <AgGridColumn
          field="model"
          sortable={true}
          filter={true}
        ></AgGridColumn>
        <AgGridColumn
          field="price"
          sortable={true}
          filter={true}
        ></AgGridColumn>
      </AgGridReact>
    </div>
  );
};

export default Table;
