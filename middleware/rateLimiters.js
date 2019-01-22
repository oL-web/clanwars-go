const rateLimit = require("express-rate-limit");
const ms = require("times-in-milliseconds");
const MongoStore = require("rate-limit-mongo");
const { MONGO_USER, MONGO_PWD, MONGO_URI } = process.env;

const store = new MongoStore({
  uri: MONGO_URI,
  user: MONGO_USER,
  password: MONGO_PWD,
  expireTimeMs: ms.MINUTE,
  resetExpireDateOnChange: true
});

module.exports.userActionsLimit = rateLimit({
  max: 1,
  message: { msg: "Only one request per minute is allowed!" },
  store
});
