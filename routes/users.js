const express = require("express");
const catchWrapper = require("../helpers/catchWrapper");
const userController = require("../controllers/userController");
const authUser = require("../middleware/authUser");
const { userActionsLimit } = require("../middleware/rateLimiters");
const router = express.Router();

router.post("/", catchWrapper(userController.createUser));

router.get("/logout", authUser, catchWrapper(userController.logoutUser));
router.post("/login", authUser, catchWrapper(userController.loginUser));
router.patch("/", authUser, userActionsLimit, catchWrapper(userController.handleUserActions));

router.post("/army/:armyId", authUser, catchWrapper(userController.handleArmyActions));
router.post("/items/:itemId", authUser, catchWrapper(userController.handleItemActions));

module.exports = router;
