import { Router } from "express";
import { addCustomer, getAllShops } from "../controllers/subadmin.controller.js";
import verifyJwt from "../middleware/auth.middleware.js";
import verifySubAdmin from '../middleware/verfiySubAdmin.js'
const router=Router()
router.route("/shops").get(verifyJwt,verifySubAdmin,getAllShops)
router.route("/addCustomer").post(verifyJwt,verifySubAdmin,addCustomer)

export default router