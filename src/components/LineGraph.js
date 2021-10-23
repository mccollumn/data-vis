import React from "react";
import { ResponsiveLine } from "@nivo/line";

const LineGraph = ({ data = [], startDate, endDate }) => {
  const [dataLine, setDataLine] = React.useState([]);

  const getPrimaryMeasure = (data) => {
    if (!data.definition) return "";
    const measures = data.definition.measures;
    const measure =
      measures.find((element) => element.columnID === 0) || measures[0];
    return measure;
  };

  const getMeasureName = (measure) => {
    if (!measure) return "";
    return measure.name.replace(/([A-Z])/g, " $1").trim();
  };

  const formatPointLabels = (obj) => {
    return obj.point.data.yFormatted;
  };

  const shorten = (str, len = 20) => {
    if (str.length > len) {
      return `...${str.slice(-len - 3)}`;
    }
    return str;
  };

  React.useEffect(() => {
    const getLineGraphData = (data) => {
      if (!data.length && !data.data) return [];
      let graphData = [];
      for (const item of data.data) {
        let line = {};
        const itemName = Object.keys(item).pop();
        line.id = shorten(itemName);
        line.data = [];

        const recordPoint = (row) => {
          let point = {};
          point.x = row.start_date;
          point.y = row.measures[getPrimaryMeasure(data).name];
          line.data.push(point);
        };

        const rows = item[itemName].SubRows;
        // json structure is different when the trend only includes one day
        if (Array.isArray(rows)) {
          for (const row of rows) {
            recordPoint(row);
          }
        } else {
          recordPoint(rows);
        }

        graphData.push(line);
      }
      return graphData;
    };

    if (data.length === 0) return;
    setDataLine(getLineGraphData(data));
  }, [data]);

  return (
    <div className="Graph" style={{ marginBottom: 20 }}>
      <div className="line" style={{ height: "400px" }}>
        <ResponsiveLine
          data={dataLine}
          margin={{ top: 50, right: 60, bottom: 100, left: 60 }}
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
            orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 90,
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: getMeasureName(getPrimaryMeasure(data)),
            legendOffset: -40,
            legendPosition: "middle",
          }}
          pointSize={5}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          tooltip={formatPointLabels}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 80,
              itemsSpacing: 5,
              itemDirection: "left-to-right",
              itemWidth: 150,
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
