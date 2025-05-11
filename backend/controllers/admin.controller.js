//active subscriptions
//subscriptions till date
//till date total revenue
//get total revenue by subscriber
//month by month revenue
//DEACTIVATE SUBSCRIBTION
//downlaod subscription data

import Subscription from "../models/Subscription.Model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import Feedback from "../models/Feedback.Model.js";

const getActiveSubscriber = asyncHandler(async (req, res) => {
    const subscribers = await Subscription.getActiveSubscriber();
    if (!subscribers) {
        throw new apiError(500, "Something went wrong");
    }
    res.status(200).json(
        new apiResponse(200, subscribers, "subscribers fetched successfully")
    )

})

const getAllSubscriber = asyncHandler(async (req, res) => {
    const subscribers = await Subscription.getAllSubscriptions();
    if (!subscribers) {
        throw new apiError(500, "Something went wrong");
    }
    res.status(200).json(
        new apiResponse(200, subscribers, "subscribers fetched successfully")
    )

})
const getTotalRevenue = asyncHandler(async (req, res) => {
    const revenue = await Subscription.getTotalRevenue()
    if (!revenue) {
        throw new apiError(500, "something went wrong")
    }
    res.status(200).json(
        new apiResponse(200, { revenue }, 'revenue fetched successfully')
    )
})

const getTotalRevenueBySubscriber = asyncHandler(async (req, res) => {
    const username=req.query.username
    const revenues = await Subscription.getTotalRevenueBySubscriber(username)
    if (!revenues) {
        throw new apiError(500, "Something went wrong")
    }
    res.status(200).json(
        new apiResponse(200, revenues, 'Revenue fetehced successfully')
    )
})
const getRevenueMonthByMonthRevenue = asyncHandler(async (req, res) => {
    const revenues = await Subscription.getMonthByMonthSales()
    if (!revenues) {
        throw new apiError(500, "Something went wrong")
    }
    res.status(200).json(
        new apiResponse(200, revenues, 'Revenue fetehced successfully')
    )
})

const deactivateSubscription = asyncHandler(async (req, res) => {
    const subscription_id = req.params.id
    console.log(subscription_id)
    if (!await Subscription.deactivateSubscription(subscription_id)) {
        throw new apiError(500, "Something went wrong")
    }
    res.status(200).json(new apiResponse(200, {}, 'Subscription deactivated successfully'))
})

const downloadSubscribers = asyncHandler(async (req, res) => {
    const Data = await Subscription.getSubscriberData();

    if (!Data || Data.length === 0) {
        return res.status(404).send('No subscriber data found.');
    }

    const header = Object.keys(Data[0]).join(',');
    const row = Data.map((obj) => {
        return Object.values(obj).map((value) => `"${value}"`).join(',');
    });
    const csv = [header, ...row].join('\n');
    res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
    res.setHeader('Content-Type', 'text/csv');
    res.send(csv);
});

const getSubscriptionsBetweenDates = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        throw new apiError(400, "All fields are required");
    }

    if (new Date(startDate) > new Date(endDate)) {
        throw new apiError(400, "Start date cannot be after end date");
    }

    const subscriptions = await Subscription.getSubscriptionsBetweenDates(startDate, endDate);

    res.status(200).json(
        new apiResponse(200, subscriptions, "Subscriptions fetched successfully")
    );
});

const getFeedback=asyncHandler(async(req,res)=>{
    const feedback=await Feedback.getFeedbacks()

    if(!feedback)
    {
        throw new apiError(500,"something went wrong")
    }
    res.status(200).json(
        new apiResponse(200,feedback,'Feedback fetched successfully')
    )
})


export { getActiveSubscriber, getAllSubscriber, getTotalRevenue, getTotalRevenueBySubscriber, getRevenueMonthByMonthRevenue, deactivateSubscription, downloadSubscribers, getSubscriptionsBetweenDates,getFeedback }
