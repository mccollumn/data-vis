import axios from "axios";

const WT_API_ENDPOINT =
  "https://ws.webtrends.com/v3/Reporting/profiles/113070/reports/oOEWQj3sUo6/";

const API_USERNAME = process.env.REACT_APP_WT_API_USERNAME;
const API_PASSWORD = process.env.REACT_APP_WT_API_PASSWORD;

export const getData = async () => {
  const params = {
    start_period: "current_day-7",
    end_period: "current_day-1",
    language: "en-US",
    format: "json",
    suppress_error_codes: false,
    range: 5,
    period_type: "trend",
  };
  const auth = { username: API_USERNAME, password: API_PASSWORD };
  try {
    const response = await axios.get(WT_API_ENDPOINT, {
      params: params,
      auth: auth,
    });
    console.log("Response:", response);
    return response.data;
  } catch (error) {
    console.log("Error", error);
  }
};
