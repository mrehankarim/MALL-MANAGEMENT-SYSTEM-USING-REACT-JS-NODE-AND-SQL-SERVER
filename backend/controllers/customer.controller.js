import asyncHandler from "../utils/asyncHandler.js"
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'
import Store from "../models/Store.Model.js"
import Bill from "../models/Bill.Model.js"
import Rent from "../models/Rent.Model.js"
import DailyStoreRevenue from "../models/DAILY_STORE_REVENUE.MODEL.js"
import Feedback from "../models/Feedback.Model.js"
const insertStoreDailyRevenue=asyncHandler(async(req,res)=>{
    //user would be loggedIn while inserting daily revenue
    //dont take store_id from user in form just do it programmtically on front end
    const {store_id,total_earnings,date}=req.body
    if([store_id,total_earnings,date].some((field)=>{
      field==undefined || field.trim()==""
    }))
    {
      throw new apiError(400,"All fields are required")
    }
    if(!await Store.insertDailyRevenue(store_id,total_earnings,date))
    {
      throw new apiError(500,"Something went wrong while inserting sales")
    }
    res.status(200).json(
      new apiResponse(200,{},"Revenue inserted successfully")
    )
  })

  const getActiveBillsOfStore=asyncHandler(async(req,res)=>{
    //get active bills of a store
    
    // const shop_no=req.query.shop_no
    const shop_no=101 // for now, it is hardcoded
    if(!shop_no)
    {
      throw new apiError(400,"Shop no is required")
    }
    const bills=await Bill.getActiveBills(shop_no)

    if(!bills)
    {
      throw new apiError(500,"Something went wrong")
    }
    res.status(200).json(
      new apiResponse(200,bills,"pending Bill amount fetched successfully")
    )
  })

  const getActiveRent=asyncHandler(async (req,res)=>{
    //this function shop no of store from front end and fetches all it's active bills 

    // const shop_no=req.query.shop_no
    const shop_no=101 //for now, it is hardcoded

    if(!shop_no)
    {
      throw new apiError(400,"shop no is required")
    }

    const rents=await Rent.getActiveRentsByshop(shop_no)

    if(!rents)
    {
      throw new apiError(500,"Something went wrong")
    }
    
    res.status(200).json(
      new apiResponse(200,rents,'Rents fetched successfully')
    )
  })

  const getAllRentsOfShop=asyncHandler(async(req, res)=>{

    // const shop_no=req.query.shop_no
    const shop_no=101 // for now, it is hardcoded
    if(!shop_no)
    {
      throw new apiError(400,"shop no is required")
    }

    const allRents=await Rent.getAllRentsOfShop(shop_no)

    if(!allRents){
      throw new apiError(500,"Something went wrong")
    }

    res.status(200).json(
      new apiResponse(200,allRents,'All Rents of Shop fetched successfully')
    )
  })

  const getAllBillsOfShop=asyncHandler(async(req, res)=>{

    // const shop_no=req.query.shop_no
    const shop_no=101 // for now, it is hardcoded
    if(!shop_no)
    {
      throw new apiError(400,"shop no is required")
    }

    const allBills=await Bill.getBillsOfShop(shop_no)

    if(!allBills){
      throw new apiError(500,"Something went wrong")
    }

    res.status(200).json(
      new apiResponse(200,allBills,'All Bills of Shop fetched successfully')
    )
  })

  const getTotalStoreRevenue=asyncHandler(async(req, res)=>{

    // const shop_no=req.query.shop_no
    const shop_no=101 // for now, it is hardcoded
    if(!shop_no)
    {
      throw new apiError(400,"shop no is required")
    }

    const totalReveue=await DailyStoreRevenue.getTotalRevenueOfStore(shop_no)
    
    if(!totalReveue){
      throw new apiError(500,"Something went wrong")
    }
    
    res.status(200).json(
      new apiResponse(200,totalReveue,'Total Revenue of Store fetched successfully')
    )
  })
  
  const getMonthlyRevenue=asyncHandler(async(req, res)=>{
    // const shop_no=req.query.shop_no
    const shop_no=101 // for now, it is hardcoded
    if(!shop_no)
      {
        throw new apiError(400,"shop no is required")
      }
      
      const monthlyRevenue=await DailyStoreRevenue.getMonthlyRevenueOfStore(shop_no)

      if(!monthlyRevenue){
        throw new apiError(500,"Something went wrong")
      }

      res.status(200).json(
      new apiResponse(200,monthlyRevenue,'Monthly Revenue of Store fetched successfully')
      )
  })

  const getRevenueBetweenDates=asyncHandler(async(req,res)=>{
    const {store_id,startDate,endDate}=req.query
    if([store_id,startDate,endDate].some((field)=>field==""))
    {
      throw new apiError(400,"All fields are rquired")
    }
    if(new Date(startDate)>new Date(endDate))
    {
      throw new apiError(400,"End date must be greater than start date")
    }
    const revenue=await DailyStoreRevenue.getDailytRevenue(startDate,endDate,store_id)
    if(!revenue)
    {
      throw new apiError(500,"Internal server Error")
    }
    res.status(200).json(
      new apiResponse(200,revenue,'Revenue fetched successfully')
    )
  })
  const addFeedback=asyncHandler(async(req, res)=>{

    const {message, rating}=req.body
    const username=req.user?.username

    if([message, rating].some((field)=>{
      field==undefined || field.trim()==""
    }))
    {
      throw new apiError(400,"All fields are required")
    }

    if(isNaN(rating) || rating<0.0 || rating>5.0){
      throw new apiError(400, "Invalid Rating entered");
    }

    const feedback=await Feedback.addingFeedback(username, message, rating);
    if(!feedback)
    {
      throw new apiError(500,"Something went wrong")
    }
    res.status(200).json(
      new apiResponse(200,feedback,'Feedback added successfully')
    )
})

  const payBill=asyncHandler(async(req,res)=>{
    //store owner will pay bill
  })

  export {getRevenueBetweenDates,insertStoreDailyRevenue,getActiveBillsOfStore,getActiveRent,addFeedback, getAllRentsOfShop, getAllBillsOfShop, getTotalStoreRevenue, getMonthlyRevenue}

  //customer can get active rents
  //can get total revenue of till date of month
  //can get month by month sales record
  //pay bill
  //get active bill
  //get active rents
  //pay rents