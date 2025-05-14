import { sql,poolPromise } from "../config/dbconfig.js";
import { getAllRentsOfShop } from "../controllers/customer.controller.js";

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
                console.log("error in fecthing sum of active rents",error)
            }
        },

        async getAllRentsOfShop(shop_no){
            try{
                const pool=await poolPromise
                const result=await pool.request()
                .input('shop_no',sql.Int,shop_no)
                .execute('GetMonthlyRentStatusByShop')
                return result.recordset
            }catch(error){
                console.log('Error in getting all rents of shop')
                return false
            }
        },

        async getPendingRentsOfShop(shop_no){
            try{
                const pool=await poolPromise
                const result=await pool.request()
                .input('shop_no',sql.Int,shop_no)
                .execute('getAllPendingRentsOfStore')
                return result.recordset
            }catch(error){
                console.log('Error in getting all pending rents of shop')
                return false
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

        async payMonthlyRent(amount, method, type, username, shop_no, month_year){
            try {
                const pool=await poolPromise
                const result=await pool.request()
                .input('amount',sql.Decimal(10, 2),amount)
                .input('method',sql.VarChar,method)
                .input('type',sql.VarChar,type)
                .input('username',sql.VarChar,username)
                .input('shop_no',sql.Int,shop_no)
                .input('month_year',sql.Date,month_year)
                .execute('payMonthlyRent')
                return true  
            } catch (error) {
                console.log("Error in paying pending rent", error)
                return false
            }
        },

        async getMonthlyRentOfStore(shop_no){
            try{
                const pool=await poolPromise
                const rent=await pool.request()
                .input('shop_no',sql.Int,shop_no)
                .query(`
                SELECT rent_amount
                FROM Rent
                where shop_no=@shop_no`)
                return rent.recordset
            }catch(error){
                console.log("error in getting monthly rent of store", error);
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
            
        },
        async getMonthlyRent(username)
        {
            try {
                
                let pool=await poolPromise
                const response=await pool.request()
                .input('username',sql.VarChar,username)
                .execute('getMonthlyRentPayment')
                return response.recordset
            } catch (error) {
                console.log(error)
            }
        }

}

export default Rent