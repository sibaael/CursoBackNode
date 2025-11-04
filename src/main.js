import express from "express"

import productoRouters from "./routes/producto.route.js"

const main = express()

main.use("/producto/", productoRouters)

const port = 8082;
/*main. */
