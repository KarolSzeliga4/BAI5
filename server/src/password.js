const bcrypt = require("bcryptjs");

module.exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(parseInt(process.env.PASSWORD_SALT));
  return await bcrypt.hash(password, salt);
};

module.exports.comparePassword = async (password, hash) => {
  let a = await bcrypt.compare(password, hash);
  return a;
};
