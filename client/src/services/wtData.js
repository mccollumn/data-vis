import axios from "axios";
import React from "react";
import { AuthContext } from "../providers/AuthProvider";
import { profiles } from "../data/profiles";
import { reports } from "../data/reports";

const WT_API_ENDPOINT = "/getData";
const DEMO_FILES_ENDPOINT = "/getFile";

export const useGetData = () => {
  const [response, setResponse] = React.useState();
  const [loading, setLoading] = React.useState();
  const [error, setError] = React.useState();
  const [status, setStatus] = React.useState();
  const { auth, demoMode } = React.useContext(AuthContext);

  const getDemoData = React.useCallback(async (params, profileID, reportID) => {
    setLoading(true);
    if (!profileID && !reportID) {
      setResponse(profiles);
      setStatus("200");
    } else if (!reportID) {
      setResponse(reports);
      setStatus("200");
    } else {
      let type = params.period_type;
      if (params.range === 5) {
        type = "trend_5";
      }

      const reportObj = reports.find((report) => report.ID === reportID);
      const file = `${reportObj.name.replaceAll(
        /<|>|:|\\|\/|\||\?|\*/g,
        "-"
      )}.json`;

      const response = await axios.get(DEMO_FILES_ENDPOINT, {
        params: { filename: file, dir: type, ...params },
      });
      setResponse(response.data);
      setStatus(response.status);
    }
    setLoading(false);
  }, []);

  const makeRequest = React.useCallback(
    async ({ params, profileID = "", reportID = "", creds }) => {
      if (demoMode) return getDemoData(params, profileID, reportID);
      const loginCredentials = creds || auth;
      if (!loginCredentials) return;
      try {
        const url = !profileID
          ? WT_API_ENDPOINT
          : `${WT_API_ENDPOINT}?profileID=${profileID}&reportID=${reportID}`;

        setLoading(true);

        const response = await axios.get(url, {
          params: params,
          auth: loginCredentials,
        });
        setResponse(response.data);
        setStatus(response.status);
        setLoading(false);
      } catch (error) {
        setError(error);
        setStatus(error.response.status);
        console.error("Error Retrieving Data:", error);
      }
    },
    [auth, demoMode, getDemoData]
  );

  return { response, loading, error, status, makeRequest };
};
