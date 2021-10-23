import React from "react";
import "./App.css";
import LineGraph from "./components/LineGraph";
import Table from "./components/Table";
import TopNav from "./components/TopNav";
import ReportInfo from "./components/ReportInfo";
import { useGetData } from "./services/wtData";
import DateFnsUtils from "@date-io/date-fns";

function App() {
  const { response: dataAPITrend, makeRequest: trendMakeRequest } =
    useGetData();
  const { response: dataAPIAgg, makeRequest: aggMakeRequest } = useGetData();

  const dateFns = new DateFnsUtils({ dateFormat: "fullDate" });
  const createDateStr = (date) =>
    `${dateFns.getYear(date)}m${
      dateFns.getMonth(date) + 1
    }d${dateFns.getDayText(date)}`;

  const today = new Date();
  const dateObj = {
    startDate: { date: today, dateStr: createDateStr(today) },
    endDate: { date: today, dateStr: createDateStr(today) },
    createDateStr,
  };

  const [profile, setProfile] = React.useState();
  const [report, setReport] = React.useState();
  const [trend, setTrend] = React.useState("none");
  const [dates, setDates] = React.useState(dateObj);

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
    async (profileID, reportID) => {
      const paramsTrend = {
        start_period: dates.startDate.dateStr,
        end_period: dates.endDate.dateStr,
        language: "en-US",
        format: "json",
        suppress_error_codes: false,
        range: 5,
        period_type: "trend",
      };
      const paramsAgg = {
        start_period: dates.startDate.dateStr,
        end_period: dates.endDate.dateStr,
        language: "en-US",
        format: "json",
        suppress_error_codes: false,
        period_type: trend === "none" ? "agg" : "indv",
      };

      loadTrendReport(profileID, reportID, paramsTrend);
      loadAggReport(profileID, reportID, paramsAgg);
    },
    [
      loadAggReport,
      loadTrendReport,
      dates.startDate.dateStr,
      dates.endDate.dateStr,
      trend,
    ]
  );

  React.useEffect(() => {
    if (profile && report && dates.startDate.dateStr && dates.endDate.dateStr) {
      loadReport(profile.ID, report.ID);
    }
  }, [
    profile,
    report,
    dates.startDate.dateStr,
    dates.endDate.dateStr,
    loadReport,
  ]);

  return (
    <div className="App">
      <TopNav
        setProfile={setProfile}
        profile={profile}
        report={report}
        setReport={setReport}
        dates={dates}
        setDates={setDates}
        trend={trend}
        setTrend={setTrend}
      />
      <ReportInfo report={report} />
      <LineGraph
        data={dataAPITrend}
        startDate={dates.startDate.dateStr}
        endDate={dates.endDate.dateStr}
      />
      <Table
        data={dataAPIAgg}
        loadTrendReport={loadTrendReport}
        profileID={profile?.ID}
        trend={trend}
      />
    </div>
  );
}

export default App;
