const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

// CREATE INVENTORY
const createInventoryController = async (req, res) => {
  try {
    const { email } = req.body;
    //validation
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User Not Found");
    }
    // if (inventoryType === "in" && user.role !== "donor") {
    //   throw new Error("Not a donor account");
    // }
    // if (inventoryType === "Out" && user.role !== "hospital") {
    //   throw new Error("Not a hospital");
    // }

    if (req.body.inventoryType == "Out") {
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantityOfBlood = req.body.Quantity;
      const Organization = new mongoose.Types.ObjectId(req.body.userId);
      //calculate Blood Quanitity
      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            Organization,
            inventoryType: "In",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$Quantity" },
          },
        },
      ]);
      // console.log("Total In", totalInOfRequestedBlood);
      const totalIn= totalInOfRequestedBlood[0]?.total || 0;
      //calculate Out Blood Quanitity

      const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
        {
          $match: {
            Organization,
            inventoryType: "Out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$Quantity" },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

      //In& Out Calc
      const availableQuanityOfBloodGroup = totalIn- totalOut;
      //Quantity validation
      if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuanityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
        });
      }
      req.body.hospital = user?._id;
    } else {
      req.body.donor = user?._id;
    }

    //save record
    const inventory = new inventoryModel(req.body);
    await inventory.save();
    return res.status(201).send({
      success: true,
      message: "New Blood Record Added",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Errro InCreate Inventory API",
      error,
    });
  }
};

// GET ALL BLOOD RECORS
const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        Organization: req.body.userId,
      })
      .populate("donor")
      .populate("hospital")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      messaage: "get all records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error InGet All Inventory",
      error,
    });
  }
};
// GET Hospital BLOOD RECORS
const getInventoryHospitalController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find(req.body.filters)
      .populate("donor")
      .populate("hospital")
      .populate("Organization")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      messaage: "get hospital comsumer records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Get consumer Inventory",
      error,
    });
  }
};

//GET BLOOD RECORD OF 3
const getRecentInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        Organization: req.body.userId,
      })
      .limit(3)
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "recent Invenotry Data",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in recent Inventory API",
      error,
    });
  }
};

// GET donor REOCRDS
const getDonorsController = async (req, res) => {
  try {
    const Organization = req.body.userId;
    
    //find donors

    const donorId = await inventoryModel.distinct("donor", {
      Organization,
    });
     //console.log(donorId);
    const donors = await userModel.find({ _id: { $in: donorId } });

    return res.status(200).send({
      success: true,
      message: "donor Record Fetched Successfully",
      donors,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in donor records",
      error,
    });
  }
};

const getHospitalController = async (req, res) => {
  try {
    const Organization = req.body.userId;
    //GET HOSPITAL ID
    const hospitalId = await inventoryModel.distinct("hospital", {
      Organization,
    });
    //FIND HOSPITAL
    const hospitals = await userModel.find({
      _id: { $in: hospitalId },
    });
    return res.status(200).send({
      success: true,
      message: "Hospitals Data Fetched Successfully",
      hospitals,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in get Hospital API",
      error,
    });
  }
};

// GET ORG PROFILES
const getOrganizationController = async (req, res) => {
  try {
    const donor = req.body.userId;
    const orgId = await inventoryModel.distinct("Organization", { donor });
    //find org
    const Organizations = await userModel.find({
      _id: { $in: orgId },
    });
    return res.status(200).send({
      success: true,
      message: "Org Data Fetched Successfully",
      Organizations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in ORG API",
      error,
    });
  }
};
// GET ORG for Hospital
const getOrganizationForHospitalController = async (req, res) => {
  try {
    const hospital = req.body.userId;
    const orgId = await inventoryModel.distinct("Organization", { hospital });
    //find org
    const Organizations = await userModel.find({
      _id: { $in: orgId },
    });
    return res.status(200).send({
      success: true,
      message: "Hospital Org Data Fetched Successfully",
      Organizations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error InHospital ORG API",
      error,
    });
  }
};

module.exports = {
  createInventoryController,
   getInventoryController,
   getDonorsController,
   getHospitalController,
   getOrganizationController,
  getOrganizationForHospitalController,
  getInventoryHospitalController,
   getRecentInventoryController,
};
