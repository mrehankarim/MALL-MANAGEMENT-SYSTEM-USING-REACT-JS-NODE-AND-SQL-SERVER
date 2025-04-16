import { sql, poolPromise } from "../config/dbconfig.js"

const Shop = {
    async getAllShopBySubAdmin(username) {

        const pool = await poolPromise
        const shoprecords = await pool.request()
            .input('shopowner', sql.VarChar, username)
            .query(`
            SELECT * FROM ShopRent
            where shopowner=@shopowner`)
            
        return shoprecords.recordset
    },
    async createShop(id,location,status,rent,subadmin)
    {
        const pool = await poolPromise
        try {
            await pool.request()
  .input('shop_no', sql.Int, id)
  .input('location', sql.VarChar, location)
  .input('status', sql.VarChar, status)
  .input('shopowner', sql.VarChar, subadmin)
  .input('rent',sql.Decimal,rent)
  .execute('addShop')
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    },
    async getSubadmin(shop_no)
    {
        const pool=await poolPromise
        const subadmin=await pool.request()
        .input('shop_no',sql.Int,shop_no)
        .query(`
            SELECT shopowner
            FROM Shop
            where shop_no=@shop_no`)
            console.log(subadmin.recordset)
            return subadmin.recordset
    },
    async checkShopVacancy(shopNo)
    {
        const pool= await poolPromise
        const result=await pool.request()
        .input('shop_no',sql.Int,shopNo)
        .query(
            `
            SELECT shop_no 
            FROM Shop
            Where shop_no=@shop_no and status='vacant'
            `
        )
        return result.recordset.length===0?false:true
    }
}

export default Shop