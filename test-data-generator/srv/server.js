const cds = require("@sap/cds");

const ORIGINS = { "https://*.eu10-004.hana.ondemand.com/**": 1 };
cds.on("bootstrap", async (app) => {
  console.log("CORS is working");
  app.use((req, res, next) => {
    const { origin } = req.headers;
    // standard request
    res.set("access-control-allow-origin", origin);
    // preflight request
    if (req.method === "OPTIONS")
      return res
        .set("access-control-allow-methods", "GET,HEAD,PUT,PATCH,POST,DELETE")
        .set("access-control-allow-headers", "*")
        .end();
    next();
  });
});
