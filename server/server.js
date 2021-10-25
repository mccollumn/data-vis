import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const PORT = 5000;
const app = express();

app.use(cors());
const corsOptions = {
  origin: "*",
};

const requestEndpoint = "https://ws.webtrends.com/v3/Reporting/profiles/";

app.get("/getData", cors(corsOptions), async (req, res) => {
  const { profileID = "", reportID = "", ...params } = req.query;
  const queryStr = new URLSearchParams(params);
  const authHeader = req.header("authorization");

  const url = !profileID
    ? requestEndpoint
    : `${requestEndpoint}${profileID}/reports/${reportID}?${queryStr}`;

  const fetchOptions = {
    method: "GET",
    headers: { Authorization: authHeader },
  };
  try {
    const response = await fetch(url, fetchOptions);

    if (response.status === 200) {
      const jsonResponse = await response.json();
      res.json(jsonResponse);
    } else {
      res.status(400).send();
    }
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT);
