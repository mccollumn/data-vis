import axios from "axios";
import React from "react";
import { AuthContext } from "../providers/AuthProvider";

const WT_API_ENDPOINT = "https://ws.webtrends.com/v3/Reporting/profiles/";

export const useGetData = () => {
  const [response, setResponse] = React.useState();
  const [loading, setLoading] = React.useState();
  const [error, setError] = React.useState();
  const [status, setStatus] = React.useState();
  const { auth } = React.useContext(AuthContext);

  const makeRequest = React.useCallback(
    async ({ params, profileID = "", reportID = "", creds }) => {
      const loginCredentials = creds || auth;
      if (!loginCredentials) return;
      try {
        const url = !profileID
          ? WT_API_ENDPOINT
          : `${WT_API_ENDPOINT}${profileID}/reports/${reportID}`;

        setLoading(true);

        const response = await axios.get(url, {
          params: params,
          auth: loginCredentials,
        });
        setResponse(response.data);
        setStatus(response.status);
        setLoading(false);

        console.log("useGetData:", response);
      } catch (error) {
        setError(error);
        console.error("Error", error);
      }
    },
    [auth]
  );

  return { response, loading, error, status, makeRequest };
};
