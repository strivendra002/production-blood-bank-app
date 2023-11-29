//Get Blood Data
const mongoose = require("mongoose")
const inventoryModel = require("../models/inventoryModel");

const bloodGroupDetailsController = async (req,res)=>{
    try{
        const bloodGroups = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
        const bloodGroupData = [];
        const Organization = new mongoose.Types.ObjectId(req.body.userId);

        //Get Single Blood Group
        await Promise.all(bloodGroups.map(async(bloodGroup)=>{
            //Count Total In
            const totalIn = await inventoryModel.aggregate([
                {
                    $match:{
                        bloodGroup:bloodGroup,
                        inventoryType:"In",
                        Organization
                    },
                },
                {
                    $group:{
                        _id:null , 
                        total:{$sum:"$Quantity"}
                    },
                },
            ]);
            //Count Total Out
            const totalOut = await inventoryModel.aggregate([
                {
                    $match:{
                        bloodGroup:bloodGroup,
                        inventoryType:"Out",
                        Organization
                    },
                },
                {
                    $group:{
                        _id:null , 
                        total:{$sum:"$Quantity"}
                    },
                },
            ]);
             //CALCULATE TOTAL
        const availableBlood =
        (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);

      //PUSH DATA
      bloodGroupData.push({
        bloodGroup,
        totalIn: totalIn[0]?.total || 0,
        totalOut: totalOut[0]?.total || 0,
        availableBlood,
      });
        },));
        
        return res.status(200).send({
            success:true,
            message:"Blood Group Data Fetched Successfully",
            bloodGroupData
        })
    }catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error In Blood Group Data Analytics API",
            error
        })
    }
}

module.exports ={bloodGroupDetailsController}