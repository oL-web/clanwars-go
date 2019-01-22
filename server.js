const path = require("path");
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const ms = require("times-in-milliseconds");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const log = require("./helpers/log");
const markersRoute = require("./routes/markers");
const usersRoute = require("./routes/users");
const User = require("./models/User");

const app = express();
const isProduction = app.get("env") === "production";
const { MONGO_USER, MONGO_PWD, MONGO_URI } = process.env;

mongoose.connect(
  MONGO_URI,
  {
    keepAlive: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    user: MONGO_USER,
    pass: MONGO_PWD
  }
);
mongoose.connection.once("open", () => log("Connected to MongoDB"));
mongoose.connection.on("error", log);

if (isProduction) app.set("trust proxy", 1);
app.use(helmet());
app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      autoRemove: "native",
      touchAfter: 900 // 15 mins
    }),
    name: "CWG_SID",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      maxAge: ms.WEEK,
      sameSite: true
    }
  })
);
app.use(express.static(path.join(__dirname, "dist")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/users", usersRoute);
app.use("/markers", markersRoute);

app.use((err, req, res, next) => {
  if (!isProduction) console.error(err);
  res.status(500).json({
    msg: err.message || "Error processing your request!"
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => log(`Express server listening on port ${port} in ${app.get("env")} mode`));
