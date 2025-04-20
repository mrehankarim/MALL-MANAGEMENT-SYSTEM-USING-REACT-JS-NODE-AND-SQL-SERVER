import { sql,poolPromise } from "../config/dbconfig.js";

const Rent={

    
    async addMonthlyRent(shop_no)
    {
        try {
            const pool=await poolPromise

            await pool.request()
            .input('shop_no',sql.Int,shop_no)
            .execute('addMonthlyRent')
            return true
            
        } catch (error) {
            console.log('Error in adding rent',error)
            return false
        }
        
        

        
    },
    async getActiveRentsByshop(shop_no)
        {
            try {
                const pool=await poolPromise

            const result=await pool.request().
            input('shop_no',sql.Int,shop_no)
            .execute('getActiveRents')
            return result.recordset
                
            } catch (error) {
                console.log("error in fecthing active bills",error)
                
            }
            
        },
        async updateRent(shop_no,rent)
        {
            try {
                const pool =await poolPromise
                await pool.request().input('shop_no',sql.Int,shop_no)
                .input('new_rent',sql.Decimal,rent)
                .execute('UpdateRent')
                return true
                
            } catch (error) {
                console.log('Error in updating rent')
                return false
                
            }
            
        },
        async getRevenue(username,date)
        {
            try {
                const pool=await poolPromise
                const result=await pool.request().input('subadmin_username',sql.VarChar,username)
                .input('date',sql.Date,date)
                .execute('GrossRevenueOfMall')
                return result.recordset
                
            } catch (error) {
                console.log('Error in fetching revenue',error)
                
            }
            
        },
        async getExpenses(username,date)
        {
            try {
                const pool=await poolPromise
                const result=await pool.request().input('subadmin_username',sql.VarChar,username)
                .input('date',sql.Date,date)
                .execute('ExpensesOfMall')
                return result.recordset
                
            } catch (error) {
                console.log('Error in fetching expeses',error)
                
            }
            
        }

}

export default Rent