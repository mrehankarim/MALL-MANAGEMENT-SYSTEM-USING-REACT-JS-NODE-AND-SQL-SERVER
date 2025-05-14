import {sql,poolPromise} from "../config/dbconfig.js"

const Employee={

    async getEmployeeByEmail (email){
        try{
            const pool=await poolPromise
            const user=await pool.request().input('email',sql.VarChar,email)
            .execute('GET_EMPLOYEE_BY_EMAIL')
            return (user.recordset)
        }catch(error){
            console.log("Error is getting employee by email: ", error)
            return false
        }
    },

    async addEmployee(ssn, name, email, phone, role_id, salary, username){
        try{
            const pool=await poolPromise
            const user=await pool.request()
            .input('ssn',sql.Int,ssn)
            .input('name',sql.VarChar,name)
            .input('email',sql.VarChar,email)
            .input('phone',sql.VarChar,phone)
            .input('role_id',sql.Int,role_id)
            .input('salary',sql.Decimal,salary)
            .input('subscriber',sql.VarChar,username)
            .execute('addNewEmployee')
            return true
        }catch(error){
            console.log("Error in adding new employee: ", error)
            return false
        }
    },

    async getEmployeeBySSN(ssn){
        try{
            const pool=await poolPromise
            const user=await pool.request()
            .input('ssn', sql.Int, ssn)
            .execute('GET_EMPLOYEE_BY_SSN')
            return (user.recordset)
        }catch(error){
            console.log("error in getting employee by ssn: ", error);
        }
    },

    async getEmployeesBySubadmin(username){
        try{
            const pool=await poolPromise
            const employees=await pool.request()
            .input('username', sql.VarChar, username)
            .query(`select * from EMPLOYEE
                where subscriber=@username`)
            return (employees.recordset)

        }catch(error){
            console.log('error in getting employees by subadmin', error);
        }
    }
}

export default Employee