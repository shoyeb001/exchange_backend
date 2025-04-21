const {PORT}=require("./config");
const express =require("express");
const httpProxy =require("express-http-proxy");

const app=express();
app.use("/auth",httpProxy('http://auth:3001'))
app.use("/trade",httpProxy('http://trade:3002'))


app.listen(PORT,()=>{
    console.log(`Gateway server running on PORT ${3000}`)
})