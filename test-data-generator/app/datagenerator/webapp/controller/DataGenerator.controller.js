sap.ui.define(
    ["sap/ui/core/mvc/Controller"],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        const baseUrl =
            "https://msgsystemsag-06-tum-praktika-shd-tdd-invalnos-data-gene245694e8.cfapps.eu10-004.hana.ondemand.com/odata/v4/test-data";
        var authorizationEndpoint =
            "https://tum-praktika-shared-sb-tdd.authentication.eu10.hana.ondemand.com/oauth/authorize";
        var tokenEndpoint =
            "https://tum-praktika-shared-sb-tdd.authentication.eu10.hana.ondemand.com/oauth/token";
        var clientId =
            "sb-data-generator-msgsystemsag-06-tum-praktika-shd-tdd-invalnos!t219625";
        var clientSecret = "fIXuXLI9lB+dFO+mwIiQD5dC9Iw=";
        var redirectUri = "https://msgsystemsag-06-tum-praktika-shd-tdd-invalnos-data-generator.cfapps.eu10-004.hana.ondemand.com/app/datagenerator/webapp/index.html";

        var responseType = "code";

        //const baseUrl = "http://localhost:4004/odata/v4/test-data"
        //var redirectUri = "http://localhost:4004/project1/webapp/index.html";

        var accessToken = null;

        function authorize() {
            // Make a request to Node.js function
            // Step 1: Initiate the Authorization Request
            const authorizationUrl = `${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}`;

            // Redirect the user to the authorization URL
            window.location.href = authorizationUrl;
        }

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
                        console.log("Access Token:", data.access_token);
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
            onInit: function () {
                //alert("Hello Ebin");
                const urlParams = new URLSearchParams(window.location.search);
                const authorizationCode = urlParams.get("code");
                if (authorizationCode != null) {
                    generateToken(authorizationCode);
                } else {
                    //authorize();
                }
            },

            generateData: function () {
                // Make a request to Node.js function
                $.ajax({
                    url: baseUrl + "/generateData",
                    type: "POST",
                    headers: {
                        Authorization: "Bearer " + accessToken,
                        // Add other headers as needed
                    },
                    contentType: "application/json", // Set the content type to JSON
                    data: JSON.stringify({ contractCount: 1000 }), // Pass your JSON data here
                    success: function (data) {
                        console.log("Function called successfully!");
                        console.log(data);
                    },
                    error: function (error) {
                        console.log("Error calling function: " + error.responseText);
                        console.log(error);
                    },
                });

                $.ajax({
                    url: baseUrl + "/InsuranceContract",
                    type: "GET",
                    headers: {
                        Authorization: "Bearer " + accessToken,
                        // Add other headers as needed
                    },
                    success: function (data) {
                        console.log("Function called successfully!");
                        console.log(data);
                    },
                    error: function (error) {
                        console.log("Error calling function: " + error.responseText);
                        console.log(error);
                    },
                });
            },

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
                        console.log("Function called successfully!");
                        console.log(data);
                    },
                    error: function (error) {
                        console.log("Error calling function: " + error.responseText);
                        console.log(error);
                    },
                });

                $.ajax({
                    url: baseUrl + "/InsuranceContract",
                    type: "GET",
                    headers: {
                        Authorization: "Bearer " + accessToken,
                        // Add other headers as needed
                    },
                    success: function (data) {
                        console.log("Function called successfully!");
                        console.log(data);
                    },
                    error: function (error) {
                        console.log("Error calling function: " + error.responseText);
                        console.log(error);
                    },
                });
            },

            login: function () {

                authorize();

            },
        });
    }
);

