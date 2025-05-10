import { sql, poolPromise } from "../config/dbconfig.js"

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
                console.log("Error in fecthing pending bills")
            }
        }
}

export default Bill