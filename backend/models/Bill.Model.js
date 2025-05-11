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

        async payPendingBill(bill_id, transaction_id){
            try {
                const pool=await poolPromise
                const result=await pool.request()
                .input('bill_id',sql.Int,bill_id)
                .input('transaction_id',sql.Int,transaction_id)
                .execute('payPendingBill')
                return result.recordset   
            } catch (error) {
                console.log("Error in paying pending bill")
            }
        }
}

export default Bill