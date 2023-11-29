const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getDonorsListController,
  getHospitalListController,
  getOrgListController,
  deleteDonorController,
} = require("../controller/adminController");
const adminMiddleWare = require("../middlewares/adminMiddleWare");

//router object
const router = express.Router();
//routes

//Get|| Donor List
router.get(
  "/donor-list",
  authMiddleware,
  adminMiddleWare,
  getDonorsListController
);
//Get|| Hospital List
router.get(
  "/hospital-list",
  authMiddleware,
  adminMiddleWare,
  getHospitalListController
);
//Get|| Hospital List
router.get("/org-list", authMiddleware, adminMiddleWare, getOrgListController);

//////////:::||DEleTE~DoNor~GeT||::://////////
router.delete(
  "/delete-donor/:id",
  authMiddleware,
  adminMiddleWare,
  deleteDonorController
);

//////////:::DeLeTe HoSpiTal Get::://///////
router.delete(
  "/delete-hospital/:id",
  authMiddleware,
  adminMiddleWare,
  deleteDonorController
);
router.delete(
  "/delete-org/:id",
  authMiddleware,
  adminMiddleWare,
  deleteDonorController
);
//export
module.exports = router;
