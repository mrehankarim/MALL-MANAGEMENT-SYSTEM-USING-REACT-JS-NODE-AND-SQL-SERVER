import { sql, poolPromise } from "../config/dbconfig.js"
import { getPendingRentsofShop } from "../controllers/customer.controller.js"

const Bill={
    async InsertBill(shop_no,type,amount,month_year)
    {
        try {
            const pool=await poolPromise
        pool.request()
        .input('shop_no',sql.Int,shop_no)
        .input('type',sql.VarChar,type)
        .input('amount',sql.Decimal,amount)
        .input('month_year',sql.Date,month_year)
        .execute('AddBill')
        return true
            
        } catch (error) {
            console.log("Error in bill insertion",error)
            return false
        }
        

        },
        async getBillsOfShop(shop_no)
        {
            try {
                const pool=await poolPromise
                const result=await pool.request()
                .input('shop_no',sql.Int,shop_no)
                .execute('GetBillsStatusByShop')
                return result.recordset
                
            } catch (error) {
                console.log("Error in Bill")
                return false
            }
            
        },
        async getActiveBills(shop_no)
        {
            try {
                const pool=await poolPromise
                const result=await pool.request()
                .input('shop_no',sql.Int,shop_no)
                .execute('getActiveBills')
                return result.recordset   
            } catch (error) {
                console.log("Error in fecthing sum of pending bills")
            }
        },

        async getPendingBillsofShop(shop_no){
             try {
                const pool=await poolPromise
                const result=await pool.request()
                .input('shop_no',sql.Int,shop_no)
                .execute('getAllPendingBillsOfStore')
                return result.recordset   
            } catch (error) {
                console.log("Error in fecthing list of pending bills")
            }
        },

        async payPendingBill(amount, method, type, username, shop_no, month_year){
            try {
                const pool=await poolPromise
                const result=await pool.request()
                .input('amount',sql.Decimal(10, 2),amount)
                .input('method',sql.VarChar,method)
                .input('type',sql.VarChar,type)
                .input('username',sql.VarChar,username)
                .input('shop_no',sql.Int,shop_no)
                .input('month_year',sql.Date,month_year)
                .execute('payPendingBill')
                return true  
            } catch (error) {
                console.log("Error in paying pending bill", error)
                return false
            }
        }
}

export default Bill