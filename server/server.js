import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { dirname } from "dirname-filename-esm";

const __dirname = dirname(import.meta);

const PORT = 8080;
const app = express();

app.use(express.static(path.resolve(__dirname, "../build")));

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
      res.status(response.status).send();
    }
  } catch (error) {
    console.error(error);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../build", "index.html"));
});

app.listen(PORT);
