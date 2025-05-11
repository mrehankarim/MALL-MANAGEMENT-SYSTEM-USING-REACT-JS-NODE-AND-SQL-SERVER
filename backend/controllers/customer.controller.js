import asyncHandler from "../utils/asyncHandler.js"
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'
import Store from "../models/Store.Model.js"
import Bill from "../models/Bill.Model.js"
import Rent from "../models/Rent.Model.js"
import DailyStoreRevenue from "../models/DAILY_STORE_REVENUE.MODEL.js"
import Feedback from "../models/Feedback.Model.js"
import { toASCII } from "punycode"
const insertStoreDailyRevenue=asyncHandler(async(req,res)=>{
    //user would be loggedIn while inserting daily revenue
    //dont take store_id from user in form just do it programmtically on front end
    const store_id=req.query.store_id
    const {total_earnings,date}=req.body

    const formattedDate = new Date(date).toISOString().split('T')[0];
    
    if([store_id,total_earnings,formattedDate].some((field)=>{
      field==undefined || field.trim()==""
    }))
    {
      throw new apiError(400,"All fields are required")
    }

    if(isNaN(total_earnings)){
            throw new apiError(400,"invalid amount entered")
    }

    if(total_earnings<1){
      throw new apiError(400,"total earnings amount should be greater than 0")
    }

    if(!await Store.insertDailyRevenue(store_id,total_earnings,formattedDate))
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

  const getPendingRentsofShop=asyncHandler(async(req, res)=>{

    // const shop_no=req.query.shop_no
    const shop_no=101
    if(!shop_no)
    {
      throw new apiError(400,"shop no is required")
    }

    const pendingRents=await Rent.getPendingRentsOfShop(shop_no);

    if(!pendingRents){
      throw new apiError(500,"Something went wrong")
    }

    res.status(200).json(
      new apiResponse(200,pendingRents,'All pending rents of Shop fetched successfully')
    )
  })

  const getPendingBillsofShop=asyncHandler(async(req, res)=>{

    // const shop_no=req.query.shop_no
    const shop_no=101
    if(!shop_no)
    {
      throw new apiError(400,"shop no is required")
    }

    const pendingBills=await Bill.getPendingBillsofShop(shop_no);

    if(!pendingBills){
      throw new apiError(500,"Something went wrong")
    }

    res.status(200).json(
      new apiResponse(200,pendingBills,'All pending rents of Shop fetched successfully')
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

    const username=req.user?.username
    const {message, rating}=req.body

    if([message].some((field)=>{
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
    const {amount, method, type, month_year}=req.body

    // const shop_no=req.query.shop_no
    // const username=req.user?.username
    const shop_no=101
    const username='subscriber1'

    if([method, type, month_year].some((field)=>{
      field==undefined || field.trim()==""
    }))
    {
      throw new apiError(400,"All fields are required")
    }

    const paybill=await Bill.payPendingBill(amount, method, type, username, shop_no, month_year);
    if(!paybill){
      throw new apiError(500,"Something went wrong")
    }

    res.status(200).json(
      new apiResponse(200,paybill,'Bill paid successfully')
    )
  })

  const payRent=asyncHandler(async(req,res)=>{
    //store owner will pay rent
    const {method, type, month_year}=req.body

    // const shop_no=req.query.shop_no
    // const username=req.user?.username
    const shop_no=101
    const username='subscriber1'

    if([method, type, month_year].some((field)=>{
      field==undefined || field.trim()==""
    }))
    {
      throw new apiError(400,"All fields are required")
    }

    const result= await Rent.getMonthlyRentOfStore(shop_no) // ye shop_no ka rent utha kr lata he
    const amount = result[0]?.rent_amount;
    const payrent=await Rent.payMonthlyRent(amount, method, type, username, shop_no, month_year);
    if(!payrent){
      throw new apiError(500,"Something went wrong")
    }

    res.status(200).json(
      new apiResponse(200,payrent,'Rent paid successfully')
    )
  })

  export {getRevenueBetweenDates,insertStoreDailyRevenue,getActiveBillsOfStore,getActiveRent,addFeedback, getAllRentsOfShop, getAllBillsOfShop, getTotalStoreRevenue, getMonthlyRevenue, payBill, payRent, getPendingRentsofShop, getPendingBillsofShop}

  //customer can get active rents
  //can get total revenue of till date of month
  //can get month by month sales record
  //pay bill
  //get active bill
  //get active rents
  //pay rents