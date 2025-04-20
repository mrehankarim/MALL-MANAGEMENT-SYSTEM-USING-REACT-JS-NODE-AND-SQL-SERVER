import { Router } from "express";
import { getExpensesOfMall,getTotalRevenueOfMall,addCustomer, getAllShops,addShopsInBulk,allocateShopToStore, activateStore,getAllStores, insertBill, getBillsofShop,addMonthlyRentofStore,updateRent } from "../controllers/subadmin.controller.js";
import verifyJwt from "../middleware/auth.middleware.js";
import verifySubAdmin from '../middleware/verfiySubAdmin.js'
import { upload } from "../utils/multer.js";
import fs from "fs"
import { verify } from "crypto";
import verifyCustomer from "../middleware/verifyCustomer.js";
const router=Router()
router.route("/shops").get(verifyJwt,verifySubAdmin,getAllShops)
router.route("/addCustomer").post(verifyJwt,verifySubAdmin,addCustomer)
router.route("/upload").post(verifyJwt,verifySubAdmin,upload.single("csvFile"),addShopsInBulk)
router.route('/allocateshop').post(verifyJwt,verifySubAdmin,allocateShopToStore)
router.route('/activate').post(verifyJwt,verifySubAdmin,activateStore)
router.route('/shops').get(verifyJwt,verifySubAdmin,getAllShops)
router.route('/stores').get(verifyJwt,verifySubAdmin,getAllStores)
router.route('/add/bill').post(verifyJwt,verifySubAdmin,insertBill)
router.route('/bills').get(verifyJwt,verifySubAdmin,getBillsofShop)
router.route('/revenue').get(verifyJwt,verifySubAdmin,getTotalRevenueOfMall)
router.route('/expense').get(verifyJwt,verifySubAdmin,getExpensesOfMall)
router.route('/add/monthlyrent').post(verifyJwt,verifySubAdmin,addMonthlyRentofStore)
router.route('/update/rent').put(verifyJwt,verifySubAdmin,updateRent)
export default router