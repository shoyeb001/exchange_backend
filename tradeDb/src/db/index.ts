import { drizzle } from 'drizzle-orm/node-postgres';
import { config } from '../config';
import { trade, userBalance, order } from './schema';
const schema = {
    trade,
    userBalance,
    order
}
const db = drizzle(config.DATABASE_URL!, { schema, logger: false });
export default db;
