import {sql,poolPromise} from "../config/dbconfig.js"

const Attendance={

    async getEmployeeAttendanceBySubadmin(subadmin_username, date){

        try {
            const pool=await poolPromise
            const record=pool.request()
            .input('subadmin_username', sql.VarChar, subadmin_username)
            .input('date', sql.date, date)
            .execute('GetEmployeeAttendance_By_Subadmin')
            return record.recordset
            
        } catch (error) {
            console.log("Error in bill insertion",error)
            return false
        }

    }


}

export default Attendance