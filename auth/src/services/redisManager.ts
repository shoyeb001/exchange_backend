import { createClient, RedisClientType } from "redis";

export class RedisManager {
    private client: RedisClientType;
    private publiser: RedisClientType;
    private static instance: RedisManager;

    private constructor() {
        this.client = createClient({
            url: 'redis://redis:6379'
        });
        this.client.connect();
        this.publiser = createClient({
            url: 'redis://redis:6379'
        });
        this.publiser.connect();
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
            await this.client.set(key, value, { EX: time });
        } else {
            await this.client.set(key, value);
        }
    }

    public async delete(key: string) {
        await this.client.del(key);
    }
}