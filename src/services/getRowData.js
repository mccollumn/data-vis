const getRowData = (data) => {
  if (data.length === 0) return [];
  const allRows = data.data[0].SubRows[0];
  let tableData = [];

  const getRow = (obj, level = 0, prevColValues = []) => {
    Object.keys(obj).forEach((entry) => {
      let newColValues = prevColValues;
      newColValues[level] = entry;
      newColValues.length = level + 1;

      const row = { Dimensions: newColValues.slice() };

      // if (obj[entry].attributes) {
      //   for (const [attrib, value] of Object.entries(obj[entry].attributes)) {
      //     row[attrib] = value;
      //   }
      // }

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
