import React from "react";
import _ from "lodash";
import "./App.css";
import LineGraph from "./components/LineGraph";
import Table from "./components/Table";
import TopNav from "./components/TopNav";
import { useGetData } from "./services/wtData";

function App() {
  const { response: dataAPITrend, makeRequest: trendMakeRequest } =
    useGetData();
  const { response: dataAPIAgg, makeRequest: aggMakeRequest } = useGetData();
  console.log("Agg response:", dataAPIAgg);
  console.log("Trend response:", dataAPITrend);

  const [profile, setProfile] = React.useState();
  const [report, setReport] = React.useState();
  const [startDate, setStartDate] = React.useState();
  const [endDate, setEndDate] = React.useState();
  const [trend, setTrend] = React.useState("none");

  const loadTrendReport = React.useCallback(
    async (profileID, reportID, params) => {
      trendMakeRequest({ params, profileID, reportID });
    },
    [trendMakeRequest]
  );

  const loadAggReport = React.useCallback(
    async (profileID, reportID, params) => {
      aggMakeRequest({ params, profileID, reportID });
    },
    [aggMakeRequest]
  );

  const loadReport = React.useCallback(
    async (profileID, reportID, startDate, endDate) => {
      const start = startDate.replace("-", "m").replace("-", "d");
      const end = endDate.replace("-", "m").replace("-", "d");

      const paramsTrend = {
        start_period: start,
        end_period: end,
        language: "en-US",
        format: "json",
        suppress_error_codes: false,
        range: 5,
        period_type: "trend",
      };
      const paramsAgg = {
        start_period: start,
        end_period: end,
        language: "en-US",
        format: "json",
        suppress_error_codes: false,
        period_type: trend === "none" ? "agg" : "indv",
      };

      loadTrendReport(profileID, reportID, paramsTrend);
      loadAggReport(profileID, reportID, paramsAgg);
    },
    [loadAggReport, loadTrendReport, trend]
  );

  React.useEffect(() => {
    if (profile && report && startDate && endDate) {
      loadReport(profile.ID, report.ID, startDate, endDate);
    }
  }, [profile, report, startDate, endDate, loadReport]);

  return (
    <div className="App">
      <TopNav
        setProfile={setProfile}
        profile={profile}
        setReport={setReport}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        trend={trend}
        setTrend={setTrend}
      />
      <LineGraph data={dataAPITrend} startDate={startDate} endDate={endDate} />
      <Table data={dataAPIAgg} />
    </div>
  );
}

export default App;
