import express from "express";
import { vehicleController } from "./vehicle.controller";
import auth from "../../middleware/auth";

const router = express.Router();


router.post("/", auth("admin"), vehicleController.createVehicle);

router.get("/", vehicleController.getVehicle);

router.get("/:id", vehicleController.getSingleVehicle);

router.put("/:id", auth("admin"), vehicleController.updateVehicle);

router.delete("/:id", auth("admin"), vehicleController.deleteVehicle);


export const vehiclesRoute = router; 

 