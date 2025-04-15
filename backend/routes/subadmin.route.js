import { Router } from "express";
import { addCustomer, getAllShops,addShopsInBulk } from "../controllers/subadmin.controller.js";
import verifyJwt from "../middleware/auth.middleware.js";
import verifySubAdmin from '../middleware/verfiySubAdmin.js'
import { upload } from "../utils/multer.js";
import fs from "fs"
const router=Router()
router.route("/shops").get(verifyJwt,verifySubAdmin,getAllShops)
router.route("/addCustomer").post(verifyJwt,verifySubAdmin,addCustomer)
router.route("/upload").post(verifyJwt,verifySubAdmin,upload.single("csvFile"),addShopsInBulk)
export default router