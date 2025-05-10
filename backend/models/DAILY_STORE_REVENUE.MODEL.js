import { sql,poolPromise } from "../config/dbconfig.js";
import { getMonthlyRevenue } from "../controllers/customer.controller.js";

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
    },

    async getTotalRevenueOfStore(shop_no){
        try{
            const pool=await poolPromise
            const result=await pool.request()
            .input('shop_no',sql.Int,shop_no)
            .execute('TotalStoreRevenue')
            return result.recordset
        }catch(error){
            console.log('Error in fetching total revenue of store')
        }
    },
    
    async getMonthlyRevenueOfStore(shop_no){
        try{
            const pool=await poolPromise
            const result=await pool.request()
            .input('shop_no',sql.Int,shop_no)
            .execute('StoreRevenueEachMonth')
            return result.recordset
        }catch(error){
            console.log('Error in fetching monthly revenue of store')
        }
    }
}

export default DailyStoreRevenue