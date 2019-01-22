const express = require("express");
const catchWrapper = require("../helpers/catchWrapper");
const markerController = require("../controllers/markerController");
const authUser = require("../middleware/authUser");
const router = express.Router();

router.get("/", authUser, catchWrapper(markerController.getMarkers));
router.post("/", authUser, catchWrapper(markerController.setMarkers));
router.get("/:placeId", authUser, catchWrapper(markerController.getMarkerByPlaceId));
router.patch("/", authUser, catchWrapper(markerController.handleMarkerActions));
router.patch("/:placeId", authUser, catchWrapper(markerController.handleMarkerActions));

module.exports = router;
