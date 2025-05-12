import axios from "axios";
const Base_URL = "http://localhost:3000/trade/api/order/create";
const tokens = ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTZmMDgzNjU3OWM0YzRhMjk4MWMxNCIsInJvbGUiOiJ1c2VyIiwic2Vzc2lvbklkIjoic2Vzc182ODE2ZjA4MzY1NzljNGM0YTI5ODFjMTRfMTc0NjMzMzgyNzYyMyIsImlhdCI6MTc0NjMzMzgyNywiZXhwIjoxNzQ2OTM4NjI3fQ.ITPnM7HfsO_nRD-7A6kGm7HcOb1x1fdo7QdXxP4wVAc", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTRlNzQ4ZjZiOWRkYzk2ODFkYzRhZiIsInJvbGUiOiJ1c2VyIiwic2Vzc2lvbklkIjoic2Vzc182ODE0ZTc0OGY2YjlkZGM5NjgxZGM0YWZfMTc0NjMzNDAzMTI5NyIsImlhdCI6MTc0NjMzNDAzMSwiZXhwIjoxNzQ2OTM4ODMxfQ.jFanPYyma8npyIboxhdh28YcwsXzYytgkXewB2Sa2GQ"]
const market = "BTC_USDC";

const placeOrders = async()=>{
    const buyOrder = {
        market: "BTC_USDC",
        price: (500 - Math.random() * 1).toFixed(1),
        quantity: 1,
        side: "buy",
        type: "market",
        timeInForce: "GTC"
    }
    const sellOrder = {
        market: "BTC_USDC",
        price: (480 + Math.random() * 1).toFixed(1),
        quantity: 1,
        side: "sell",
        type: "market",
        timeInForce: "GTC"
    }
    const res = await axios.post(Base_URL, buyOrder, {
        headers:{
            Authorization:`Bearer ${tokens[0]}`
        }
    });
    console.log(res.data);
    const res2 = await axios.post(Base_URL, sellOrder, {
        headers:{
            Authorization:`Bearer ${tokens[1]}`
        }
    });
    console.log(res2.data)
}

while(true){
   await placeOrders()
}