import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const verifyAdmin=asyncHandler(async(req,res,next)=>{
    if(req.user?.role=="admin")
    {
        next()
    }
    else
    {
        throw new apiError(401,"Unauthorized Access")
    }
    
})

export default verifyAdmin