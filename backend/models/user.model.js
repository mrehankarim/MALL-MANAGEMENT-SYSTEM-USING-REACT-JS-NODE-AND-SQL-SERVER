import { sql,poolPromise } from "../config/dbconfig.js";
const Users={


async getUser(){
    const pool=await poolPromise;
    const users=await pool.request().query('SELECT * FROM Personnel')
    console.log(users.recordset)
},
}
export default Users