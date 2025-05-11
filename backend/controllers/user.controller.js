import User from "../models/user.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const verifyPassword=async(password,user)=>
{
    return await bcrypt.compare(password,user.password)
}
const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const generateAccessAndRefreshToken=async (user)=>{
    
    const accessToken=await jwt.sign({
       email:user.email,
       username:user.username,
       role:user.role
      },
      process.env.ACSESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      })
      const refreshToken=await jwt.sign(
        {
            email:user.email
        },
        process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }

      )
      return {accessToken,refreshToken}
  }
const registerUser=asyncHandler(async (req,res)=>{
    

    //extrat data from req.body
    //validate data
    //validate email format
    //check for existing username and email
    //save user in database


    const {username,email,firstName,lastName,role,password}=req.body

    if([username,email,firstName,lastName,role,password].some((field)=>{
        field?.trim()==="" || field===undefined
    }))
    {
        throw new apiError(400,"All field are reuqired")
    }
    if(!validateEmail(email))
    {
        throw new apiError(400,"Inavlid email")
    }
    let existingUser=await User.getUserByEmail(email)
    
    if(existingUser.length>0)
    {
        throw new apiError(400,"email already exists")   
    }
    else
    {
        existingUser=await User.getUserByUsername(username)
        if(existingUser.length>0)
        {
            throw new apiError(400,"username already exists")    
        }
    }
    const hashedPassword=await bcrypt.hash(password,10)
    await User.createUser({username,email,role,firstName,lastName,password:hashedPassword})
    
    const createdUser=await User.getUserByEmail(email);
    if(createdUser.length==0)
    {
        throw new apiError(500,"Something went wront while crating user")
    }
    delete createdUser[0].password;
    delete createdUser[0].refreshToken;

    res.status(200).json( 
        new apiResponse(200,createdUser[0],"User created successfully")
    )

})

const loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body //email can contain both email or username
    let userRecord=await User.getUserByEmail(email)
    if(userRecord.length==0)
    {
        userRecord=await User.getUserByUsername(email)
    }
    if(userRecord.length==0)
    {
        throw new apiError(400,"User does not exists")
    }
    const user=userRecord[0];
    if(!(await verifyPassword(password,user)))
    {

        throw new apiError(400,"Invalid password")
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user)
    if(!accessToken || !refreshToken)
    {
        throw new apiError(400,"Something went wrong while generating access and refresh token")
    }
    if(!(await User.updateRefreshToken(refreshToken,user.email)))
    {
        throw new apiError(500,"Something went while saving reresh token")
    }
    const options = {
        httpOnly: true,
        secure: true,
      };
      delete user.refreshToken
      delete user.password
      res.cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(200)
      .json(
        new apiResponse(200,{user,refreshToken,accessToken},
            "User loggedIn Succesfully"
        )
      )
})

const logOutUser=asyncHandler(async(req,res)=>{
    //clear accesTpken
    //clear refreshToken
    console.log("hit")
    const user=req.user
    if(!user)
    {
        throw new apiError(401,"accessTokenExpired during signout")
    }
    const options = {
        httpOnly: true,
        secure: true,
      };

     if(!(await User.updateRefreshToken(null,user.email))) 
     {
        throw new apiError(500,"something went wrong while signing out")
     }
     res.status(200)
     .clearCookie("accessToken",options)
     .clearCookie("refreshToken",options)
     .json(
        new apiResponse(200,{},"user logged out successfully")
     )
})
const getUserInfo=asyncHandler(async(req,res)=>{
    const user=req.user
    delete user['password']
    res.json(new apiResponse(200,user,'User fetched Successfully'))
})
export {registerUser,loginUser,logOutUser,getUserInfo}