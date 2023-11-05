require("dotenv").config()
import express, {Application} from "express"
import { migrator } from "./libs/migrator"
import bodyParser from "body-parser"

import routes from "./routes/MainRouter"

const app: Application = express()
const port: number = <number><any>process.env.PORT || 3000

app.use(bodyParser.json())

// app.use("/", (req, res)=>{
// res.send({BrowserSays: `Hello this is vehicle test app`})
// })
app.use(routes)

app.listen(port, async()=> {
    await migrator()
    console.log(`This project is running on Port ${port}`)
})

