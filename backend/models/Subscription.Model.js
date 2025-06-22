import { sql,poolPromise } from "../config/dbconfig.js";

const Subscription={
    async getActiveSubscriber()
    {
        try {
            const pool=await poolPromise

           const result=await pool.request()
            .execute('getActiveSubscription')
            return result.recordset
        } catch (error) {
            console.log('Error in fecthing active subscriptions')
        }
    },
    async getAllSubscriptions()
    {
        try {
            const pool=await poolPromise
           const result=await pool.request()
            .execute('getAllSubscription')
            return result.recordset
        } catch (error) {
            console.log('Error in fecthing  subscriptions')
        }
    },
    async getTotalRevenue() {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .output('totalRevenue', sql.Int)
                .execute('TotalRevenue');
    
            const sales = result.output.totalRevenue;
            return sales;
        } catch (error) {
            console.log('Error in fetching revenues:', error);
            return null;
        }
    },
    
    async getTotalRevenueBySubscriber(username) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
            .input("username",sql.VarChar,username)
                .execute('GET_TOTAL_REVENUE_BY_SUBSCRIBER');
                return result.recordset
        } catch (error) {
            console.log('Error in fetching revenues:', error);
            return null;
        }
    },
    async getMonthByMonthSales() {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .execute('GET_MONTH_BY_MONTH_SALES');
                return result.recordset
        } catch (error) {
            console.log('Error in fetching revenues:', error);
            return null;
        }
    },
    async deactivateSubscription(subscription_id)
    {
        try {
            const pool =await poolPromise
            await pool.request()
            .input('subscription_id',sql.Int,subscription_id)
            .execute('DEACTIVATE_SUBSCRIPTION')
            return true
            
        } catch (error) {
            console.log("Erro rin de activating subscription",error)
            return false
        }
        
    },
    async getSubscriberData()
    {
        try {
            const pool=await poolPromise

            const result=await pool.request()
            .execute('getSubscribersData')
            return result.recordset
        } catch (error) {
            console.log(error)
        }
    },
    async getSubscriptionsBetweenDates(startDate,endDate)
    {
        try {
            const pool=await poolPromise

            const result=await pool.request()
            .input('startDate',sql.Date,startDate)
            .input('endDate',sql.Date,endDate)
            .execute('getSubscriptionsBetweenDates')
            return result.recordset
        } catch (error) {
            console.log(error)
        }
    }

    

}

export default Subscription