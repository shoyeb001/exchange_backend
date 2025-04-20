import { createClient, RedisClientType } from "redis";
export class RedisManager {
    private publisher: RedisClientType;
    private subscriber: RedisClientType;
    private static instance: RedisManager;

    constructor() {
        this.publisher = createClient();
        this.publisher.connect();
        this.subscriber = createClient();
        this.subscriber.connect();
    }
    public static getInstance() {
        if (!this.instance) {
            this.instance = new RedisManager();
        }
        return this.instance;
    }
    public pushMessage(message: any) {
        this.publisher.lPush("db_processor", JSON.stringify(message));
    }
    public sendToApi(clientId: string, message: any) {
        this.subscriber.publish(clientId, JSON.stringify(message));
    }
    public async popMessageFromQueue(name: string) {
        return await this.subscriber.rPop(name)
    }
}