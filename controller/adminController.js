const userModel = require("../models/userModel");
//Get Donor List
const getDonorsListController = async (req, res) => {
  try {
    const donorData = await userModel
      .find({ role: "donor" })
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      totalCount: donorData.length,
      message: "Donor List Fetched Successfully",
      donorData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Donor List API",
      error,
    });
  }
};

//get Hospital List
const getHospitalListController = async (req, res) => {
  try {
    const hospitalData = await userModel
      .find({ role: "hospital" })
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      totalCount: hospitalData.length,
      message: "Hospital List Fetched Successfully",
      hospitalData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Hospital List API",
      error,
    });
  }
};
//get Org List
const getOrgListController = async (req, res) => {
  try {
    const orgData = await userModel
      .find({ role: "organization" })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      TotalCount: orgData.length,
      message: "ORG List Fetched Successfully",
      orgData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In ORG List API",
      error,
    });
  }
};

//////////:::DELETE~CONTROLLER::://///////////

//delete donor function
const deleteDonorController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      success: true,
      message: "Record Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Delete Action",
      error,
    });
  };}
//export
module.exports = {
  getDonorsListController,
  getHospitalListController,
  getOrgListController,
  deleteDonorController,
  
};
