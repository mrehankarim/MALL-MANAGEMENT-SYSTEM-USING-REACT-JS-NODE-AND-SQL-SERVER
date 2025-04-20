import { sql,poolPromise } from "../config/dbconfig.js";

const DailyStoreRevenue={
    async getDailytRevenue(startDate,endDate,store_id)
    {
        try {
            const pool=await poolPromise
        const result=await pool.request()
        .input('startDate',sql.Date,startDate)
        .input('endDate',sql.Date,endDate)
        .input('store_id',sql.Int,store_id)
        .execute('getRevenueOfStoreBetweenDates')
        return result.recordset
            
        } catch (error) {
            console.log('Error in fetching store daily revenue')
            
        }
        
    }

}

export default DailyStoreRevenue