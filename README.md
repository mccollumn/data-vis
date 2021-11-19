# Webtrends Data Visualization

## Description

A React interface to explore and visualize Webtrends analytics data. All data is retrieved using the Webtrends Data Extraction v3 API.

## Live Demo

https://wt-data-vis.herokuapp.com/

[![Screenshot](/screenshot.png)](https://wt-data-vis.herokuapp.com/)

## Usage

Start by logging in to your Webtrends Analytics account, or enabling Demo Mode, from the menu in the top right. Once your credentials have been validated, select the desired profile, report, and report period from the drawer on the left.

A graph will populate with the top 5 entries from the selected report, with the full report data available in the table below. Click a cell in the table to trend that value on the graph. Data can be filtered and sorted by interacting with the heading of each column in the table.

Optionally, select the trend option when picking the report to trend the table data by day.

## Setup

- ```
  npm install
  npm run build
  npm start
  ```

- Navigate to:
  http://localhost:8080/

## Docs

- [Webtrends Data Extraction API](https://analytics.webtrends.help/docs/about-the-data-extraction-api)

- [AG Grid](https://www.ag-grid.com/react-data-grid/)

- [Nivo](https://nivo.rocks/)
