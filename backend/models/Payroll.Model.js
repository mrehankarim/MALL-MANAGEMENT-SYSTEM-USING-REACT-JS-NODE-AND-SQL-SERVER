import { sql, poolPromise } from "../config/dbconfig.js"
import { getEmployeePayrollStatus, generateMonthlyPayroll, updatePayroll } from "../controllers/subadmin.controller.js"

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
    },
//@subadmin_username, @ssn int, @amount int, @method varchar(255), @type varchar(20), @date DATE
    async updatePayroll(subadmin_username, ssn, amount, method, type, date){
        try{
            const pool = await poolPromise
            const update=await pool.request()
            .input('subadmin_username', sql.VarChar, subadmin_username)
            .input('ssn', sql.Int, ssn)
            .input('amount', sql.Int, amount)
            .input('method', sql.VarChar, method)
            .input('type', sql.VarChar, type)
            .input('date', sql.Date, date)
            .execute('updatePayroll')
            return true
        }catch(error){
            console.log("Error in updating employee payroll", error)
            return false;
        }
    }
}

export default Payroll