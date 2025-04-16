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
    },

    async allocateShop(store_name, shop_no, store_owner_username, category) {
        console.log("Input Parameters:", { store_name, shop_no, store_owner_username, category });
        try {
            const pool = await poolPromise;
            await pool.request()
                .input('store_name', sql.VarChar, store_name)
                .input('shop_no', sql.Int, shop_no)
                .input('store_owner_username', sql.VarChar, store_owner_username)
                .input('category', sql.VarChar, category)   
                .execute('AllocateShop');
            return true;
        } catch (err) {
            console.log("SHOP could not be allocated:", err.message);
            return false;
        }
    }

}
export default Shop