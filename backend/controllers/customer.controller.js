import asyncHandler from "../utils/asyncHandler.js"
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'
import Store from "../models/Store.Model.js"
import Bill from "../models/Bill.Model.js"
import Rent from "../models/Rent.Model.js"
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
  
    const shop_no=req.query.shop_no
    if(!shop_no)
    {
      throw new apiError(400,"Shop no is required")
    }
    const bills=await Bill.getActiveBills(shop_no)
    if(!bills)
    {
      throw new apiError(5000,"Something went wrong")
    }
    res.status(500).json(
      new apiResponse(200,bills,"Bill fetched successfully")
    )
  })
  const getActiveRent=asyncHandler(async (req,res)=>{
    //this function shop no of store from front end and fetches all it's active bills 
    const shop_no=req.query.shop_no
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
  const payBill=asyncHandler(async(req,res)=>{
    //store owner will pay bill
  })

  export {insertStoreDailyRevenue,getActiveBillsOfStore,getActiveRent}

  //customer can get active rents
  //can get total revenue of till date of month
  //can get month by month sales record
  //pay bill
  //get active bill
  //get active rents
  //pay rents