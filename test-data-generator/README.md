# Getting Started

This is the project to generate the test data for our the InValNoS dashboard.
It contains these folders and files, following the recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends
`db/` | domain models and data
`srv/` | service models and code
`package.json` | project metadata and configuration
`readme.md` | this getting started guide

## Next Steps

- Install the following necessary prequisites to run/edit this project:
  - VS Code and the SAP CDS Language Support extension
  - Node.js
  - CAP tooling via `npm install --global @sap/cds-dk`
  - TODO: did I forget something?
- Open a new terminal, navigate to this project's root directory  and run:
  - `npm install` to install the necessary libraries for this project
  - `cds watch` to start a local CAP server and utilize the in-memory SQlite database in place of the SAP HANA database (in VS Code simply choose _**Terminal** > Run Task > cds watch_)

## Learn More

Learn more at these links:

- CAP Cookbook: <https://cap.cloud.sap/docs/get-started/>
- <https://developers.sap.com/tutorials/btp-app-prepare-dev-environment-cap.html>
