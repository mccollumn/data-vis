import React from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import getRowData from "../services/getRowData";

export const Table = ({ data = [], loadTrendReport, profileID, trend }) => {
  const [gridApi, setGridApi] = React.useState(null);
  const [columnApi, setColumnApi] = React.useState(null);
  const gridRef = React.useRef(null);
  let isFiltered = false;

  const { dimensions, measures, columns, totals, rowData } = React.useMemo(
    () => renderData(data),
    [data]
  );

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

  const onRangeSelectionChanged = (event) => {
    if (dimensions.length > 1 || trend !== "none") return;
    const cellRanges = gridApi.getCellRanges();

    cellRanges.forEach((range) => {
      const startRow = Math.min(range.startRow.rowIndex, range.endRow.rowIndex);
      const endRow = Math.max(range.startRow.rowIndex, range.endRow.rowIndex);
      for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
        range.columns.forEach((column) => {
          const rowModel = gridApi.getModel();
          const rowNode = rowModel.getRow(rowIndex);
          const rowName = rowNode.key;
          const query = `[${dimensions[0].name}] = '${rowName}'`;
          const params = {
            start_period: data.data[0].start_date
              .replace("-", "m")
              .replace("-", "d"),
            end_period: data.data[0].end_date
              .replace("-", "m")
              .replace("-", "d"),
            language: "en-US",
            format: "json",
            suppress_error_codes: false,
            range: 5,
            period_type: "trend",
            query,
            measures: data.definition.measures.findIndex(
              (measure) => measure.name === column.colId
            ),
          };
          loadTrendReport(profileID, data.definition.ID, params);
        });
      }
    });
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

  const updateTotals = () => {
    const columns = columnApi.columnModel.gridColumns;
    isFiltered = columns.some((column) => column.filterActive === true);
    gridApi.setPinnedBottomRowData(isFiltered ? false : totals);
  };

  const gridOptions = {
    pagination: true,
    paginationAutoPageSize: true,
    enableCellTextSelection: true,
    ensureDomOrder: true,
    enableRangeSelection: true,
  };

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  const autoGroupColumnDef = {
    headerName: getDimColumns(dimensions),
    minWidth: 250,
    cellRendererParams: { suppressCount: true },
    sortable: true,
    pinned: "left",
    autoHeight: true,
  };

  const filterParams = { valueFormatter: valueFormatter };

  return (
    <div className="ag-theme-alpine" style={{ height: 500, margin: 20 }}>
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
          updateTotals();
        }}
        onFilterModified={function (props) {}}
        onRangeSelectionChanged={onRangeSelectionChanged}
      >
        {columns.map((column, i) => (
          <AgGridColumn
            {...column}
            key={column.field}
            valueFormatter={valueFormatter}
            filter="agNumberColumnFilter"
            filterParams={filterParams}
            sort={i === 0 ? "desc" : ""}
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
  if (!data || data.length === 0) return [];
  if (data.data.length > 1) return [];
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
