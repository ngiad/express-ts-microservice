import dotenv from "dotenv"
dotenv.config()

export const config = {
    rpc : {
        productBranch : process.env.RPC_PRODUCT_BRANCH || "http://localhost:3321",
        productCategory : process.env.RPC_PRODUCT_CATEGORY || "http://localhost:3322",
        userRPC : process.env.RPC_USER || "http://localhost:3321"
    },

    secretKey : process.env.SECRRTKEY || "nghia dep zai",
    product : process.env.PRODUCTION || "dev"
}