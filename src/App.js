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

function App() {
  const [dataAPITrend, setDataAPITrend] = React.useState([]);
  const [dataAPIAgg, setDataAPIAgg] = React.useState([]);

  const loadTrendReport = async (values, params) => {
    console.log(values);
    const data = await getData(values, params);
    setDataAPITrend(data);
    console.log("dataAPITrend:", data);
  };

  const loadAggReport = async (values, params) => {
    console.log(values);
    const data = await getData(values, params);
    setDataAPIAgg(data);
    console.log("dataAPIAgg:", data);
  };

  const loadReport = async (values) => {
    const paramsTrend = {
      start_period: "current_day-365",
      end_period: "current_day-1",
      language: "en-US",
      format: "json",
      suppress_error_codes: false,
      range: 5,
      period_type: "trend",
    };
    const paramsAgg = {
      start_period: "current_day-365",
      end_period: "current_day-1",
      language: "en-US",
      format: "json",
      suppress_error_codes: false,
      range: 5,
      period_type: "agg",
    };

    loadTrendReport(values, paramsTrend);
    loadAggReport(values, paramsAgg);
  };

  return (
    <div className="App">
      <DisplayModal>
        <ModalAction />
        <InputForm loadReport={loadReport} />
      </DisplayModal>
      {/* <BarGraph data={dataBar} /> */}
      <LineGraph data={dataAPITrend} />
      <Table />
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

const InputElement = ({ register, errors = {}, ...props }) => {
  const errorMsg = _.get(errors[props.name], "message");
  return (
    <div className="input-element">
      <input ref={register} {...props} />
      <div className="error-msg">{errorMsg}</div>
    </div>
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
        {/* <InputElement
          type="text"
          placeholder="Account Name"
          name="account"
          register={register({
            required: "Please enter an account",
          })}
          errors={errors}
        /> */}

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
