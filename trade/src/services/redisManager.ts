import { createClient, RedisClientType } from "redis";

export class RedisManager {
    private client: RedisClientType;
    private publisher: RedisClientType;
    private subscriber: RedisClientType;
    private static instance: RedisManager;

    private constructor() {
        this.client = createClient();
        this.client.connect();
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
    public async get(key: string) {
        return await this.client.get(key)
    }
    public async set(key: string, value: string, time?: number) {
        if (time) {
            await this.client.set(key, value, {
                EX: time
            });
        } else {
            await this.client.set(key, value)
        }
    }

    public async delete(key: string) {
        await this.client.del(key);
    }
    public getRandomClientId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    public sendAndAwait(message: any) {
        return new Promise((resolve) => {
            const id = this.getRandomClientId();
            this.subscriber.subscribe(id, (message) => {
                this.subscriber.unsubscribe(id);
                resolve(message);
            });
            this.publisher.lPush("messages", JSON.stringify({ clientId: id, message }))
        })
    }
}