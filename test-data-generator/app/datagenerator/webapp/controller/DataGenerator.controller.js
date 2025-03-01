sap.ui.define(
  ["sap/ui/core/mvc/Controller"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller) {
    "use strict";

    // Section 1: Data Generator Controller 
    const baseUrl =
    "https://msgsystemsag-06-tum-praktika-shd-tdd-invalnos-data-gene245694e8.cfapps.eu10-004.hana.ondemand.com/odata/v4/test-data";
    var authorizationEndpoint =
      "https://tum-praktika-shared-sb-tdd.authentication.eu10.hana.ondemand.com/oauth/authorize";
    var tokenEndpoint =
      "https://tum-praktika-shared-sb-tdd.authentication.eu10.hana.ondemand.com/oauth/token";
    var clientId =
      "sb-data-generator-msgsystemsag-06-tum-praktika-shd-tdd-invalnos!t219625";
    var clientSecret = "fIXuXLI9lB+dFO+mwIiQD5dC9Iw=";
    var redirectUri =
    ("https://msgsystemsag-06-tum-praktika-shd-tdd-invalnos-data-generator.cfapps.eu10-004.hana.ondemand.com/app/datagenerator/webapp/index.html");

    var responseType = "code";

    var accessToken = null;

    // Function 1.1: Authorize via OAuth
    function authorize() {
      // Make a request to Node.js function
      // Step 1: Initiate the Authorization Request
      const authorizationUrl = `${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}`;

      // Redirect the user to the authorization URL
      window.location.href = authorizationUrl;
    }

    // Function 1.2: Generate Token for OAuth
    function generateToken(authorizationCode) {
      // Step 3: Exchange the Authorization Code for an Access Token
      if (authorizationCode) {
        const tokenRequestBody = {
          grant_type: "authorization_code",
          code: authorizationCode,
          redirect_uri: redirectUri,
          // Add other required parameters
        };

        $.ajax({
          url: tokenEndpoint,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
          },
          data: tokenRequestBody,
          success: function (data) {
            // Step 4: Handle the Access Token Response
            //console.log("Access Token:", data.access_token);
            // You can now use the access token for authenticated API requests
            accessToken = data.access_token;
          },
          error: function (error) {
            // Handle errors
            console.error("Error retrieving token:", error);
          },
        });
      } else {
        // Handle the case where there is no authorization code in the URL
        console.error("Authorization code not found in the URL.");
      }
    }

    return Controller.extend("project1.controller.View1", {
      // Function 1.3: On Initialization
      onInit: function () {
        //alert("Hello Ebin");
        var oModel = new sap.ui.model.json.JSONModel({
          isLoggedIn: false, // Initially, the user is not logged in
        });

        this.getView().setModel(oModel);

        const urlParams = new URLSearchParams(window.location.search);
        const authorizationCode = urlParams.get("code");
        if (authorizationCode != null) {
          generateToken(authorizationCode);
          this.getView().getModel().setProperty("/isLoggedIn", true);
        } else {
          //authorize();
        }
      },

      // Function 1.4: Generate test data
      generateData: function () {
        // Make a request to Node.js function
        var requestData = JSON.stringify({
          contractCount: parseInt(
            this.getView().byId("inputContractCount").getValue()
          ),
          contractCreationYearRange: parseInt(
            this.getView().byId("inputContractCreationYearRange").getValue()
          ),
          activeContractProb: parseFloat(
            this.getView().byId("inputActiveContractProb").getValue()
          ),
          lowerBoundContractDetailsCount: parseInt(
            this.getView()
              .byId("inputLowerBoundContractDetailsCount")
              .getValue()
          ),
          upperBoundContractDetailsCount: parseInt(
            this.getView()
              .byId("inputUpperBoundContractDetailsCount")
              .getValue()
          ),
          failureProb: parseFloat(
            this.getView().byId("inputFailureProb").getValue()
          ),
          timezone: this.getView().byId("inputTimezone").getValue(),
          reportingDuration: parseInt(
            this.getView().byId("inputReportingDuration").getValue()
          ),
          allowedDelay: parseInt(
            this.getView().byId("inputAllowedDelay").getValue()
          ),
          latenessProb: parseFloat(
            this.getView().byId("inputLatenessProb").getValue()
          ),
          neutralContractsProb: parseFloat(
            this.getView().byId("inputNeutralContractsProb").getValue()
          ),
          penalizedContractsProb: parseFloat(
            this.getView().byId("inputPenalizedContractsProb").getValue()
          ),
          outlierProb: parseFloat(
            this.getView().byId("inputOutlierProb").getValue()
          ),
          lowerBoundOutlierRValueVariance: parseFloat(
            this.getView()
              .byId("inputLowerBoundOutlierRValueVariance")
              .getValue()
          ),
          upperBoundOutlierRValueVariance: parseFloat(
            this.getView()
              .byId("inputUpperBoundOutlierRValueVariance")
              .getValue()
          ),
          lowerBoundNormalRValueVariance: parseFloat(
            this.getView()
              .byId("inputLowerBoundNormalRValueVariance")
              .getValue()
          ),
          upperBoundNormalRValueVariance: parseFloat(
            this.getView()
              .byId("inputUpperBoundNormalRValueVariance")
              .getValue()
          ),
          lowerBoundNOP: parseInt(
            this.getView().byId("inputLowerBoundNOP").getValue()
          ),
          upperBoundNOP: parseInt(
            this.getView().byId("inputUpperBoundNOP").getValue()
          ),
          lowerBoundR: parseInt(
            this.getView().byId("inputLowerBoundR").getValue()
          ),
          upperBoundR: parseInt(
            this.getView().byId("inputUpperBoundR").getValue()
          ),
          lowerBoundAS: parseInt(
            this.getView().byId("inputLowerBoundAS").getValue()
          ),
          upperBoundAS: parseInt(
            this.getView().byId("inputUpperBoundAS").getValue()
          ),
          lowerBoundVOG: parseInt(
            this.getView().byId("inputLowerBoundVOG").getValue()
          ),
          upperBoundVOG: parseInt(
            this.getView().byId("inputUpperBoundVOG").getValue()
          ),
          clientChangesEmailProb: parseFloat(
            this.getView().byId("inputClientChangesEmailProb").getValue()
          ),
          // Add other parameters as needed
        });
        console.log(requestData);

        $.ajax({
          url: baseUrl + "/generateData",
          type: "POST",
          headers: {
            Authorization: "Bearer " + accessToken,
          },
          contentType: "application/json",
          data: requestData,
          success: function (data) {
            alert("Data generation was successful!");
            console.log(data);
          },
          error: function (error) {
            alert("Error calling function: " + error.responseText);
            console.log(error);
          },
        });
      },

      // Function 1.5: Delete all test data
      resetDatabase: function () {
        // Make a request to Node.js function
        $.ajax({
          url: baseUrl + "/resetDatabase",
          type: "POST",
          headers: {
            Authorization: "Bearer " + accessToken,
            // Add other headers as needed
          },
          contentType: "application/json", // Set the content type to JSON
          //data: JSON.stringify({ contractCount : 3 }), // Pass your JSON data here
          success: function (data) {
            alert("Database reset was successful!");
            console.log(data);
          },
          error: function (error) {
            alert("Error calling function: " + error.responseText);
            console.log(error);
          },
        });
      },

      // Function 1.6: Login to Data Generator
      login: function () {
        authorize();
      },

      // Function 1.7: Logout from Data Generator
      logout: function () {
        // Clear all cookies
        var cookies = document.cookie.split("; ");
        for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i];
          var eqPos = cookie.indexOf("=");
          var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie =
            name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }

        // Clear all URL parameters
        history.replaceState({}, document.title, window.location.pathname);
        this.getView().getModel().setProperty("/isLoggedIn", false);
      },
    });
  }
);
