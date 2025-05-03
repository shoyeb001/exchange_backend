import axios from "axios";
const Base_URL = "http://localhost:3000/trade/api/order/create";
const tokens = ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTIyYzgzYTJhMmFmNjBkNTg0YWYyOCIsInJvbGUiOiJ1c2VyIiwic2Vzc2lvbklkIjoic2Vzc182ODEyMmM4M2EyYTJhZjYwZDU4NGFmMjhfMTc0NjAyMTUwNzA5NSIsImlhdCI6MTc0NjAyMTUwNywiZXhwIjoxNzQ2NjI2MzA3fQ.8ILwjP8kgVCH3-N73l7tFcYR09owVLfkphvnz_3CUp0", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTIyYzgzYTJhMmFmNjBkNTg0YWYyOCIsInJvbGUiOiJ1c2VyIiwic2Vzc2lvbklkIjoic2Vzc182ODEyMmM4M2EyYTJhZjYwZDU4NGFmMjhfMTc0NjAyMTUwNzA5NSIsImlhdCI6MTc0NjAyMTUwNywiZXhwIjoxNzQ2NjI2MzA3fQ.8ILwjP8kgVCH3-N73l7tFcYR09owVLfkphvnz_3CUp0"]
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
    await axios.post(Base_URL, buyOrder, {
        headers:{
            Authorization: tokens[0]
        }
    });
    await axios.post(Base_URL, sellOrder, {
        headers:{
            Authorization: tokens[1]
        }
    });
}

