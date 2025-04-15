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
    },
    async createShop(id,location,status,subadmin)
    {
        const pool = await poolPromise
        try {
            await pool.request()
  .input('shop_no', sql.Int, id)
  .input('location', sql.VarChar, location)
  .input('status', sql.VarChar, status)
  .input('owner', sql.VarChar, subadmin)
  .query(`
    INSERT INTO Shop (shop_no, location, status, shopowner)
    VALUES (@shop_no, @location, @status, @owner)
  `);
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
}
export default Shop