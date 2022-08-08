require("dotenv").config()
const express = require('express');
const cors = require("cors");
const app = express()
app.set("trust proxy", 1)
app.use(express.json())
app.use(cors())
app.use(express.static("./public"))
app.use("/api", require("./router/router"))
app.listen(3000, () => console.log("SERVER RUNNING"))