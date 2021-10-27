const getAttributes = (obj, entry) => {
  if (obj[entry].attributes) {
    let attributes = [];
    for (const value of Object.values(obj[entry].attributes)) {
      attributes.push(value);
    }
    return attributes.join(" - ");
  }
  return "";
};

const getRowData = (data) => {
  if (data.length === 0) return [];
  const isTrend = data.data.length > 1 ? true : false;
  let tableData = [];

  const getRow = (obj, level = 0, prevColValues = []) => {
    Object.keys(obj).forEach((entry) => {
      const attributeStr = getAttributes(obj, entry);

      let newColValues = prevColValues;
      newColValues[level] = attributeStr ? `${attributeStr}\n${entry}` : entry;
      newColValues.length = level + 1;

      const row = { Dimensions: newColValues.slice() };

      for (const [measure, measureValue] of Object.entries(
        obj[entry].measures
      )) {
        row[measure] = measureValue;
      }

      tableData.push(row);

      if (obj[entry].SubRows !== null) {
        getRow(obj[entry].SubRows, level + 1, newColValues);
      }
    });
  };

  if (isTrend) {
    data.data.forEach((period) => {
      const periodDate = period.start_date;
      const row = { Dimensions: [periodDate] };

      for (const [measure, measureValue] of Object.entries(period.measures)) {
        row[measure] = measureValue;
      }
      tableData.push(row);

      getRow(period.SubRows[0], 1, [periodDate]);
    });
  } else {
    // json structure is different when only one entry exists
    if (Array.isArray(data.data[0].SubRows)) {
      const allRows = data.data[0].SubRows[0];
      getRow(allRows);
    } else {
      const allRows = data.data[0].SubRows;
      getRow(allRows);
    }
  }

  return tableData;
};

export default getRowData;
