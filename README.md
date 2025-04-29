# Exchange - Trade with crypto (A Binance Simulator)

> This is a Binance Sumulator application backend that allows users to trade with cryptocurrencies. Its focus on the architecture and trading part not web3. Here we follow the microservice architecture.

## 🚀 Features

- Users can create an account and login
- User can add funds to their account with a payment gateway
- User can place buy and sell orders
- User can track real-time order status, trades, order book and k-line chart
- User can cancel orders
- User can view account balance

## 🛠 Tech Stack

- Backend: Node.js / Express / MongoDB / PostgreSQL / TypeScript
- Auth: JWT / OAuth
- Others: Redis / Docker / Prisma / PubSubs / WebSockets / Microservices

## 📦 Installation

```bash
git clone https://github.com/shoyeb001/exchange_backend
cd exchange_backend
docker compose up -d
```

## 🛠 Todos

- The tradeId is same for all trades (solve bug)
