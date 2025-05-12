import { RedisManager } from "./services/redisManager";
import { TradeManager } from "./services/TradeManager";
import { startTickKline } from "./utils/tickKline";

async function main() {
    const engine = new TradeManager();
    // startTickKline();
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