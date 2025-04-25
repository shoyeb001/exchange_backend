import { defineConfig } from 'drizzle-kit';
import { config } from './config';
export default defineConfig({
    out: "./src/db/migrations",
    schema: './src/db/schema/index.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: config.DATABASE_URL!,
    },
});
