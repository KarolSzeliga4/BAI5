const jwt = require("jsonwebtoken");

module.exports.createToken = (payload, options) => {
  return jwt.sign(payload, process.env.JWT_TOKEN_KEY, options);
};

module.exports.decodeToken = (token) => {
  return jwt.verify(token, process.env.JWT_TOKEN_KEY);
};
