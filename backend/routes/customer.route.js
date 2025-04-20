import { Router } from "express";
import verifyJwt from "../middleware/auth.middleware.js";
import verifyCustomer from "../middleware/verifyCustomer.js";
import {getRevenueBetweenDates, insertStoreDailyRevenue,getActiveRent,getActiveBillsOfStore, addFeedback } from "../controllers/customer.controller.js";

const router=Router()
router.route('/insertrevenue').post(verifyJwt,verifyCustomer,insertStoreDailyRevenue)
router.route('/rents').get(verifyJwt,verifyCustomer,getActiveRent)
router.route('/bills').get(verifyJwt,verifyCustomer,getActiveBillsOfStore)
router.route('/revenue/daily').get(verifyJwt,verifyCustomer,getRevenueBetweenDates)
router.route('/add/feedback').post(verifyJwt, verifyCustomer, addFeedback);

export default router