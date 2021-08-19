import axios from "axios";

const WT_API_ENDPOINT = "https://ws.webtrends.com/v3/Reporting/profiles/";

const API_ACCOUNT = process.env.REACT_APP_WT_API_ACCOUNT;
const API_USERNAME = process.env.REACT_APP_WT_API_USERNAME;
const API_PASSWORD = process.env.REACT_APP_WT_API_PASSWORD;

const getData = async (creds, params, profileID, reportID = "") => {
  try {
    const auth = {
      // username: `${creds.accountName}\\${creds.username}`,
      // password: creds.password,
      username: `${API_ACCOUNT}\\${API_USERNAME}`,
      password: API_PASSWORD,
    };
    const url = !profileID
      ? WT_API_ENDPOINT
      : `${WT_API_ENDPOINT}${profileID}/reports/${reportID}`;
    const response = await axios.get(url, {
      params: params,
      auth: auth,
    });
    console.log("Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error", error);
  }
};

export default getData;
