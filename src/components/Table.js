import React from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import getRowData from "../services/getRowData";

export const Table = ({ data = [] }) => {
  const [gridApi, setGridApi] = React.useState(null);
  const [columnApi, setColumnApi] = React.useState(null);
  const gridRef = React.useRef(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  };

  const onFirstDataRendered = (params) => {};

  const getDimColumns = (values) => {
    if (values.length === 0) return "";
    let nameArray = [];
    values.forEach((dim, index) => {
      nameArray[index] = dim.name;
    });
    return nameArray.join(" > ");
  };

  const valueFormatter = (params) => {
    const measureValue = params.value;
    if (measureValue === null) return;

    const measureName = params.colDef.field;
    const measureConfig = measures.find(
      (measure) => measure.name === measureName
    );
    const measureFormat = measureConfig.measureFormatType;

    const measureFormatted = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(measureValue);

    if (measureFormat === "percent") {
      return measureFormatted + "%";
    }

    return measureFormatted;
  };

  const onButtonClick = (e) => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    const selectedDataStringPresentation = selectedData
      .map((node) => `${node.make} ${node.model}`)
      .join(", ");
    console.log(`Selected Table nodes: ${selectedDataStringPresentation}`);
  };

  const { dimensions, measures, columns, totals, rowData } = React.useMemo(
    () => renderData(data),
    [data]
  );

  const gridOptions = {
    pagination: true,
    paginationAutoPageSize: true,
  };

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  const autoGroupColumnDef = {
    headerName: getDimColumns(dimensions),
    minWidth: 200,
    cellRendererParams: { suppressCount: true },
    sortable: true,
    pinned: "left",
    autoHeight: true,
  };

  const filterParams = { valueFormatter: valueFormatter };

  return (
    <div className="ag-theme-alpine-dark" style={{ height: 400, width: "95%" }}>
      <button onClick={onButtonClick}>Get selected rows</button>
      <AgGridReact
        onGridReady={onGridReady}
        onFirstDataRendered={onFirstDataRendered}
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
        pinnedBottomRowData={totals}
        onFilterChanged={function (props) {
          console.log("onFilterChanged", props);
        }}
        onFilterModified={function (props) {
          console.log("onFilterModified", props);
        }}
      >
        {columns.map((column) => (
          <AgGridColumn
            {...column}
            key={column.field}
            valueFormatter={valueFormatter}
            filter="agNumberColumnFilter"
            filterParams={filterParams}
          />
        ))}
      </AgGridReact>
    </div>
  );
};

const getDimensions = (data) => {
  if (!data || data.length === 0) return [];
  return data.definition.dimensions;
};

const getMeasures = (data) => {
  if (!data || data.length === 0) return [];
  return data.definition.measures;
};

const getMeasureNames = (data) => {
  if (!data || data.length === 0) return [];
  let columns = [];
  data.definition.measures.forEach((column) => {
    columns.push({ field: column.name });
  });
  return columns;
};

const getTotals = (data) => {
  //   {
  //     "PageViews": {
  //         "filterType": "number",
  //         "type": "greaterThan",
  //         "filter": 3
  //     }
  // }

  if (!data || data.length === 0) return [];
  // const savedFilterModel = gridApi.getFilterModel();
  // console.log(savedFilterModel);
  return [data.data[0].measures];
};

const renderData = (data) => {
  return {
    dimensions: getDimensions(data),
    measures: getMeasures(data),
    columns: getMeasureNames(data),
    totals: getTotals(data),
    rowData: getRowData(data),
  };
};

export default Table;
