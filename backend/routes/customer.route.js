import { Router } from "express";
import verifyJwt from "../middleware/auth.middleware.js";
import verifyCustomer from "../middleware/verifyCustomer.js";
import { insertStoreDailyRevenue } from "../controllers/customer.controller.js";

const router=Router()
router.route('/insertrevenue').post(verifyJwt,verifyCustomer,insertStoreDailyRevenue)
export default router