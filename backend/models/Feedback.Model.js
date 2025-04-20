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
        
    }

}

export default Feedback