import { sql, poolPromise } from "../config/dbconfig.js"
import { getEmployeePayrollStatus, generateMonthlyPayroll } from "../controllers/subadmin.controller.js"

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
    },

    async generatingEmployeesMonthlyPayroll(subadmin_username, month_year){
        
        try {
            const pool = await poolPromise

            const record=await pool.request()
                .input('subadmin_username', sql.VarChar, subadmin_username)
                .input('month_year', sql.Date, month_year)
                .execute('GenerateMonthlyPayroll')
            return true
        } catch (error) {
            console.log("Error in generating Employees Monthly Payrolls", error)
            return false;
        }
    },

    async IsPayrollGenerated(subadmin_username, month_year){

        try {
            const pool = await poolPromise

            const record=await pool.request()
                .input('subadmin_username', sql.VarChar, subadmin_username)
                .input('month_year', sql.Date, month_year)
                .execute('IsPayrollGenerated')
            return record.recordset
        } catch (error) {
            console.log("Error in checking Employees Monthly Payrolls", error)
            return false;
        }
    }
}

export default Payroll