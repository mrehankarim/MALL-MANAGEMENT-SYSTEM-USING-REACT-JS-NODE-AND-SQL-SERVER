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
    },

    async generateEmployeeAttendance(date, username){
        
        try{

            //yahan abhi stored procedure bnana he iska


        }catch(error){
            console.log("Error in generating employees attendance",error)
            return false;
        }
    },

    async saveEmployeesAttendance(records){

        try{
            const pool = await poolPromise;
            for (const record of records) {
                await pool.request()
                    .input('emp_ssn', sql.VarChar, record.ssn)
                    .input('status', sql.VarChar, record.status)
                    .input('date', sql.Date, record.date)
                    .execute('SetAttendance'); 
            }
            attendanceRecords.length = 0;
            return true;

        }catch(error){
            console.log("Error in saving employees attendance",error)
            return false;
        }
    }
}

export default Attendance