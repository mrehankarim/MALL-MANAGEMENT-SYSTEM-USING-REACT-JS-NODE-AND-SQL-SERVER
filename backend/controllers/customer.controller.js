import asyncHandler from "../utils/asyncHandler.js"
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'
import dotenv from "dotenv"
import Store from "../models/Store.Model.js"
import Bill from "../models/Bill.Model.js"
dotenv.config()
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
      throw new apiError(5000,"Sometjing went wrong")
    }
    res.status(500).json(
      new apiResponse(200,bills,"Bill fetched successfully")
    )
  })

  const payBill=asyncHandler(async(req,res)=>{
    //store owner will pay bill
  })

  export {insertStoreDailyRevenue,getActiveBillsOfStore}