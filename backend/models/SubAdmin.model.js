import {sql,poolPromise} from "../config/dbconfig.js"

const SubAdmin={
    async getSubAdminByUsername(username)
    {
        const pool=await poolPromise
        const user=await pool.request().input('username',sql.VarChar,username)
        .execute('GET_USER_BY_USERNAME')
        return user
    },
    async getSubAdminByEmail(email)
    {
        const pool=await poolPromise
        const user=await pool.request().input('email',sql.VarChar,email)
        .execute('GET_USER_BY_EMAIL')
        return user
    },
    async updateSubAdminPassword(email, password) {
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

    async createSubAdmin(user)
    {
        try {
            const pool=await poolPromise
        await pool.request()
        .input('username',sql.VarChar,user.username)   
        .input('role',sql.VarChar,user.role)   
        .input('fname',sql.VarChar,user.firstName)   
        .input('lname',sql.VarChar,user.lastName)   
        .input('email',sql.VarChar,user.email)   
        .input('password',sql.VarChar,user.password)
        .query(`INSERT INTO Personnel
            ('username','role','fname','lname','email','password')
            VALUES
            (@username,@role,@fname,@lname,@email,@password)
            `)
            return true 
        } catch (err) {
            console.log("USER could not be created",err)
            return false
        }
    }
}

export default SubAdmin

//getSubAdminByUsername
//getSubadminbyemail
//updatePassword->EMAIL
//updateRefreshToken