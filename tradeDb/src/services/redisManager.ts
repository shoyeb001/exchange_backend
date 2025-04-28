import { createClient, RedisClientType } from "redis";
export class RedisManager {
    private publisher: RedisClientType;
    private static instance: RedisManager;

    private constructor() {
        this.publisher = createClient({
            url: 'redis://redis:6379'
        });
        this.publisher.connect();
    }
    public static getInstance() {
        if (!this.instance) {
            this.instance = new RedisManager();
        }
        return this.instance;
    }
    public async popMessageFromQueue(name: string) {
        return await this.publisher.rPop(name)
    }
}