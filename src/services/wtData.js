import axios from "axios";

const WT_API_ENDPOINT = "https://ws.webtrends.com/v3/Reporting/profiles/";

// const API_ACCOUNT = process.env.REACT_APP_WT_API_ACCOUNT;
// const API_USERNAME = process.env.REACT_APP_WT_API_USERNAME;
// const API_PASSWORD = process.env.REACT_APP_WT_API_PASSWORD;

const getData = async (auth, params, profileID, reportID = "") => {
  try {
    const url = !profileID
      ? WT_API_ENDPOINT
      : `${WT_API_ENDPOINT}${profileID}/reports/${reportID}`;
    const response = await axios.get(url, {
      params: params,
      auth: auth,
    });
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error", error);
    return error;
  }
};

export default getData;
