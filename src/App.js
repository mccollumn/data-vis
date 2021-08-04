import React, { useCallback } from "react";
import "./App.css";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { getData } from "./services/wtData";
import { dataBar } from "./data";

function App() {
  const [dataAPI, setDataAPI] = React.useState([]);

  React.useEffect(() => {
    getData().then((data) => {
      console.log("useEffect data:", data);
      setDataAPI(data);
    });
  }, []);

  console.log("dataAPI:", dataAPI);

  return (
    <div className="App">
      <BarGraph data={dataBar} />
      <LineGraph data={dataAPI} />
    </div>
  );
}

const LineGraph = ({ data = [] }) => {
  console.log("LineGraph data prop:", data);

  const [dataLine, setDataLine] = React.useState([]);
  const [isPopulated, setIsPopulated] = React.useState(false);

  const getLineGraphData = useCallback(async (data) => {
    if (data.length === 0) return [];
    let graphData = [];
    for (let item of data.data) {
      let line = {};
      const pageName = Object.keys(item).pop();
      line.id = pageName;
      line.data = [];
      // line.color = "hsl(54, 70%, 50%)";

      const rows = item[pageName].SubRows;
      for (let row of rows) {
        let point = {};
        point.x = row.start_date;
        point.y = row.measures.Visits;
        line.data.push(point);
      }

      graphData.push(line);
    }
    console.log("graphData:", graphData);
    return graphData;
  }, []);

  React.useEffect(() => {
    if (!isPopulated) {
      getLineGraphData(data).then((data) => {
        console.log("getLineGraphData promise:", data);
        setDataLine(data);
        if (data.length > 0) setIsPopulated(true);
      });
      console.log("dataLine:", dataLine);
    }
  }, [data, dataLine, isPopulated, getLineGraphData]);

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

const BarGraph = ({ data }) => {
  const dataBar = data;

  return (
    <div className="bar" style={{ height: "400px" }}>
      <ResponsiveBar data={dataBar} keys={["earnings"]} indexBy="quarter" />
    </div>
  );
};

export default App;
