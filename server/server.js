import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { dirname } from "dirname-filename-esm";
import fs from "fs";

const __dirname = dirname(import.meta);

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.use(cors());
const corsOptions = {
  origin: "*",
};

const requestEndpoint = "https://ws.webtrends.com/v3/Reporting/profiles/";

app.get("/getData", cors(corsOptions), async (req, res) => {
  console.log("Get Data: ", req.query);
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

app.get("/getFile", cors(corsOptions), async (req, res) => {
  const { filename, dir } = req.query;
  try {
    fs.readFile(
      path.resolve(__dirname, "../client/src/data/", dir, filename),
      { encoding: "utf8" },
      (error, data) => {
        if (error) {
          res.send(error);
        }
        res.send(JSON.parse(data));
      }
    );
  } catch (error) {
    console.error(error);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(PORT);
