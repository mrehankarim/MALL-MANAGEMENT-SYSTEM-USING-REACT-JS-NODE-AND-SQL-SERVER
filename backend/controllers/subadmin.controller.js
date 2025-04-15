import asyncHandler from "../utils/asyncHandler.js"
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'
import dotenv from "dotenv"
import Shop from "../models/Shop.Model.js"
import User from "../models/user.model.js"
import Papa from "papaparse"
import fs from "fs"
import { parse } from "path"
dotenv.config()

const getAllShops=asyncHandler(async(req,res)=>{
    const shops=await Shop.getAllShopBySubAdmin(req.user?.username)
    if(!shops)
    {
        throw new apiError(500,"Something went wrong while getting shops")
    }
    res.status(200).json(
        new apiResponse(200,shops,"shops fetched successfully")
    )
})

const getAllStores=asyncHandler(async(req,res)=>{
    
})

const addCustomer=asyncHandler(async (req,res)=>{
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
    await User.createUser({username,email,role,firstName,lastName,password:hashedPassword,subadmin:req.user?.username})
    
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

const addShopsInBulk = asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new apiError(400, "File is required");
    }
  
    const parsedData = [];
  
    await new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(req.file.path);
  
      Papa.parse(readStream, {
        header: true,
        transformHeader: header => header.trim().toLowerCase(),
        step: function (result) {
          parsedData.push(result.data);
        },
        complete: function () {
          resolve();
        },
        error: function (err) {
          reject(err);
        }
      });
    });
  
    const successList = [];
    const failedList = [];
  
    for (const [index, shop] of parsedData.entries()) {
      try {
        

        if(!await Shop.createShop(
            shop['shopno'],
            shop.location,
            shop.status,
            req.user?.username
          ))
          {
            throw new Error('could not create shop')
          }
      } catch (err) {
        failedList.push({
          index,
          shop_no: shop.shop_no,
          error: err.message || "Unknown error"
        });
      }
    }
  
    res.status(207).json({
      message: "Bulk upload completed with some results.",
      successCount: successList.length,
      failedCount: failedList.length,
      failedEntries: failedList
    });
  });
  
export {getAllShops,addCustomer,addShopsInBulk}