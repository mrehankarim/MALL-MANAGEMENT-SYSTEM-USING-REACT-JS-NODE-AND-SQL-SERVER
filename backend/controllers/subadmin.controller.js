import asyncHandler from "../utils/asyncHandler.js"
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'
import Shop from "../models/Shop.Model.js"
import User from "../models/user.model.js"
import Papa from "papaparse"
import fs, { stat } from "fs"
import Store from "../models/Store.Model.js"
import Bill from "../models/Bill.Model.js"
import Rent from "../models/Rent.Model.js"
import Feedback from "../models/Feedback.Model.js"
import Attendance from "../models/Attendance.Model.js"
import Payroll from "../models/Payroll.Model.js"
import Employee from "../models/Employee.Model.js"

import bcrypt from "bcrypt"

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

const getAllShops = asyncHandler(async (req, res) => {
  const shops = await Shop.getAllShopBySubAdmin(req.user?.username)
  if (!shops) {
    throw new apiError(500, "Something went wrong while getting shops")
  }
  res.status(200).json(
    new apiResponse(200, shops, "shops fetched successfully")
  )
})

const getAllStores = asyncHandler(async (req, res) => {
  const username = req.user?.username
  const stores = await Store.getStoresBySubscriber(username)
  if (!stores) {
    throw new apiError(500, 'Internal server Error')
  }
  res.status(200).json(
    new apiResponse(200, stores, "Stores retrived successfully")
  )
})

const addCustomer = asyncHandler(async (req, res) => {
  const { username, email, firstName, lastName, role, password } = req.body;
  console.log(username, email, firstName, lastName, role, password)

  if ([username, email, firstName, lastName, role, password].some(field => !field || field.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  if (!validateEmail(email)) {
    throw new apiError(400, "Invalid email");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const trimmedUsername = username.trim();

  let existingUser = await User.getUserByEmail(normalizedEmail);
  if (existingUser.length > 0) {
    throw new apiError(400, "Email already exists");
  }

  existingUser = await User.getUserByUsername(trimmedUsername);
  if (existingUser.length > 0) {
    throw new apiError(400, "Username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.createUser({
    username: trimmedUsername,
    email: normalizedEmail,
    role,
    firstName,
    lastName,
    password: hashedPassword,
    subadmin: req.user?.username
  });

  const createdUser = await User.getUserByEmail(normalizedEmail);
  if (createdUser.length === 0) {
    throw new apiError(500, "Something went wrong while creating user");
  }

  delete createdUser[0].password;
  delete createdUser[0].refreshToken;

  res.status(200).json(
    new apiResponse(200, createdUser[0], "User created successfully")
  );
});

//add controllers for deleting a store or updading it
//extract customer controllers separate later
const allocateShopToStore = asyncHandler(async (req, res) => {
  //check if shop is vacant
  const { storeName, shopNo, ownerUsername, category } = req.body
  const subadmin = req.user?.username;
  console.log("working", storeName, shopNo, ownerUsername, category)
  if ([storeName, shopNo, ownerUsername, category].some(field => String(field).trim() === "")) {
    throw new apiError(400, "All fields are required");
  }
  if (!await Shop.checkShopVacancy(shopNo)) {
    throw new apiError(400, "Shop is not vacant")
  }

  const subadminArray = await Shop.getSubadmin(shopNo);
  if (subadminArray.length == 0) {
    throw new apiError(400, "Invalid Shop No")
  }
  if (subadminArray[0].shopowner != subadmin) {
    throw new apiError(401, "Unauthorized shop No");
  }

  if (!await User.MatchCustomerSubAdmin(ownerUsername, subadmin)) {
    throw new apiError(401, "Unauthorized shop No")
  }
  if (!await Store.createStore({ storeName, shopNo, ownerUsername, category })) {
    throw new apiError(500, "Something went wrong while creating store")
  }
  res.status(200).json(
    new apiResponse(200, {}, "store created successfully")
  )
})

const activateStore = asyncHandler(async (req, res) => {
  const { store_id } = req.body
  if (!store_id) {
    throw new apiError(400, "store id is required")
  }
  if (!await Store.activateStore(store_id)) {
    throw new apiError(500, "Something went wrong in store activation")
  }
  res.status(200).json(
    new apiResponse(200, {}, "store activated successfully")
  )
})

const inserBillsInBulk = asyncHandler(async (req, res) => {
  //upload CSV containing all bils
})

const insertBill = asyncHandler(async (req, res) => {
  //insert a bill for store
  const { shop_no, type, amount, month_year } = req.body
  console.log(shop_no, type, amount, month_year)

  if ([shop_no, type, amount, month_year].some(field =>
    field === undefined || field === null || String(field).trim() === ""
  )) {
    throw new apiError(400, "All fields are required");
  }


  if (!await Shop.MatchShopAndSubadmin(shop_no, req.user?.username)) {
    throw new apiError(400, "Invalid shop Number")
  }

  if (!await Bill.InsertBill(shop_no, type, amount, month_year)) {
    throw new apiError(500, "Something went wrong while inserting bill")
  }
  res.status(200).json(
    new apiResponse(200, {}, "Bill inserted successfully")
  )

})
const getBillsofShop = asyncHandler(async (req, res) => {
  //send shop_no of store from front end

  const shop_no = req.query.shop_no
  if (!shop_no) {
    throw new apiError(400, "Shop umber is required")
  }
  const bills = await Bill.getBillsOfShop(shop_no)
  if (!bills) {
    throw new apiError(500, "Internal server error in feteching bills")
  }
  res.status(200).json(
    new apiResponse(200, bills, "Bills fetched successfully")
  )
})

const addMonthlyRentofStore = asyncHandler(async (req, res) => {
  //this function takes username of subadmin and add montly 
  // rent of allocated shops for each subadmin
  const username = req.user?.username
  const shops = await Shop.getShopsBySubscriber(username)
  if (!shops) {
    throw new apiError(500, "Something went wrong")
  }

  for (let shop of shops) {
    await Rent.addMonthlyRent(shop.shop_no)
  }

  res.status(200).json(
    new apiResponse(200, {}, "Rent added successfully")
  )


})
const getRentsofStore = asyncHandler(async (req, res) => {
  const shop_no = req.query.shop_no
  if (!shop_no) {
    throw new apiError(400, "Shop umber is required")
  }

})








const getTillDateDayByDayReveneueOfStore = asyncHandler(async (req, res) => {
  //get day by day sales of store
})

const getTillDateAllExpensesOfStore = asyncHandler(async (req, res) => {
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
      if (!await Shop.createShop(
        shop['shopno'],
        shop.location,
        shop.status,
        shop.rent,
        req.user?.username
      )) {
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

const updateRent = asyncHandler(async (req, res) => {
  const { shop_no, rent } = req.body
  if (!shop_no || !rent) {
    throw new apiError(400, "All fields are required")
  }
  if (!await Rent.updateRent(shop_no, rent)) {
    throw new apiError(500, 'something went wrong')
  }
  res.status(200).json(
    new apiResponse(200, {}, 'Rent update successfully')
  )

})
const getTotalRevenueOfMall = asyncHandler(async (req, res) => {
  const username = req.user?.username;
  const date = req.query.date;
  if (!date) {
    throw new apiError(400, "Date is required");
  }

  const revenue = await Rent.getRevenue(username, date);

  if (!revenue) {
    throw new apiError(500, "Internal server error");
  }

  res.status(200).json(
    new apiResponse(200, revenue, "Revenue fetched successfully")
  );
});


const addFeedback = asyncHandler(async (req, res) => {
  const { message, rating } = req.body;
  const username = req.user?.username;

  if ([message, rating].some((field) => field === undefined || String(field).trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const numericRating = Number(rating);
  if (isNaN(numericRating) || numericRating < 0.0 || numericRating > 5.0) {
    throw new apiError(400, "Invalid Rating entered");
  }
  const feedback = await Feedback.addingFeedback(username, message, numericRating);
  if (!feedback) {
    throw new apiError(500, "Something went wrong");
  }
  res.status(200).json(new apiResponse(200, feedback, 'Feedback added successfully'));
});


const getCustomerFeedback = asyncHandler(async (req, res) => {

  const username = req.user?.username

  const getFeedback = await Feedback.gettingCustomerFeedback(username);

  if (!getFeedback) {
    throw new apiError(400, "Something went wrong");
  }

  if (getFeedback.length === 0) {
    return res.status(404).json(
      new apiResponse(404, [], "No customer feedback found")
    );
  }

  res.status(200).json(
    new apiResponse(200, getFeedback, 'Customers Feedback Fetched successfully')
  )
})

const getExpensesOfMall = asyncHandler(async (req, res) => {
  const username = req.user?.username
  const date = req.query.date
  if (!date) {
    throw new apiError(400, "Date is required")
  }
  const expenses = await Rent.getExpenses(username, date)
  if (!expenses) {
    throw new apiError(500, "Internal server error")
  }
  res.status(200).json(
    new apiResponse(200, expenses, "Expenses fetched successfully")
  )
})

const getEmployeesAttendance = asyncHandler(async (req, res) => {

  const username=req.user?.username
    const {date}=req.query
    
    const attendance=await Attendance.getEmployeeAttendanceBySubadmin(username, date);
    if(!attendance){
      throw new apiError(400, "Something went wrong");
    }

  if (attendance.length === 0) {
    throw new apiResponse(200, attendance, "No data found");
  }

  res.status(200).json(
    new apiResponse(200, attendance, "Employees attendance fetched successfully")
  )
})


const getEmployeePayrollStatus = asyncHandler(async (req, res) => {

    const username=req.user?.username
   
    const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

    const payrollStatus=await Payroll.gettingEmployeePayrollStatus (username, today);
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

const generateMonthlyPayroll = asyncHandler(async (req, res) => {

    const username=req.user?.username
    const {date}=req.body

    const checkPayrolls=await Payroll.IsPayrollGenerated(username, date);
    if(checkPayrolls.length>0){
      throw new apiError(400, "Payrolls already generated for this month");
    }

  const generatedPayrolls = await Payroll.generatingEmployeesMonthlyPayroll(username, date);
  if (!generateMonthlyPayroll) {
    throw new apiError(400, "Something went wrong")
  }

    res.status(200).json(
      new apiResponse(200, generatedPayrolls, "Monthly Payrolls generated succesfully")
    );
})
//@subadmin_username, @ssn int, @amount int, @method varchar(255), @type varchar(20), @date DATE

const updatePayroll=asyncHandler(async(req, res)=>{

    const {ssn, amount, method, type, date}=req.body
    const subadmin_username=req.user?.username

    if([method, type].some((field)=>{
      field==undefined || field.trim()==""
    }))
    {
      throw new apiError(400,"All fields are required")
    }

    if(isNaN(ssn)){
      throw new apiError(400, "invalid ssn")
    }

    if(isNaN(amount)||amount<1){
      throw new apiError(400, "invalid amount")
    }

    const updated=await Payroll.updatePayroll(subadmin_username, ssn, amount, method, type, date);

    if(!updated){
      throw new apiError(400, "Something went wrong")
    }

    res.status(200).json(
      new apiResponse(200, updated, "Payroll of employee updated succesfully")
    );
})

const addNewEmployee=asyncHandler(async(req, res)=>{

  // name, email, phone#, role_id, salary, (sudadmin_username)
  const { ssn, name, email, phone, role_id, salary } = req.body
  const username = req.user?.username

    if([name, email].some((field)=>{
      field==undefined || field.trim()==""
    }))
    {
      throw new apiError(400,"All fields are required")
    }

  if (isNaN(ssn)) {
    throw new apiError(400, "invalid ssn");
  }

    let existing = await Employee.getEmployeeBySSN(ssn);
    if(existing.length>0){
      throw new apiError(400,"ssn already exists")   
    }

  if (!validateEmail(email)) {
    throw new apiError(400, "Invalid email")
  }

  let existingEmployee = await Employee.getEmployeeByEmail(email);

  if (existingEmployee.length > 0) {
    throw new apiError(400, "email already exists")
  }

  if (isNaN(phone) || phone.length != 11) {
    throw new apiError(400, "Invalid phone number");
  }

  if (isNaN(role_id)) {
    throw new apiError(400, "Invalid role id");
  }

  if (isNaN(salary) || parseFloat(salary) <= 0) {
    throw new apiError(400, "Invalid salary");
  }

  let newEmployee = await Employee.addEmployee(ssn, name, email, phone, role_id, salary, username);
  if (!newEmployee) {
    throw new apiError(400, "something went wrong")
  }

  res.status(200).json(
    new apiResponse(200, newEmployee, "New employee added succesfully")
  );
});

const getEmployeesBySubadmin=asyncHandler(async(req, res)=>{

  const username = req.user?.username

  const employees=await Employee.getEmployeesBySubadmin(username);

  if(!employees){
    throw new apiError(400, "something went wrong")
  }
  res.status(200).json(
      new apiResponse(200, employees, "Employees fetched by subadmin succesfully")
    );
})


const attendanceRecords=[];

const updateAttendance = asyncHandler(async (req, res) => {

  //here i'm assuming that subadmin ko sirf apny hi employees show horhy hongy jin me sy wo select kr skta he... is liye ssn validate krny ki zrurt ni

  const { ssn, status, date } = req.body;

  if([status].some((field)=>{
    field==undefined || field.trim()==""
  }))
  {
    throw new apiError(400,"All fields are required")
  }

  if(isNaN(ssn)){
    throw new apiError(400, "invalid ssn");
  }

  if (!date || isNaN(Date.parse(date))) {
    throw new apiError(400, "Invalid date entered");
  }

  const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

  if (date > today) {
    throw new apiError(400, "Future date can not be entered")
  }

  if (status != "present" && status != "absent") {
    throw new apiError(400, "attendance status invalid");
  }

  const existingIndex = attendanceRecords.findIndex(
    (record) => record.ssn === ssn && record.date === new Date(date).toISOString().split('T')[0]
  );

  // issy ye ensure horha he ky agr aik employee ko present krky baad me ussi time dobara absent krdia, to value overwrite ho jaye gi 
  if (existingIndex !== -1) {

    attendanceRecords[existingIndex] = {
      ssn,
      status: status.toLowerCase(),
      date: new Date(date).toISOString().split('T')[0],
    };
  } else {
    attendanceRecords.push({
      ssn,
      status: status.toLowerCase(),
      date: new Date(date).toISOString().split('T')[0],
    });
  }

  // console.log(attendanceRecords);

  res.status(200).json(
    new apiResponse(200, "Employee attendance added in array successfully")
  );
})

const saveAttendance = asyncHandler(async (req, res) => {

  if (attendanceRecords.length === 0) {
    throw new apiError(400, "No attendance records to save");
  }

  const saving = await Attendance.saveEmployeesAttendance(attendanceRecords);

  if (!saving) {
    throw new apiError(400, "something went wrong");
  }

  res.status(200).json(
    new apiResponse(200, saving, "Employee attendance saved successfully")
  );

});

const generateAttendance = asyncHandler(async (req, res) => {

  const username=req.user?.username
  
  const today = new Date().toISOString().split('T')[0]; 

  const isgenerate=await Attendance.getEmployeeAttendanceBySubadmin(username, today);
  if(isgenerate.length>0){
    throw new apiError(200, "attendance already generated for today");
  }

    const generate = await Attendance.generateEmployeeAttendance(today, username);

  if (!generate) {
    throw new apiError(400, "something went wrong");
  }

  res.status(200).json(
    new apiResponse(200, generate, "Employee attendance generated successfully")
  );
});

const getCustomers = asyncHandler(async (req, res) => {
  const username = req?.user.username
  const customers = await User.getUsersBySubadmin(username)
  res.status(200).json(new apiResponse(200, customers, "Customer fecthed successfully"))

})

const getMonthlyRentPayment=asyncHandler(async(req,res)=>{
  const username=req.user?.username
  const rents=await Rent.getMonthlyRent(username)
  if(!rents)
  {
    throw new apiError(500,"something went wrong")
  }
  res.status(200).json(new apiResponse(200,rents,"Rents fetched successfully"))
})

export {getExpensesOfMall,getTotalRevenueOfMall,getAllShops,addCustomer,addShopsInBulk,allocateShopToStore,activateStore,getAllStores,insertBill,getBillsofShop,addMonthlyRentofStore,updateRent, addFeedback, getCustomerFeedback, getEmployeesAttendance, getEmployeePayrollStatus, generateMonthlyPayroll, updateAttendance, saveAttendance, generateAttendance,addNewEmployee,getCustomers, getEmployeesBySubadmin, updatePayroll, getMonthlyRentPayment}


//->deleteashop->it should also delete all it's asssociated data like store that was in it
//->gross revenue of mall->till date in that month
//->expenses of mall->till date in month
//->net profit of mall->till date in month
//->active subscribtions of mall
//->all subscriptions of mall->with date of subscription
//->buy->price 25$-> wo apny account details dega aur subscription purchase krlega

