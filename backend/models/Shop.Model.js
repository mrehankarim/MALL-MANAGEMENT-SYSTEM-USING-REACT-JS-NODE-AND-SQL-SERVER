import { sql, poolPromise } from "../config/dbconfig.js"

const Shop = {
    async getAllShopBySubAdmin(username) {

        const pool = await poolPromise
        const shoprecords = await pool.request()
            .input('shopowner', sql.VarChar, username)
            .query(`
            SELECT * FROM Shop
            where shopowner=@shopowner`)
            
        return shoprecords.recordset
    }
}
export default Shop