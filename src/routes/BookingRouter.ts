import { Router } from "express"
import BookingController from "../controllers/BookingController"

const controller = new BookingController()

const router = Router()

router.post("/create", controller.create)
router.post("/list", controller.list)
router.post("/update", controller.update)
router.post("/delete", controller.delete)

export default router