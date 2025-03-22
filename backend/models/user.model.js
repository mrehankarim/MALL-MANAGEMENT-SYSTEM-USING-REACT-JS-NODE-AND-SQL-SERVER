import {sql,poolPromise} from "../config/dbconfig.js"

const User={
    async getUserByUsername(username)
    {
        const pool=await poolPromise
        const user=await pool.request().input('username',sql.VarChar,username)
        .execute('GET_USER_BY_USERNAME')
        return user.recordset
    },
    async getUserByEmail(email)
    {
        const pool=await poolPromise
        const user=await pool.request().input('email',sql.VarChar,email)
        .execute('GET_USER_BY_EMAIL')
        return (user.recordset)
    },
    async updateUserPassword(email, password) {
        try {
            const pool = await poolPromise;
            await pool.request()
                .input('password', sql.VarChar, password)
                .input('email', sql.VarChar, email)
                .execute('UPDATE_USER_PASSWORD');
            return true;
        } catch (err) {
            console.error("Password Updation failed", err);
            return false;
        }
    },   
    async updateRefreshToken(token,email){
        try {
            const pool=await poolPromise
            await pool.request().input('refreshToken',sql.VarChar,token)
            .input('email',sql.VarChar,email)
            .query('UPDATE Personnel set refreshToken=@refreshToken Where email=@email')
            return true
        } catch (error) {
            console.log('Updation of refreshToekn failed',error)
            return false
        }    
    },

    async createUser(user) {
        try {
            const pool = await poolPromise;
            await pool.request()
                .input('username', sql.VarChar, user.username)   
                .input('role', sql.VarChar, user.role)   
                .input('fname', sql.VarChar, user.firstName)   
                .input('lname', sql.VarChar, user.lastName)   
                .input('email', sql.VarChar, user.email)   
                .input('password', sql.VarChar, user.password)
                .input('subadmin', sql.VarChar, user.subadmin || null) // Setting NULL explicitly
                .query(`INSERT INTO Personnel (username, role, fname, lname, email, password, subadmin)
                        VALUES (@username, @role, @fname, @lname, @email, @password, @subadmin)`);
            return true;
        } catch (err) {
            console.log("USER could not be created:", err.message);
            return false;
        }
    }
    
    
}

export default User

//getSubAdminByUsername
//getSubadminbyemail
//updatePassword->EMAIL
//updateRefreshToken