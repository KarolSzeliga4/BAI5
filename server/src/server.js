const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");

module.exports = runServer = () => {
  const app = express();
  setupEnv();
  setupCors(app);
  setupBodyParser(app);
  setupStaticAssets(app);
  setupServer(app);
  return app;
};

const setupBodyParser = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(require("body-parser").text());
};

const setupStaticAssets = (app) => {
  const serveStatic = require("serve-static");
  app.use(serveStatic("../bookuj/dist"));
};

const setupServer = (app) => {
  const hostname = "127.0.0.1";
  const port = parseInt(process.env.PORT) || 3000;

  app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
};

const setupEnv = () => {
  dotenv.config();
};

const setupCors = (app) => {
  app.use(function (request, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    response.setHeader(
      "Access-Control-Allow-Headers",
      "x-access-token,content-type"
    );
    response.setHeader("Access-Control-Allow-Credentials", "true");

    next();
  });
};
