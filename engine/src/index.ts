import { RedisManager } from "./services/redisManager";
import { TradeManager } from "./services/TradeManager";

async function main() {
    const engine = new TradeManager();
    while (true) {
        const response = await RedisManager.getInstance().popMessageFromQueue("messages")
        if (!response) {

        } else {
            console.log(response)
            engine.process(JSON.parse(response));
        }
    }
}
main();