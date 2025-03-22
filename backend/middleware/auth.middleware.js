import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

//take accesstoken from front end
//if access token does not exist or wrong->invalid user
//else move to controller using next()
const verifyJwt=asyncHandler(async(req,res,next)=>{
    const token = req.cookies?.accessToken;
    if(!token)
    {
        throw new apiError(401,"Unauthorized Access")
    }
    const decodedToken = jwt.verify(token, process.env.ACSESS_TOKEN_SECRET);

    const user=await User.getUserByEmail(decodedToken.email)
    if(user.length==0)
    {
        throw new apiError(401,"Invalid Token")
    }
    req.user=user[0]
    next()
})

export default verifyJwt