const userModel = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.body.userId);
    //check Admin
    if (user?.role !== "admin") {
      return res.status(401).send({
        success: false,
        message: "Auth Failed",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Auth Failed- Admin API",
      error,
    });
  }
};
