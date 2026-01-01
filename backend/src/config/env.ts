import dotenv from "dotenv"

dotenv.config({quiet:true})

export const ENV = {
    port : process.env.PORT,
    node_env : process.env.NODE_ENV,
    database_url : process.env.DATABASE_URL,
    database_pool_size: process.env.DATABASE_POOL_SIZE,
    cp_key: process.env.CLERK_PUBLISHABLE_KEY,
    cs_key: process.env.CLERK_SECRET_KEY,
    frontend_url: process.env.FRONTEND_URL
}