import { Router } from "express"
import VehicleController from "../controllers/VehicleController"

const controller = new VehicleController()

const router = Router()

router.post("/list", controller.list)
router.post("/update", controller.update)

export default router