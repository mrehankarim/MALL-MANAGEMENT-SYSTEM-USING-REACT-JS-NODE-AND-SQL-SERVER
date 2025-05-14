import { sql, poolPromise } from "../config/dbconfig.js"

const Store =
{
    async createStore(storeData) {
        try {
            const pool = await poolPromise
            //storeName,shopNo,ownerUsername,category
            const result = pool.request()
                .input('store_name', sql.VarChar, storeData.storeName)
                .input('shop_no', sql.Int, storeData.shopNo)
                .input('store_owner_username', sql.VarChar, storeData.ownerUsername)
                .input('category', sql.VarChar, storeData.category)
                .query(`
            INSERT INTO Store
            (store_name,shop_no,store_owner_username,category)
            VALUES
            (@store_name,@shop_no,@store_owner_username,@category)
            `)
            await pool.request().
                input('shop_no', sql.Int, storeData.shopNo)
                .query(
                    `
                UPDATE Shop
                SET status='occupied'
                where shop_no=@shop_no
                `
                )
            return true

        } catch (error) {
            console.log("Error in createStore: ", error)
            return false
        }

    },
    async activateStore(store_id) {
        try {
            const pool = await poolPromise

            await pool.request().
                input('store_id', sql.Int, store_id)
                .query(`
            UPDATE STORE
			SET status='active'
			where store_id=@store_id`)
            return true
        } catch (error) {
            console.log("Error in activate Store: ", error)
            return false
        }

    },
    async insertDailyRevenue(store_id, total_earnings, date) {
        try {
            const pool = await poolPromise
            await pool.request()
                .input('store_id', sql.Int, store_id)
                .input('total_earnings', sql.Decimal, total_earnings)
                .input('date', sql.Date, date)
                .execute('InsertDailySales')
            return true

        } catch (error) {
            console.log(error)
            return false
        }


    },
    async getStoresBySubscriber(username) {
        try {
            const pool=await poolPromise
        const result=await pool.request()
        .input('username',sql.VarChar,username)
        .query(`
            SELECT * FROM StoresWithRent
            WHERE shopowner=@username`)
            return result.recordset
        } catch (error) {
            console.log("Error in getStoreBysubscriber",error)
        }
        

    }
}

export default Store