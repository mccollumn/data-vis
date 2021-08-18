import React from "react";
import { ResponsiveLine } from "@nivo/line";

const LineGraph = ({ data = [] }) => {
  const [dataLine, setDataLine] = React.useState([]);

  const getLineGraphData = (data) => {
    if (data.length === 0) return [];
    let graphData = [];
    for (const item of data.data) {
      let line = {};
      const pageName = Object.keys(item).pop();
      line.id = pageName;
      line.data = [];
      // line.color = "hsl(54, 70%, 50%)";

      const rows = item[pageName].SubRows;
      for (const row of rows) {
        let point = {};
        point.x = row.start_date;
        point.y = row.measures.Visits;
        line.data.push(point);
      }

      graphData.push(line);
    }
    return graphData;
  };

  React.useEffect(() => {
    setDataLine(getLineGraphData(data));
  }, [data]);

  return (
    <div className="App">
      <div className="line" style={{ height: "400px" }}>
        <ResponsiveLine
          data={dataLine}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: true,
            reverse: false,
          }}
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "transportation",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "count",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          pointSize={10}
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
