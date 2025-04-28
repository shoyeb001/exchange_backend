import dotenv from 'dotenv';
dotenv.config();

export const config = {
    DATABASE_URL: process.env.DATABASE_URL || '',
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3004
};
