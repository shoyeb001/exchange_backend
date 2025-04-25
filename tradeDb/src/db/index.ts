import { drizzle } from 'drizzle-orm/node-postgres';
import { config } from '../config';
import { trade, userBalance } from './schema';
const schema = {
    trade,
    userBalance
}
const db = drizzle(config.DATABASE_URL!, { schema, logger: false });
export default db;
