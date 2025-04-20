import { sql,poolPromise } from "../config/dbconfig.js";

const Feedback={

    async getFeedbacks()
    {
        try {
            const pool=await poolPromise

        const result=await pool.request().query('SELECT * FROM FEEDBACK')
        return result.recordset
            
        } catch (error) {
            console.log("Error in fetching feedbacks")
        }
        
    },

    async addingFeedback(username, message, rating) {

        if (typeof rating === "string") {
            rating = parseFloat(rating);
        }

        if (typeof rating !== "number" || isNaN(rating) || rating < 0.0 || rating > 5.0 || !/^\d(\.\d)?$/.test(rating.toFixed(1))) {
            throw new Error("Invalid rating value. It must be a decimal between 0.0 and 5.0 with one decimal place.");
        }

        try {
            const pool = await poolPromise;

            await pool.request()
                .input('username', sql.VarChar, username)
                .input('message', sql.Text, message)
                .input('rating', sql.Decimal(2, 1), rating) 
                .execute('AddFeedback');
            return true;
        } catch (error) {
            console.log("Error in adding feedback:", error);
            return false;
        }
    },

    async gettingCustomerFeedback(username){

        try {
            const pool=await poolPromise
            const result=await pool.request()
            .input('username',sql.VarChar,username)
            .query(`
                SELECT *
                FROM Feedback
                WHERE username IN(
                SELECT P.username
                FROM Personnel AS P
                WHERE subadmin=@username
                )`)
                return result.recordset
            } catch (error) {
                console.log(`Error in getting customers feedback by subadmin: ${username}`,error)
            }
    }

}


export default Feedback