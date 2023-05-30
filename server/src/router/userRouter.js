const { hashPassword, comparePassword } = require("../password.js");
const { createToken, decodeToken } = require("../token.js");

const register = (app, connection) => {
  app.post("/auth/register", async function (request, response) {
    let username = request.body.email;
    let password = request.body.password;
    let phoneNumber = request.body.phoneNumber;
    let name = request.body.nameSurname;
    const hashedPassword = await hashPassword(password);

    console.log(name, "name");

    if (username && password && phoneNumber) {
      connection.query(
        "SELECT * FROM `patient` WHERE `login` = ?",
        [username],
        function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            response
              .status(400)
              .json({ message: "Konto o podanym mail już istnieje" });
            response.end();
          } else {
            connection.query(
              "INSERT INTO `patient`(`ID`, `login`, `password`, `phoneNumber`, `name`) VALUES ('',?,?,?,?)",
              [username, hashedPassword, phoneNumber, name],
              function (error, results, fields) {
                if (error) throw error;
                else {
                  response.status(200).json({
                    message: "Konto utworzone poprawnie! Zaloguj się",
                  });
                }
                response.end();
              }
            );
          }
        }
      );
    } else {
      response.status(400).json({ message: "Proszę podać wymagane dane" });
      response.end();
    }
  });
};

const login = (app, connection) => {
  app.post("/auth/login", async function (request, response) {
    let username = request.body.email;
    let password = request.body.password;

    if (username && password) {
      connection.query(
        "SELECT * FROM `patient` WHERE `login` = ?",
        [username],
        async function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            let compared = await comparePassword(password, results[0].password);
            console.log("sprawdzanie: ", compared);
            if (compared) {
              const token = createToken(
                { ...results[0] },
                {
                  expiresIn: "2h",
                }
              );
              console.log(results[0]);
              response.status(200).json({
                token: token,
                message: "Zalogowano!",
                user: {
                  id: results[0].ID,
                  login: results[0].login,
                  phoneNumber: results[0].phoneNumber,
                  name: results[0].name,
                },
              });
            } else
              response
                .status(400)
                .json({ message: "Niepoprawna nazwa użytkonika / hasło!" });
          } else {
            response
              .status(400)
              .json({ message: "Niepoprawna nazwa użytkonika / hasło!" });
          }
          response.end();
        }
      );
    } else {
      response
        .status(400)
        .json({ message: "Proszę wprowadzić dane do logowania!" });
      response.end();
    }
  });
};

const test = (app, connection) => {
  app.post("/auth/test", async function (request, response) {
    const tok = decodeToken(request.body.token);
    console.log("token: ", tok);
    response.status(200).json({ message: "Token ok" });
    response.end();
  });
};

const list = (app, connection) => {
  app.post("/bookingList", async function (request, response) {
    let patientID = request.body.id;
    let date;

    if (patientID) {
      connection.query(
        "SELECT * FROM `reservation` INNER JOIN `doctor` ON reservation.doctorID = doctor.ID WHERE `patientID` = ?",
        [patientID],
        function (error, results, fields) {
          if (error) throw error;
          response.status(200).json({
            data: results,
          });

          response.end();
        }
      );
    } else {
      response.status(400).json({ message: "Missing user!" });
      response.end();
    }
  });
};
module.exports = (app, connection) => {
  register(app, connection);
  login(app, connection);
  test(app, connection);
  list(app, connection);
};
