import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const verifyCustomer=asyncHandler(async(req,res,next)=>{
    if(req.user.role=="store_owner")
    {
        next()
    }
    else
    {
        throw new apiError(300,"Unauthorized Access")
    }
    
})

export default verifyCustomer