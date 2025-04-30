import {sql,poolPromise} from "../config/dbconfig.js"

const Employee={

    async getEmployeeByEmail (email){
        const pool=await poolPromise
        const user=await pool.request().input('email',sql.VarChar,email)
        .execute('GET_EMPLOYEE_BY_EMAIL')
        return (user.recordset)
    }

}

export default Employee