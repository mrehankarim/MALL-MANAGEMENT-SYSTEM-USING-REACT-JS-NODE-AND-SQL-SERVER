import asyncHandler from "../utils/asyncHandler.js"
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'
import Shop from "../models/Shop.Model.js"
import User from "../models/user.model.js"
import Papa from "papaparse"
import fs from "fs"
import Store from "../models/Store.Model.js"
import Bill from "../models/Bill.Model.js"
import Rent from "../models/Rent.Model.js"
import Feedback from "../models/Feedback.Model.js"
import Attendance from "../models/Attendance.Model.js"
import Payroll from "../models/Payroll.Model.js"

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

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
  const username=req.user?.username
  const stores=await Store.getStoresBySubscriber(username)
  if(!stores)
  {
    throw new apiError(500,'Internal server Error')
  }
  res.status(200).json(
    new apiResponse(200,stores,"Stores retrived successfully")
  )
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

const inserBillsInBulk=asyncHandler(async(req,res)=>{
  //upload CSV containing all bils
})

const insertBill=asyncHandler(async(req,res)=>{
  //insert a bill for store
  const {shop_no,type,amount,month_year}=req.body
  
  if([shop_no,type,amount,month_year].some((field)=>{
    field==undefined || field.trim()==""
  }))
  {
    throw new apiError(400,"All fields are required")
  }
  
  if(!await Shop.MatchShopAndSubadmin(shop_no,req.user?.username))
  {
    throw new apiError(400,"Invalid shop Number")
  }
  
  if(!await Bill.InsertBill(shop_no,type,amount,month_year))
  {
    throw new apiError(500,"Something went wrong while inserting bill")
  }
  res.status(200).json(
    new apiResponse(200,{},"Bill inserted successfully")
  )

})
const getBillsofShop=asyncHandler(async(req,res)=>{
  //send shop_no of store from front end

  const shop_no=req.query.shop_no
  if(!shop_no)
  {
    throw new apiError(400,"Shop umber is required")
  }
  const bills=await Bill.getBillsOfShop(shop_no)
  if(!bills)
  {
    throw new apiError(500,"Internal server error in feteching bills")
  }
  res.status(200).json(
    new apiResponse(200,bills,"Bills fetched successfully")
  )
})

const addMonthlyRentofStore=asyncHandler(async (req,res)=>{
  //this function takes username of subadmin and add montly 
  // rent of allocated shops for each subadmin

  const username=req.user?.username
  const shops=await Shop.getShopsBySubscriber(username)
  if(!shops)
  {
    throw new apiError(500,"Something went wrong")
  }
  
  for(let shop of shops)
  {
    await Rent.addMonthlyRent(shop.shop_no)
  }

  res.status(200).json(
    new apiResponse(200,{},"Rent added successfully")
  )


})
const getRentsofStore=asyncHandler(async(req,res)=>{
  const shop_no=req.query.shop_no
  if(!shop_no)
  {
    throw new apiError(400,"Shop umber is required")
  }

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
            shop.rent,
            req.user?.username
          ))
          {
            throw new Error('could not create shop')
          }
          successList.push({
            index,
            shop_no: shop.shop_no
          })
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
  
  const updateRent=asyncHandler(async (req,res)=>{
    const {shop_no,rent}=req.body
    if(!shop_no || !rent)
    {
      throw new apiError(400,"All fields are required")
    }
    if(!await Rent.updateRent(shop_no,rent))
    {
      throw new apiError(500,'something went wrong')
    }
    res.status(200).json(
      new apiResponse(200,{},'Rent update successfully')
    )

  })
  const getTotalRevenueOfMall=asyncHandler(async(req,res)=>{
    const username=req.user?.username
    const date=req.query.date
    if(!date)
    {
      throw new apiError(400,"Date is required")
    }
    const revenue=await Rent.getRevenue(username,date)
    if(!revenue)
    {
      throw new apiError(500,"Internal server error")
    }
    res.status(200).json(
      new apiResponse(200,revenue,"Revenue fetched successfully")
    )
  })

  const addFeedback=asyncHandler(async(req, res)=>{

    const {message, rating}=req.body
    const username=req.user?.username

    if([message, rating].some((field)=>{
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

const getCustomerFeedback=asyncHandler(async(req, res)=>{

  const username=req.user?.username
  
    const getFeedback=await Feedback.gettingCustomerFeedback(username);

    if(!getFeedback){
      throw new apiError(400, "Something went wrong");
    }  

    if (getFeedback.length === 0) {
      return res.status(404).json(
          new apiResponse(404, [], "No customer feedback found")
      );
  }

    res.status(200).json(
      new apiResponse(200,getFeedback,'Customers Feedback Fetched successfully')
    )
})

const getExpensesOfMall=asyncHandler(async(req,res)=>{
  const username=req.user?.username
  const date=req.query.date
  if(!date)
  {
    throw new apiError(400,"Date is required")
  }
  const expenses=await Rent.getExpenses(username,date)
  if(!expenses)
  {
    throw new apiError(500,"Internal server error")
  }
  res.status(200).json(
    new apiResponse(200,expenses,"Expenses fetched successfully")
  )
})

const getEmployeesAttendance=asyncHandler(async(req, res)=>{

  const username=req.user?.username
    const {date}=req.body

    if (!date || isNaN(Date.parse(date))) {
      throw new apiError(400, "Invalid date entered");
    }

    const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

    if(date>today){
      throw new apiError(400, "Future date can not be entered")
    }

    const attendance=await Attendance.getEmployeeAttendanceBySubadmin('subscriber2', date);
    if(!attendance){
      throw new apiError(400, "Something went wrong");
    }

    if(attendance.length===0){
      throw new apiResponse(200, attendance, "No data found");
    }

    res.status(200).json(
      new apiResponse(200, attendance, "Employees attendance fetched successfully")
    )
})

  
const getEmployeePayrollStatus=asyncHandler(async(req, res)=>{

    const username=req.user?.username
    const {date}=req.body

    if (!date || isNaN(Date.parse(date))) {
        throw new apiError(400, "Invalid date entered");
    }

    const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

    if(date>today){
      throw new apiError(400, "Future date can not be entered")
    }

    const payrollStatus=await Payroll.gettingEmployeePayrollStatus (username, date);
    if(!payrollStatus){
      throw new apiError(400, "Something went wrong");
    }

    if (payrollStatus.length === 0) {
      return res.status(404).json(
          new apiResponse(404, [], "No employee payroll status found")
      );
    }

    res.status(200).json(
      new apiResponse(200, payrollStatus, "Employees payroll status fetched successfully")
    )
})

const generateMonthlyPayroll=asyncHandler(async(req, res)=>{

    
    const checkPayrolls=await Payroll.IsPayrollGenerated(username, date);
    if(checkPayrolls.length>0){
      throw new apiError(400, "Payrolls already generated for this month");
    }

    const generatedPayrolls=await Payroll.generatingEmployeesMonthlyPayroll(username, date);
    if(!generateMonthlyPayroll){
      throw new apiError(400, "Something went wrong")
    }

    res.status(200).json(
      new apiResponse(200, generatedPayrolls, "Monthly Payrolls generated succesfully")
    );

})

export {getExpensesOfMall,getTotalRevenueOfMall,getAllShops,addCustomer,addShopsInBulk,allocateShopToStore,activateStore,getAllStores,insertBill,getBillsofShop,addMonthlyRentofStore,updateRent, addFeedback, getCustomerFeedback, getEmployeesAttendance, getEmployeePayrollStatus, generateMonthlyPayroll}


//->deleteashop->it should also delete all it's asssociated data like store that was in it
//->gross revenue of mall->till date in that month
//->expenses of mall->till date in month
//->net profit of mall->till date in month
//->active subscribtions of mall
//->all subscriptions of mall->with date of subscription
//->buy->price 25$-> wo apny account details dega aur subscription purchase krlega

