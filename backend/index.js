import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import userRouter from './routes/user.routes.js'
dotenv.config()
const app=express()
const PORT=3000 || process.env.PORT


app.use(cors())
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({limit:"16kb",extended:true}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/user",userRouter)

app.listen(PORT,()=>{
    console.log(`Application is running on http://localhost:${PORT}`)
})