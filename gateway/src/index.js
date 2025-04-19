const {PORT}=require("./config");
const express =require("express");
const httpProxy =require("express-http-proxy");

const app=express();
app.use("/auth",httpProxy("http://localhost:3001"))

app.listen(PORT,()=>{
    console.log(`Gateway server running on PORT ${3000}`)
})