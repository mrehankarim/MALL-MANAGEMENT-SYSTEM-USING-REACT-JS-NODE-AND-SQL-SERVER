import dotenv from 'dotenv'
dotenv.config()
import sql from 'mssql'

const dbConfig={
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DATABASE,
    server:process.env.DB_SERVER,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      },    
    options: {
        encrypt: false, 
        enableArithAbort: true,
        trustServerCertificate: true,
      },
}

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then((pool) => {
    console.log(`Connected to MSSQL Database: ${process.env.DATABASE}`);
    return pool;
  })
  .catch((err) => {
    console.error(` Database Connection Failed! Error:`, err);
  });


export{sql,poolPromise}