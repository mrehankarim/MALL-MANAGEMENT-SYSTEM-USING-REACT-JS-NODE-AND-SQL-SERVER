import {sql,poolPromise} from "../config/dbconfig.js"
import { getActiveSubscriber } from "../controllers/admin.controller.js"

const Attendance={

    async getEmployeeAttendanceBySubadmin(subadmin_username, date){
        try {
            const pool=await poolPromise
            const record=await pool.request()
            .input('subadmin_username', sql.VarChar, subadmin_username)
            .input('date', sql.Date, date)
            .execute('GetEmployeeAttendance_By_Subadmin')
            return record.recordset
        } catch (error) {
            console.log("Error in getting employees attendance",error)
            return false
        }

    }


}

export default Attendance