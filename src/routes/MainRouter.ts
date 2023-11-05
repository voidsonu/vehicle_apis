import { Router } from "express"

import {
    BookingRouter,
	UserRouter,
    VehicleRouter
} from "."

const router = Router()

// user routes
router.use("/v1/user", UserRouter)
router.use("/v1/vehicle", VehicleRouter)
router.use("/v1/booking", BookingRouter)

export default router