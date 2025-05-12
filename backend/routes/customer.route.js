import { Router } from "express";
import verifyJwt from "../middleware/auth.middleware.js";
import verifyCustomer from "../middleware/verifyCustomer.js";
import {getRevenueBetweenDates, insertStoreDailyRevenue,getActiveRent,getActiveBillsOfStore, addFeedback, getAllRentsOfShop, getAllBillsOfShop, getTotalStoreRevenue, getMonthlyRevenue, payBill, payRent, getPendingRentsofShop, getPendingBillsofShop, getShopNo_StoreIDByUsername } from "../controllers/customer.controller.js";

const router=Router()
router.route('/insertrevenue').post(verifyJwt, verifyCustomer, insertStoreDailyRevenue); 
router.route('/activerents').get(verifyJwt, verifyCustomer, getActiveRent); 
router.route('/allrents').get(verifyJwt, verifyCustomer, getAllRentsOfShop); 
router.route('/allbills').get(verifyJwt, verifyCustomer, getAllBillsOfShop); 
router.route('/totalrevenue').get(verifyJwt, verifyCustomer, getTotalStoreRevenue); 
router.route('/monthlyrevenue').get(verifyJwt, verifyCustomer, getMonthlyRevenue); 
router.route('/bills').get(verifyJwt, verifyCustomer, getActiveBillsOfStore); 
router.route('/payrent').post(verifyJwt, verifyCustomer, payRent); 
router.route('/paybill').post(verifyJwt, verifyCustomer, payBill); 
router.route('/allpendingrents').get(verifyJwt, verifyCustomer, getPendingRentsofShop); 
router.route('/allpendingbills').get(verifyJwt, verifyCustomer, getPendingBillsofShop); 
router.route('/revenue/daily').get(verifyJwt,verifyCustomer,getRevenueBetweenDates);
router.route('/addfeedback').post(verifyJwt, verifyCustomer, addFeedback); 
router.route('/getshopno-storeid').get(verifyJwt, verifyCustomer, getShopNo_StoreIDByUsername); 

export default router