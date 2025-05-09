import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import userRouter from './routes/user.routes.js'
import customerRouter from './routes/customer.route.js'
import subscriber from './routes/subadmin.route.js'
import admin from './routes/admin.routes.js'
dotenv.config()
const app=express()
const PORT=3000 || process.env.PORT


app.use(cors(
    {
    origin: 'http://localhost:5173',
  credentials: true, 
}
))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({limit:"16kb",extended:true}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/user",userRouter)
app.use("/api/v1/subscriber",subscriber)
app.use("/api/v1/customer",customerRouter)
app.use("/api/v1/admin",admin)

app.listen(PORT,()=>{
    console.log(`Application is running on http://localhost:${PORT}`)
})