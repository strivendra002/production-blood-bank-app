const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  bloodGroupDetailsController,
} = require("../controller/analyticsController");
const router = express.Router();

//routes

//GET Blood Data RECORDS
router.get("/bloodGroups-data", authMiddleware, bloodGroupDetailsController);

module.exports = router;
