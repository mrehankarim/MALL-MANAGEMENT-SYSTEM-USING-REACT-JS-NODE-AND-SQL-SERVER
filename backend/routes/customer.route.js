import { Router } from "express";
import verifyJwt from "../middleware/auth.middleware.js";
import verifyCustomer from "../middleware/verifyCustomer.js";
import {getRevenueBetweenDates, insertStoreDailyRevenue,getActiveRent,getActiveBillsOfStore, addFeedback, getAllRentsOfShop, getAllBillsOfShop, getTotalStoreRevenue, getMonthlyRevenue, payBill, payRent, getPendingRentsofShop, getPendingBillsofShop } from "../controllers/customer.controller.js";

const router=Router()
router.route('/insertrevenue').post(insertStoreDailyRevenue); //////////
router.route('/activerents').get(getActiveRent); ///////// ye sirf total amount bta rha he
router.route('/allrents').get(getAllRentsOfShop); ///////////
router.route('/allbills').get(getAllBillsOfShop); ///////////
router.route('/totalrevenue').get(getTotalStoreRevenue); /////////
router.route('/monthlyrevenue').get(getMonthlyRevenue); /////////
router.route('/bills').get(getActiveBillsOfStore); ////////// //ye sirf total amount bta rha he
router.route('/payrent').post(payRent); /////////
router.route('/paybill').post(payBill); /////////
router.route('/allpendingrents').get(getPendingRentsofShop); ////////
router.route('/allpendingbills').get(getPendingBillsofShop); ////////
router.route('/revenue/daily').get(verifyJwt,verifyCustomer,getRevenueBetweenDates);
router.route('/addfeedback').post(addFeedback); ///////////

export default router