import { Router } from "express";
import verifyJwt from "../middleware/auth.middleware.js";
import verifyCustomer from "../middleware/verifyCustomer.js";
import {getRevenueBetweenDates, insertStoreDailyRevenue,getActiveRent,getActiveBillsOfStore, addFeedback, getAllRentsOfShop, getAllBillsOfShop, getTotalStoreRevenue, getMonthlyRevenue } from "../controllers/customer.controller.js";

const router=Router()
router.route('/insertrevenue').post(verifyJwt,verifyCustomer,insertStoreDailyRevenue)
router.route('/activerents').get(verifyJwt,verifyCustomer,getActiveRent)
router.route('/allrents').get(getAllRentsOfShop); ///////////
router.route('/allbills').get(getAllBillsOfShop); ///////////
router.route('/totalrevenue').get(getTotalStoreRevenue); /////////
router.route('/monthlyrevenue').get(getMonthlyRevenue); /////////
router.route('/bills').get(verifyJwt,verifyCustomer,getActiveBillsOfStore)
router.route('/revenue/daily').get(verifyJwt,verifyCustomer,getRevenueBetweenDates)
router.route('/add/feedback').post(verifyJwt, verifyCustomer, addFeedback);

export default router