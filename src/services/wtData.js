import axios from "axios";

const WT_API_ENDPOINT =
  "https://ws.webtrends.com/v3/Reporting/profiles/113070/reports/oOEWQj3sUo6/";

const API_USERNAME = process.env.REACT_APP_WT_API_USERNAME;
const API_PASSWORD = process.env.REACT_APP_WT_API_PASSWORD;

const getData = async (creds, params) => {
  const auth = {
    username: `${creds.accountName}\\${creds.username}`,
    password: creds.password,
  };
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

export default getData;
