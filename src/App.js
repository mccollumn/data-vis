import React from "react";
import { useForm } from "react-hook-form";
import _ from "lodash";
import "./App.css";
import { ResponsiveBar } from "@nivo/bar";
import LineGraph from "./components/LineGraph";
import getData from "./services/wtData";
import { dataBar } from "./data";
import { DisplayModal } from "./components/DisplayModal";
import Table from "./components/Table";
import TopNav from "./components/TopNav";
import { useGetData } from "./services/wtData";

function App() {
  // const [dataAPITrend, setDataAPITrend] = React.useState([]);
  // const [dataAPIAgg, setDataAPIAgg] = React.useState([]);

  const { response: dataAPITrend, makeRequest: trendMakeRequest } =
    useGetData();
  const { response: dataAPIAgg, makeRequest: aggMakeRequest } = useGetData();
  console.log("Agg response:", dataAPIAgg);
  console.log("Trend response:", dataAPITrend);

  const [profile, setProfile] = React.useState();
  const [report, setReport] = React.useState();
  const [startDate, setStartDate] = React.useState();
  const [endDate, setEndDate] = React.useState();

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
        period_type: "agg",
      };

      loadTrendReport(profileID, reportID, paramsTrend);
      loadAggReport(profileID, reportID, paramsAgg);
    },
    [loadAggReport, loadTrendReport]
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
      />
      <DisplayModal>
        <ModalAction />
        <InputForm loadReport={loadReport} />
      </DisplayModal>
      {/* <BarGraph data={dataBar} /> */}
      <LineGraph data={dataAPITrend} />
      <Table data={dataAPIAgg} />
    </div>
  );
}

const BarGraph = ({ data }) => {
  const dataBar = data;

  return (
    <div className="bar" style={{ height: "400px" }}>
      <ResponsiveBar data={dataBar} keys={["earnings"]} indexBy="quarter" />
    </div>
  );
};

const ModalAction = ({ onClick }) => {
  return (
    <button type="button" onClick={onClick} className="primary">
      Select Report
    </button>
  );
};

const InputForm = ({ loadReport, handleClose }) => {
  const API_ACCOUNT = process.env.REACT_APP_WT_API_ACCOUNT;
  const API_USERNAME = process.env.REACT_APP_WT_API_USERNAME;
  const API_PASSWORD = process.env.REACT_APP_WT_API_PASSWORD;

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const onSubmit = (values) => {
    loadReport(values);
    handleClose();
  };

  return (
    <div className="input-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Account Name"
          defaultValue={API_ACCOUNT}
          {...register("accountName", { required: true })}
        />

        <input
          type="text"
          placeholder="Username"
          defaultValue={API_USERNAME}
          {...register("username", { required: true })}
        />

        <input
          type="password"
          placeholder="Password"
          defaultValue={API_PASSWORD}
          {...register("password", { required: true })}
        />

        {errors.accountName && <span>Account name is required</span>}
        {errors.username && <span>Username is required</span>}
        {errors.password && <span>Password is required</span>}

        <button>Get Report</button>
      </form>
    </div>
  );
};

export default App;
