const availableHours = require("./bookingHours.json");

const getAvailableHoursForDate = (app, connection) => {
  app.post("/booking/availableHours", async function (request, response) {
    const dateString = request.body.date;
    const doctorId = request.body.doctorId;

    if (dateString) {
      let date;
      try {
        date = new Date(dateString);
      } catch {
        response.status(400).json({ message: "incorrect date string" });
        response.end();
      }
      const selectedDate = getFormatedDate(date);
      const startDate = `${selectedDate} 00:00:00.00`;
      const endDate = `${selectedDate} 23:59:59.999`;
      connection.query(
        "SELECT * FROM `reservation` WHERE (time BETWEEN ? AND ?) AND `doctorID` = ?",
        [startDate, endDate, doctorId],
        function (error, results) {
          if (error) throw error;
          else {
            const allHours = availableHours[`${date.getDay()}`];
            if (!results.length) {
              response.status(200).json({ hours: allHours });
            } else {
              const bookedHours = results.map((res) =>
                new Date(res.time).getHours()
              );
              const filtered = allHours.filter(
                (hour) => !bookedHours.includes(hour)
              );
              response.status(200).json({ hours: filtered });
            }
            response.end();
          }
        }
      );
    } else {
      response.status(400).json({ message: "incorrect date" });
      response.end();
    }
  });
};

const bookReservation = (app, connection) => {
  app.post("/booking/make", async function (request, response) {
    const dateString = request.body.date;
    const hour = request.body.hour;
    const userId = request.body.userId;
    const purpose = request.body.purpose;
    const doctorId = request.body.doctorId;

    if (dateString) {
      let date;
      try {
        date = new Date(dateString);
      } catch {
        response.status(400).json({ message: "incorrect date string" });
        response.end();
      }
      const selectedDate = `${getFormatedDate(date)} ${hour}:00:00.00`;

      console.log(doctorId, " nr. doc", purpose, " <-p");

      connection.query(
        "INSERT INTO `reservation` (`ID`, `time`, `patientID`, `doctorID`, `purpose`, `addInfo`) VALUES (NULL, ?, ?, ?, ?, ?)",
        [selectedDate, userId, doctorId, purpose, `-`],
        function (error, results, fields) {
          if (error) throw error;
          else {
            response.status(200).json({ message: `Ok` });
          }
          response.end();
        }
      );
    } else {
      response.status(400).json({ message: "incorrect date" });
      response.end();
    }
  });
};

const getFormatedDate = (date) => {
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  return date.toISOString().split("T")[0];
};

module.exports = (app, connection) => {
  getAvailableHoursForDate(app, connection);
  bookReservation(app, connection);
};
