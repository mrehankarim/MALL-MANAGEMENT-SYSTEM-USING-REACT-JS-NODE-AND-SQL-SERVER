import asyncHandler from "../utils/asyncHandler.js"
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'
import dotenv from "dotenv"
import Shop from "../models/Shop.Model.js"
import User from "../models/user.model.js"
import Papa from "papaparse"
import fs from "fs"
import Store from "../models/Store.Model.js"

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
//add controllers for deleting a store or updading it
//extract customer controllers separate later
const allocateShopToStore=asyncHandler(async(req,res)=>{
  //check if shop is vacant
  const {storeName,shopNo,ownerUsername,category}=req.body
  const subadmin=req.user?.username;

  if([storeName,shopNo,ownerUsername,category].some((field)=>{
    field.trim()===""
  }))
  {
    throw new apiError(400,"All fields are required");
  }
  if(!await Shop.checkShopVacancy(shopNo))
  {
    throw new apiError(400,"Shop is not vacant")
  }
  const subadminArray=await Shop.getSubadmin(shopNo);
  if(subadminArray.length==0)
  {
    throw new apiError(400,"Invalid Shop No")
  }
  if(subadminArray[0].shopowner!=subadmin)
  {
    throw new apiError(401,"Unauthorized shop No");
  }
  if(!await User.MatchCustomerSubAdmin(ownerUsername,subadmin))
  {
    throw new apiError(401,"Unauthorized shop No")
  }
  if(!await Store.createStore({storeName,shopNo,ownerUsername,category}))
  {
    throw new apiError(500,"Something went wrong while creating store")
  }
  res.status(200).json(
    new apiResponse(200,{},"store created successfully")
  )
})

const activateStore=asyncHandler(async(req,res)=>{
  const {store_id}=req.body
  if(!store_id)
  {
    throw new apiError(400,"store id is required")
  }
  if(!await Store.activateStore(store_id))
  {
    throw new apiError(500,"Something went wrong in store activation")
  }
  res.status(200).json(
    new apiResponse(200,{},"store activated successfully")
  )
})
const insertStoreDailyRevenue=asyncHandler(async(req,res)=>{

})
const inserBillsInBulk=asyncHandler(async(req,res)=>{
  //upload CSV containing all bils
})
const insertRentInBulk=asyncHandler(async(req,res)=>{
  //insert a rents in bulk for store
})
const insertBill=asyncHandler(async(req,res)=>{
  //insert a bill for store
})
const requestBill=asyncHandler(async(req,res)=>{
  //get monthly bills of a store
})
const insertRent=asyncHandler(async(req,res)=>{
  //insert rent of shops
})
const requestRent=asyncHandler(async(req,res)=>{
  //request rent of stores
})

const payBill=asyncHandler(async(req,res)=>{
  //store owner will pay bill
})
const getUnallocatedShopBills=asyncHandler((req,res)=>{

})
const payBillForUnallocatedShop=asyncHandler(async(req,res)=>{
  //pay bill for unallocated shop
})

const getAllocatedShopsWithStore=asyncHandler(async(req,res)=>{
  //get 
})

const getActiveBillsOfStore=asyncHandler(async(req,res)=>{
  //get active bills of a store
})

const getTillDateDayByDayReveneueOfStore=asyncHandler(async(req,res)=>{
  //get day by day sales of store
})

const getTillDateAllExpensesOfStore=asyncHandler(async(req,res)=>{
  //get list of expenses beingpaid py store till date of month
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
  
export {getAllShops,addCustomer,addShopsInBulk,allocateShopToStore,activateStore}