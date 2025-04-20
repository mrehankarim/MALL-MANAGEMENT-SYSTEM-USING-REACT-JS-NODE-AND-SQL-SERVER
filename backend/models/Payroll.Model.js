import { sql, poolPromise } from "../config/dbconfig.js"
import { getEmployeePayrollStatus } from "../controllers/subadmin.controller.js"

const Payroll={

    async gettingEmployeePayrollStatus(subadmin_username, currentdate){

        try {
            const pool = await poolPromise

            const record=await pool.request()
                .input('subadmin_username', sql.VarChar, subadmin_username)
                .input('current_date', sql.Date, currentdate)
                .execute('GetPayrollStatusOfEmployees')
            return record.recordset
        } catch (error) {
            console.log("Error in getting Employees' Payroll status:", error)
            return false;
        }
    }
}

export default Payroll