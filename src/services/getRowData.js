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
  const allRows = data.data[0].SubRows[0];
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

  getRow(allRows);

  return tableData;
};

export default getRowData;
