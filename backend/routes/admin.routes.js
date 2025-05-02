import { Router } from "express";
const router=Router()

import {getActiveSubscriber,getAllSubscriber,getTotalRevenue,getTotalRevenueBySubscriber,getRevenueMonthByMonthRevenue,deactivateSubscription,downloadSubscribers,getSubscriptionsBetweenDates,getFeedback} from '../controllers/admin.controller.js'
import verifyJwt from "../middleware/auth.middleware.js";
import verifyAdmin from '../middleware/verfiyAdmin.js'

router.route('/activesubscribers').get(getActiveSubscriber)
router.route('/subscribers').get(verifyJwt,verifyAdmin,getAllSubscriber)
router.route('/totalrevenue').get(verifyJwt,verifyAdmin,getTotalRevenue)
router.route('/revenuebysubsciber').get(verifyJwt,verifyAdmin,getTotalRevenueBySubscriber)
router.route('/monthlyrevenue').get(verifyJwt,verifyAdmin,getRevenueMonthByMonthRevenue)
router.route('/subscriptionbydates').get(verifyJwt,verifyAdmin,getSubscriptionsBetweenDates)
router.route('/deactivate/:id').get(verifyJwt,verifyAdmin,deactivateSubscription)
router.route('/download').get(verifyJwt,verifyAdmin,downloadSubscribers)
router.route('/feedback').get(verifyJwt,verifyAdmin,getFeedback)

export default router