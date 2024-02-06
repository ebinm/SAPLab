# Getting Started (deployed)

This is the CAP project to generate test data for our the InValNoS dashboard.

| File or Folder   | Purpose                                   |
| ---------------- | ----------------------------------------- |
| `app/`         | content for UI frontend                   |
| `db/`          | domain models                             |
| `srv/`         | service models and code                   |
| `test/`        | http files to test/access the endpoints   |
| `package.json` | project metadata and configuration        |
| `mta.yaml`     | multi-app configuration for deployment    |

## Next Steps

- Install the following necessary prequisites to run/edit this project:
  - VS Code
    - SAP CDS Language Support extension
    - REST Client extension (or Postman, for easy endpoints access)
  - Node.js
- Run `npm install` in the project's root directory to install the necessary libraries for this project

## How To Use

- Run `cds watch` in the project's root to start a local CAP server and utilize the in-memory SQlite database
- Navigate to the file `test/testdata-service.http` and start generating fake test data for InValNoS!

## Learn More

Learn more at these links:

- CAP Cookbook: [https://cap.cloud.sap/docs/get-started/](https://cap.cloud.sap/docs/get-started/)
- [https://developers.sap.com/tutorials/btp-app-prepare-dev-environment-cap.html](https://developers.sap.com/tutorials/btp-app-prepare-dev-environment-cap.html)
