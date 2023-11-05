import { Router } from "express"
import UserController from "../controllers/UserController"

const controller = new UserController()

const router = Router()

router.post("/create", controller.create)
router.post("/list", controller.list)
router.post("/update", controller.update)
router.post("/delete", controller.delete)

export default router