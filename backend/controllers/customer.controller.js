import asyncHandler from "../utils/asyncHandler.js"
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'
import dotenv from "dotenv"
import Store from "../models/Store.Model.js"
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

  export {insertStoreDailyRevenue}