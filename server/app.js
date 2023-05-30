const http = require("http");
const runServer = require("./src/server.js");
const initConnection = require("./src/connection.js");
const setupUserRouter = require("./src/router/userRouter.js");
const setupBookingRouter = require("./src/router/bookingRouter.js");

(() => {
  const app = runServer();
  const conn = initConnection();
  setupUserRouter(app, conn);
  setupBookingRouter(app, conn);
})();
