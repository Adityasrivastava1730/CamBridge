const Camera = require("../models/Camera");
const User = require("../models/User");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");


// Generate Pair Code

const generatePairCode = ()=>{

    return `CAM-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

};





// ADD CAMERA

const addCamera = async(req,res)=>{

    try{

        const { cameraName, streamUrl } = req.body;

        if (!cameraName || !cameraName.trim()) {
            return res.status(400).json({ message:"Camera name is required" });
        }



        const camera = await Camera.create({

            userId:req.user.id,

            cameraName,

            streamUrl,

            status: "offline",

            pairCode: generatePairCode(),

            isConnected:false

        });



        res.status(201).json({

            message:"Camera added successfully",

            camera

        });


    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};








// GET CAMERAS

const getCameras = async(req,res)=>{

    try{

        const cameras = await Camera.find({

            userId:req.user.id

        });


        res.status(200).json(cameras);


    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};








// DELETE CAMERA

const deleteCamera = async(req,res)=>{

    try{


        const camera =
        await Camera.findOneAndDelete({

            _id:req.params.id,

            userId:req.user.id

        });



        if(!camera){

            return res.status(404).json({

                message:"Camera not found"

            });

        }



        res.json({

            message:"Camera deleted successfully"

        });



    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};









// UPDATE CAMERA

const updateCamera = async(req,res)=>{

    try{

        const { cameraName } = req.body;

        if (!cameraName || !cameraName.trim()) {
            return res.status(400).json({ message:"Camera name is required" });
        }

        const camera =
        await Camera.findOneAndUpdate(

            {
                _id:req.params.id,

                userId:req.user.id

            },


            {
                cameraName:cameraName.trim()
            },


            {

                new:true

            }

        );



        if(!camera){

            return res.status(404).json({

                message:"Camera not found"

            });

        }



        res.json({

            message:"Camera updated successfully",

            camera

        });



    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};









// DASHBOARD

const dashboard = async(req,res)=>{

    try{


        const user =
        await User.findById(req.user.id)
        .select("-password");



        const cameras =
        await Camera.find({

            userId:req.user.id

        });



        res.json({

            user,

            totalCameras:cameras.length,

            cameras

        });


    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};









// PAIR CAMERA

const pairCamera = async(req,res)=>{

    try{


        const pairCode = String(req.body.pairCode || "").trim().toUpperCase();

        if (!pairCode) {
            return res.status(400).json({ message:"Pair code is required" });
        }



        const camera =
        await Camera.findOne({

            pairCode

        });



        if(!camera){

            return res.status(404).json({

                message:"Invalid Pair Code"

            });

        }



        res.json({

            message:"Camera paired successfully",

            cameraId:camera._id,

            cameraName:camera.cameraName,

            deviceToken:jwt.sign(
                { cameraId:String(camera._id), role:"camera" },
                process.env.JWT_SECRET,
                { expiresIn:"15m" }
            )

        });



    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};








module.exports = {


    addCamera,

    getCameras,

    deleteCamera,

    updateCamera,

    dashboard,

    pairCamera


};