import React from "react";
import { ResponsiveLine } from "@nivo/line";

const LineGraph = ({ data = [], startDate, endDate }) => {
  const [dataLine, setDataLine] = React.useState([]);

  const getPrimaryMeasure = (data) => {
    if (!data.definition) return "";
    const measures = data.definition.measures;
    return measures.find((element) => element.columnID === 0);
  };

  let monthArray = [];
  const formatDate = (dateStr) => {
    const day = dateStr.slice(8);
    const month = dateStr.slice(5, 7);
    const startMonth = startDate.slice(5, 7);
    const endMonth = endDate.slice(5, 7);
    const rangeMonths = endMonth - startMonth;
    if (rangeMonths === 0) {
      return day;
    }
    if (monthArray.includes(month)) {
      return "-";
    }
    monthArray.push(month);
    return month;
  };

  const getLineGraphData = (data) => {
    if (data.length === 0) return [];
    let graphData = [];
    for (const item of data.data) {
      let line = {};
      const itemName = Object.keys(item).pop();
      line.id = itemName;
      line.data = [];

      const rows = item[itemName].SubRows;
      for (const row of rows) {
        let point = {};
        point.x = row.start_date;
        point.y = row.measures[getPrimaryMeasure(data).name];
        line.data.push(point);
      }

      graphData.push(line);
    }
    return graphData;
  };

  React.useEffect(() => {
    if (data.length === 0) return;
    setDataLine(getLineGraphData(data));
  }, [data]);

  console.log("Line Data:", dataLine);

  return (
    <div className="Graph" style={{ marginBottom: 20 }}>
      <div className="line" style={{ height: "400px" }}>
        <ResponsiveLine
          data={dataLine}
          // curve="basis"
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{
            type: "time",
            format: "%Y-%m-%d",
            useUTC: false,
            precision: "day",
          }}
          xFormat="time:%Y-%m-%d"
          yScale={{
            type: "linear",
            min: 0,
            max: "auto",
            stacked: false,
            reverse: false,
          }}
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            format: "%b %d",
            tickvalues: "every 2 days",

            // format: (value) => {
            //   return formatDate(value);
            // },

            orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 90,
            // // legend: "transportation",
            // legendOffset: 36,
            // legendPosition: "middle",
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: getPrimaryMeasure(data).name,
            legendOffset: -40,
            legendPosition: "middle",
          }}
          pointSize={5}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
};

export default LineGraph;
