const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");


const {

    addCamera,

    getCameras,

    deleteCamera,

    updateCamera,

    dashboard,

    pairCamera

} = require("../controllers/cameraController");



const router = express.Router();




// Add Camera

router.post(
    "/",
    authMiddleware,
    addCamera
);




// Get Cameras

router.get(
    "/",
    authMiddleware,
    getCameras
);




// Delete Camera

router.delete(
    "/:id",
    authMiddleware,
    deleteCamera
);




// Update Camera

router.put(
    "/:id",
    authMiddleware,
    updateCamera
);




// Dashboard

router.get(
    "/dashboard",
    authMiddleware,
    dashboard
);




// Pair Camera (Phone)

router.post(
    "/pair",
    pairCamera
);



module.exports = router;